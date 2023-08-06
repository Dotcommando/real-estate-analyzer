import re
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

    def convert_includes(self, df):
        # Проверяем, есть ли столбец 'includes' в датафрейме
        if 'includes' not in df.columns:
            return df

        # Преобразование списков в includes в серии и затем преобразование их в dummy-переменные
        includes_dummies = df['includes'].apply(pd.Series).stack().str.get_dummies().sum(level=0)

        # Присоединение этих dummy-переменных к исходному датафрейму
        df = pd.concat([df.drop('includes', axis=1), includes_dummies], axis=1)

        # Замена NaN на False
        df.fillna(False, inplace=True)

        return df

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

        columns_to_drop = ['reference-number', 'registration-number', 'registration-block', 'square-meter-price']

        # Проверяем наличие колонки перед её удалением
        for column in columns_to_drop:
            if column in df.columns:
                df = df.drop(columns=[column])

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
        df = self.convert_includes(df)

        # # Группировка по городу и району и подсчёт количества уникальных сочетаний
        # combinations = df.groupby(['city', 'district']).size().reset_index(name='counts')
        #
        # # Сортировка по количеству уникальных сочетаний в порядке убывания
        # combinations = combinations.sort_values('counts', ascending=False)
        #
        # # Выводим на экран уникальные сочетания городов и районов и их количество
        # print(f'\nCollection {self.collection.name}')
        # for index, row in combinations.iterrows():
        #     print(f'"{row["city"]} - {row["district"]}": {row["counts"]}')
        #
        # # Число строк в датафрейме
        # total_count = df.shape[0]
        #
        # # Фильтруем только колонки с булевыми значениями
        # bool_df = df.select_dtypes(include=[bool])
        #
        # # Получаем сумму значений в каждой колонке и преобразуем в словарь
        # column_counts = bool_df.sum().to_dict()
        #
        # # Печатаем отношение количества True значений к общему количеству для каждой колонки
        # for column, count in column_counts.items():
        #     print(f"{column}: {count}/{total_count}")

        # Создаем новую колонку с ценой за квадратный метр
        df['price_per_sqm'] = df['price'] / df['property-area']

        # Группируем по городу и району и получаем среднее значение цены за квадратный метр
        city_district_avg_price = df.groupby(['city', 'district'])['price_per_sqm'].mean()

        # Сортируем по средней цене за квадратный метр в порядке убывания
        city_district_avg_price = city_district_avg_price.sort_values(ascending=False)

        # Печатаем ранжированный список городов и районов
        print(f'\nCity-District Average Price Per Square Meter (in collection {self.collection.name}):')
        for index, value in city_district_avg_price.items():
            city, district = index
            print(f'{city} - {district}: {round(value, 2)}')

        return df
