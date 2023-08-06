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

        df = self.clean_districts(df)

        # Группировка по городу и району и подсчёт количества уникальных сочетаний
        combinations = df.groupby(['city', 'district']).size().reset_index(name='counts')

        # Сортировка по количеству уникальных сочетаний в порядке убывания
        combinations = combinations.sort_values('counts', ascending=False)

        # Выводим на экран уникальные сочетания городов и районов и их количество
        print("\nCollection Name")
        for index, row in combinations.iterrows():
            print(f'"{row["city"]} - {row["district"]}": {row["counts"]}')

        # print(df.head(6))
        return df
