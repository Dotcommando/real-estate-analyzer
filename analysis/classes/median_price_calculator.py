from pandas import DataFrame
from motor.motor_asyncio import AsyncIOMotorCollection


class MedianPriceCalculator:
    def __init__(self, df: DataFrame, collection: AsyncIOMotorCollection, mode: str):
        self.df = df
        self.collection = collection
        self.mode = mode

    def analyse_city_district(self, df):
        # Группировка по городу и району и подсчёт медианной и средней цены за квадратный метр
        stats_df = df.groupby(['city', 'district'])['price_per_sqm'].agg(['median', 'mean', 'count']).reset_index()

        # Сортировка по городу и медианной цене за квадратный метр в порядке убывания
        stats_df = stats_df.sort_values(['city', 'median'], ascending=[True, False])

        return stats_df

    def print_analysis_of_city_district(self, median_prices_df, min_objects_threshold = 0, mode: str = "prod"):
        if mode == "prod":
            return

        temp_df = median_prices_df.copy()
        temp_df['  City'] = temp_df['city']
        temp_df['  District'] = temp_df['district']
        temp_df['  Median price/sqm'] = temp_df['median'].apply(lambda x: f"{x:.2f}")
        temp_df['  Avg price/sqm'] = temp_df['mean'].apply(lambda x: f"{x:.2f}")
        temp_df['  Objects'] = temp_df['count']

        temp_df = temp_df[temp_df['  Objects'] >= min_objects_threshold]

        columns_to_show = ['  City', '  District', '  Median price/sqm', '  Avg price/sqm', '  Objects']

        print(f"\nDetailed prices for City-Districts in {self.collection.name}:\n")
        print(temp_df[columns_to_show].to_string(index=False))

        del temp_df

    def analyse_city(self, df):
        # Группировка по городу и подсчёт необходимых статистических данных
        city_df = df.groupby('city').agg({
            'property-area': 'sum',
            'price': ['sum', 'mean', 'median', lambda x: x.quantile(0.25), lambda x: x.quantile(0.75)],
            'price_per_sqm': ['mean', 'median']
        }).reset_index()

        # Переименование колонок для соответствия требованиям
        city_df.columns = [
            'city', 'total-area', 'total-price', 'mean-price', 'median-price',
            'price-percentile-25', 'price-percentile-75', 'mean-price-sqm', 'median-price-sqm'
        ]

        return city_df

    def print_analysis_of_city(self, city_df, mode: str = "prod", currency_symbol: str = '€'):
        if mode == "prod":
            return

        temp_df = city_df.copy()
        temp_df['  City'] = temp_df['city']
        temp_df['  Total Area sqm'] = temp_df['total-area'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Total Price {currency_symbol}'] = temp_df['total-price'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Mean Price {currency_symbol}'] = temp_df['mean-price'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Median Price {currency_symbol}'] = temp_df['median-price'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Price 25th Perc. {currency_symbol}'] = temp_df['price-percentile-25'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Price 75th Perc. {currency_symbol}'] = temp_df['price-percentile-75'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Mean Price/sqm {currency_symbol}'] = temp_df['mean-price-sqm'].apply(lambda x: f"{x:,.2f}")
        temp_df[f'  Median Price/sqm {currency_symbol}'] = temp_df['median-price-sqm'].apply(lambda x: f"{x:,.2f}")

        columns_to_show = [
            '  City',
            '  Total Area sqm',
            f'  Total Price {currency_symbol}',
            f'  Mean Price {currency_symbol}',
            f'  Median Price {currency_symbol}',
            f'  Price 25th Perc. {currency_symbol}',
            f'  Price 75th Perc. {currency_symbol}',
            f'  Mean Price/sqm {currency_symbol}',
            f'  Median Price/sqm {currency_symbol}'
        ]

        print(f"\nDetailed prices for Cities in {self.collection.name}:\n")
        print(temp_df[columns_to_show].to_string(index=False))

        del temp_df

    def calculate_median_avg_prices(self):
        stats_df = self.analyse_city_district(self.df)
        self.print_analysis_of_city_district(stats_df, 5, self.mode)

        city_df = self.analyse_city(self.df)
        self.print_analysis_of_city(city_df, self.mode)

        return stats_df, city_df
