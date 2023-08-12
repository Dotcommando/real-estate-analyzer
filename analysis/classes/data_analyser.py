import re
import numpy as np
import pandas as pd
from datetime import datetime
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection


class DataAnalyser:
    def __init__(self, start_date: datetime, end_date: datetime, collection: AsyncIOMotorCollection):
        self.start_date = start_date
        self.end_date = end_date
        self.collection = collection

    def clean_districts(self, df):
        # Создаем список городов
        cities = df['city'].unique().tolist()

        # Замена сокращений
        df['district'] = df['district'].replace({"Ag ": "Ag. ", "Agios ": "Ag. ", "Agia ": "Ag. ", "Apostolos ": "Ap. ", "Ap ": "Ap. ", "Panag ": "Panag. "}, regex=True)

        # Удаляем "Tourist Area"
        df['district'] = df['district'].replace({" Tourist Area": ""}, regex=True)

        # Обрабатываем скобки
        df['district'] = df['district'].astype(str).apply(lambda x: re.sub(r'\((.*?)\)', r' - \1', x))

        # Обрабатываем специфические случаи
        df['district'] = df['district'].replace({"Timiou Prodromou  Mesa Geitonias": "Mesa Geitonia"}, regex=True)

        # Заменяем тире с любым количеством пробелов вокруг на " - "
        df['district'] = df['district'].apply(lambda x: re.sub(r'\s*-\s*', ' - ', x))

        # Разделяем двойные районы
        df['district'] = df['district'].str.split(' - ')
        df = df.explode('district').reset_index(drop=True)

        # Обрабатываем "Arch Makarios III"
        df['district'] = df['district'].apply(lambda x: re.sub(r'^(Makarios III|Arch Makarios III)$', 'Arch. Makarios III', x))

        # Исключаем случаи, где в поле района встречается другой город
        df = df[~df['district'].isin(cities)]

        return df

    def convert_included(self, df):
        # Проверяем, есть ли столбец 'included' в датафрейме
        if 'included' not in df.columns:
            return df

        # Фильтрация значений 'included', чтобы исключить строки из одного символа
        df['included'] = df['included'].apply(lambda x: [item for item in x if len(item) > 1])

        # Преобразование списков в included в серии и затем преобразование их в dummy-переменные
        included_dummies = df['included'].apply(pd.Series).stack().str.get_dummies().sum(level=0)

        # Присоединение этих dummy-переменных к исходному датафрейму
        df = df.drop('included', axis=1).join(included_dummies)

        # Замена NaN на False и преобразование 1 и 0 в True и False
        for column in included_dummies.columns:
            df[column] = df[column].fillna(0).astype(bool)

        return df

    def analyse_city_district(self, df):
        # Группировка по городу и району и подсчёт количества уникальных сочетаний
        combinations = df.groupby(['city', 'district']).size().reset_index(name='counts')

        # Сортировка по количеству уникальных сочетаний в порядке убывания
        combinations = combinations.sort_values('counts', ascending=False)

        # Выводим на экран уникальные сочетания городов и районов и их количество
        print(f'\nCollection {self.collection.name}')
        for index, row in combinations.iterrows():
            print(f'"{row["city"]} - {row["district"]}": {row["counts"]}')

    def analyse_boolean_columns(self, df):
        # Число строк в датафрейме
        total_count = df.shape[0]

        # Фильтруем только колонки с булевыми значениями
        bool_df = df.select_dtypes(include=[bool])

        # Получаем сумму значений в каждой колонке и преобразуем в словарь
        column_counts = bool_df.sum().to_dict()

        # Печатаем отношение количества True значений к общему количеству для каждой колонки
        for column, count in column_counts.items():
            print(f"{column}: {count}/{total_count}")

        return df

    def analyse_district_sqm_costs(self, df):
        # Создаем новую колонку с ценой за квадратный метр
        df['price_per_sqm'] = df['price'] / df['property-area']

        # Группируем по городу и району и получаем среднее значение цены за квадратный метр
        city_district_avg_price = df.groupby(['city', 'district'])['price_per_sqm'].mean()

        # Подсчет числа объектов для каждой группы
        city_district_counts = df.groupby(['city', 'district']).size()

        # Сортируем по средней цене за квадратный метр в порядке убывания
        city_district_avg_price = city_district_avg_price.sort_values(ascending=False)

        # Печатаем ранжированный список городов и районов
        print(f'\nCity-District Average Price Per Square Meter (in collection {self.collection.name}):')
        for index, value in city_district_avg_price.items():
            city, district = index
            count = city_district_counts[city][district]

            if count >= 4:
                print(f'{city} - {district}: {round(value, 2)} (based on data on {count} objects)')

        return df

    def remove_fields(self, df, fields_to_exclude):
        return df.drop(columns=[field for field in fields_to_exclude if field in df.columns], errors='ignore')

    def drop_if_null(self, df, field_name, empty_value, valid_types):
        """
        Удаляет строки из DataFrame, если значение в указанной колонке соответствует одному из пустых значений
        или не соответствует указанным типам.

        Args:
        - df (pd.DataFrame): DataFrame, из которого необходимо удалить строки.
        - field_name (str): Имя колонки для проверки.
        - empty_value (list): Список значений, которые считаются "пустыми".
        - valid_types (list): Список типов, которые считаются допустимыми для этой колонки.

        Returns:
        - pd.DataFrame: Обновленный DataFrame без строк, соответствующих условиям.
        """
        # Условие для удаления строк, если поле отсутствует
        condition_missing = df[field_name].isnull()

        # Условие для удаления строк на основе "пустых" значений
        condition_empty = df[field_name].isin(empty_value)

        # Условие для удаления строк на основе типов
        condition_type = df[field_name].apply(lambda x: not any(isinstance(x, eval(type_)) for type_ in valid_types))

        # Объединение условий
        combined_condition = condition_missing | condition_empty | condition_type

        return df[~combined_condition]

    def set_default_value(self, df, field_name, valid_values_or_type, default_value=None):
        """
        Устанавливает значение по умолчанию для указанной колонки, если текущее значение
        в колонке не соответствует списку допустимых значений или указанному типу.

        Args:
        - df (pd.DataFrame): DataFrame, который нужно обновить.
        - field_name (str): Имя колонки для проверки и обновления.
        - valid_values_or_type (list or str): Список допустимых значений или строка с именем допустимого типа.
        - default_value (optional): Значение по умолчанию, которое следует установить, если текущее значение недопустимо.

        Returns:
        - pd.DataFrame: Обновленный DataFrame с установленными значениями по умолчанию.
        """

        # Проверяем наличие поля в DataFrame
        if field_name not in df.columns:
            return df

        if isinstance(valid_values_or_type, list):
            condition = ~df[field_name].isin(valid_values_or_type)

            # Если значение по умолчанию не указано, выберите наиболее часто встречающееся значение из списка допустимых значений
            if default_value is None:
                default_value = df[field_name].value_counts().loc[lambda x: x.index.isin(valid_values_or_type)].idxmax()
        else:
            valid_type = eval(valid_values_or_type)
            condition = ~df[field_name].apply(lambda x: isinstance(x, valid_type))

        # Применить значение по умолчанию к строкам, которые удовлетворяют условию
        df.loc[condition, field_name] = default_value

        return df

    def identify_outliers(self, df, threshold=1.5, min_objects_number=4):
        # Рассчитываем цену за квадратный метр для каждого объекта
        df['price_per_sqm'] = df['price'] / df['property-area']

        # Функция для рассчета средней цены за квадратный метр в районе без учета текущего объекта
        def calculate_mean_price_without_current(row):
            district_data = df[(df['city'] == row['city']) & (df['district'] == row['district'])]
            if district_data.shape[0] <= min_objects_number:
                return row['price_per_sqm']
            else:
                return (district_data['price'].sum() - row['price']) / (district_data['property-area'].sum() - row['property-area'])

        # Применяем функцию к датафрейму
        df['mean_price_per_sqm_without_current'] = df.apply(calculate_mean_price_without_current, axis=1)

        # Идентифицируем выбросы
        df['is_outlier'] = df['price_per_sqm'] > threshold * df['mean_price_per_sqm_without_current']

        # Считаем количество выбросов по районам
        outlier_counts = df[df['is_outlier']].groupby(['city', 'district']).size().to_dict()

        # Сохраняем датафрейм удаленных выбросов
        removed_outliers_df = df[df['is_outlier']]

        # Удаляем выбросы из основного датафрейма
        cleaned_df = df[~df['is_outlier']].drop(columns=['is_outlier', 'price_per_sqm', 'mean_price_per_sqm_without_current'])

        # Возвращаем очищенный датафрейм, количество выбросов по районам и датафрейм удаленных выбросов
        return cleaned_df, outlier_counts, removed_outliers_df

    def field_analysis(self, df, ignored_fields):
        results = []
        columns_to_drop = []

        for column in df.columns:
            if column in ignored_fields:
                continue

            if df[column].apply(type).eq(list).any():
                results.append((column, "contains lists, skipping unique value calculation"))
                continue

            data_types = set(df[column].apply(type).unique())
            unique_values = len(df[column].unique())
            null_values = df[column].isnull().sum()

            if unique_values == 1:
                columns_to_drop.append(column)

            results.append((column, ', '.join([str(t.__name__) for t in data_types]), unique_values, null_values, len(df)))

        return results, columns_to_drop

    def print_field_analysis(self, analysis_results):
        print(f'\n')
        print(f'\nAnalysis of collection {self.collection.name}:')
        print(f'\nColumn name - type(s) - diff. values/empty values/common notes number')

        for result in analysis_results:
            if len(result) == 2:
                print(f"{result[0]} {result[1]}")
            else:
                print(f"{result[0]} - {result[1]} - {result[2]}/{result[3]}/{result[4]}")

    def print_value_counts_for_column(self, df, column_name, top_n=10):
        """
        Печатает частоту уникальных значений для заданной колонки.

        :param df: DataFrame, содержащий данные.
        :param column_name: Название колонки для анализа.
        :param top_n: Максимальное количество выводимых значений.
        """

        if column_name not in df.columns:
            print(f"Column '{column_name}' not found in the dataframe.")
            return

        print(f"\nAnalysis for column: {column_name}\n{'-'*40}")

        # Убираем отсутствующие значения (NaN) перед подсчетом
        counts = df[column_name].dropna().value_counts().head(top_n)

        for value, count in counts.items():
            print(f"{value}: {count}")

    async def analyse(self):
        cursor = self.collection.find({
            "$or": [
                {
                    "active_dates": {
                        "$elemMatch": {
                            "$gte": self.start_date,
                            "$lte": self.end_date
                        }
                    }
                },
                {
                    "_id": {
                        "$gte": ObjectId.from_datetime(self.start_date),
                        "$lte": ObjectId.from_datetime(self.end_date)
                    }
                },
                {
                    "publish_date": {
                        "$gte": self.start_date,
                        "$lte": self.end_date
                    }
                }
            ]
        })

        data = await cursor.to_list(length=None)

        # Создаем датафрейм из собранных данных
        df = pd.DataFrame(data)

        fields_to_exclude = [
            'url', 'ad_id', 'title', 'description', 'currency',
            'reference-number', 'registration-number', 'registration-block',
            'property-area-unit', 'coords', 'mode', '__v',
            'plot-area-unit', 'square-meter-price' ]

        df = self.remove_fields(df, fields_to_exclude)

        # Создаем маску, где каждое значение True, если соответствующий элемент в 'district' является строкой, и False в противном случае
        mask = df['district'].apply(lambda x: isinstance(x, str))

        # Применяем маску к DataFrame, оставляя только те строки, где 'district' является строкой
        df = df[mask]

        # Удаляем строки, где 'price' или 'property-area' не являются числами
        df = df[df['price'].apply(lambda x: isinstance(x, (int, float))) & df['property-area'].apply(lambda x: isinstance(x, (int, float)))]

        # Удаляем строки, где 'price' или 'property-area' равны нулю
        df = df[df['price'] != 0]
        df = df[df['property-area'] != 0]

        df = self.clean_districts(df)
        df = self.convert_included(df)
        df = self.remove_fields(df, [ 'included' ])

        ignored_fields = [
            'url', 'ad_id', 'title', 'description', 'currency',
            'reference-number', 'registration-number', 'registration-block',
            'property-area-unit', 'coords', 'mode', '_id', '__v', 'active_dates',
            'plot-area-unit', 'included', 'publish_date' ]

        energy_efficiency_values = [ 'A+++', 'A++', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E', 'N/A', 'In Progress' ]

        if 'floor' in df.columns:
            valid_floor_values = df[df['floor'].apply(type) == str]['floor'].unique().tolist()
        else:
            valid_floor_values = []

        if 'construction-year' in df.columns:
            valid_construction_year_values = df[df['construction-year'].apply(type) == str]['construction-year'].unique().tolist()
        else:
            valid_construction_year_values = []

        df = self.drop_if_null(df, 'price', [ 0 ], [ 'int', 'float' ])
        df = self.drop_if_null(df, 'property-area', [ 0 ], [ 'int' ])
        df = self.set_default_value(df, 'online-viewing', [ 'Yes', 'No' ], [ 'No' ])
        df = self.set_default_value(df, 'condition', [ 'Brand new', 'Resale', 'Under construction' ], [ 'Resale' ])
        df = self.set_default_value(df, 'energy-efficiency', energy_efficiency_values, [ 'In Progress' ])
        df = self.set_default_value(df, 'type', 'str')
        df = self.set_default_value(df, 'parking', [ 'No', 'Covered', 'Uncovered' ], 'No')
        df = self.set_default_value(df, 'furnishing', [ 'Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'Appliances οnly' ], 'Unfurnished')
        df = self.set_default_value(df, 'air-conditioning', [ 'Full, all rooms', 'Partly', 'No' ], 'No')
        df = self.set_default_value(df, 'bedrooms', 'int', 1)
        df = self.set_default_value(df, 'bathrooms', 'int', 1)
        df = self.set_default_value(df, 'floor', valid_floor_values, '1st')
        df = self.set_default_value(df, 'construction-year', valid_construction_year_values, 'Older')

        field_analysis_result, columns_to_drop = self.field_analysis(df, ignored_fields)
        df = df.drop(columns=columns_to_drop)
        self.print_field_analysis(field_analysis_result)
        # self.print_value_counts_for_column(df, 'construction-year', 40)

        df, outlier_counts, removed_outliers_df = self.identify_outliers(df, 1.5, 4)

        # Выведем первые 5 строк датафрейма
        print(df.head())

        # Список интересующих колонок
        # columns_of_interest = [ 'Alarm', 'Attic/Loft', 'Balcony', 'Elevator', 'Fireplace', 'Garden', 'Playroom', 'Pool', 'Storage room' ]
        #
        # # Отфильтруйте строки, где хотя бы одна из указанных колонок имеет тип float
        # float_rows = df[df[columns_of_interest].applymap(lambda x: isinstance(x, float)).any(axis=1)].head()
        #
        # print(float_rows)

        return df
