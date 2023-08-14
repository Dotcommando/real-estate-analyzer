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

    def calculate_median_avg_prices(self):
        stats_df = self.analyse_city_district(self.df)
        self.print_analysis_of_city_district(stats_df, 5, self.mode)

        return stats_df
