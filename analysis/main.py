import os
import ast
import pytz
import inspect
import asyncio
from pandas import DataFrame
from dotenv import load_dotenv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from motor.motor_asyncio import AsyncIOMotorClient
from apscheduler.triggers.cron import CronTrigger
from classes.median_price_calculator import MedianPriceCalculator
from classes.data_preparer import DataPreparer
from constants.analysis_type import AnalysisType
from constants.analysis_period import AnalysisPeriod
from apscheduler.schedulers.asyncio import AsyncIOScheduler


load_dotenv()

mode = os.getenv("MODE", "prod")
if mode not in ("prod", "dev"):
    raise ValueError(f"Invalid mode: {mode}")

mongo_connection_timeout = int(os.getenv("MONGO_CONNECTION_TIMEOUT", 5000))
mongo_username = os.getenv("MONGO_INITDB_ROOT_USERNAME")
mongo_password = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
mongo_protocol = os.getenv("MONGO_PROTOCOL")
mongo_host = os.getenv("MONGO_HOST")
mongo_port = os.getenv("MONGO_PORT")
mongo_db_name = os.getenv("MONGO_INITDB_DATABASE")
mongo_rs = os.getenv("MONGO_RS")
collections_to_analyse_env = os.getenv("MONGO_COLLECTIONS_FOR_ANALYSIS")

current_day_intermediary_hour = os.getenv("CURRENT_DAY_INTERMEDIARY_HOUR")

current_month_intermediary_hour = int(os.getenv("CURRENT_MONTH_INTERMEDIARY_HOUR"))
current_month_intermediary_minute = int(os.getenv("CURRENT_MONTH_INTERMEDIARY_MINUTE"))

daily_total_hour = int(os.getenv("DAILY_TOTAL_HOUR"))
daily_total_minute = int(os.getenv("DAILY_TOTAL_MINUTE"))

monthly_total_day = int(os.getenv("MONTHLY_TOTAL_DAY"))
monthly_total_hour = int(os.getenv("MONTHLY_TOTAL_HOUR"))
monthly_total_minute = int(os.getenv("MONTHLY_TOTAL_MINUTE"))

if collections_to_analyse_env is not None:
    collections_to_analyse = ast.literal_eval(collections_to_analyse_env)
else:
    collections_to_analyse = []

mongo_dsn = f"{mongo_protocol}://{mongo_username}:{mongo_password}@{mongo_host}:{mongo_port}/"

if mongo_rs:
    mongo_dsn += f"?replicaSet={mongo_rs}"

client = AsyncIOMotorClient(mongo_dsn, serverSelectionTimeoutMS=mongo_connection_timeout)

is_processing = False


async def test_db_connection():
    """
    Пытается записать, прочитать и затем удалить тестовую запись в БД.
    Выводит результат в консоль.
    """
    # Берем первую коллекцию из списка для тестирования (если она есть)
    if not collections_to_analyse:
        print("MONGO_COLLECTIONS_FOR_ANALYSIS is empty!")
        return

    test_collection_name = collections_to_analyse[0]
    mongo_db = client[mongo_db_name]
    collection = mongo_db[test_collection_name]

    test_document = {
        "test_field": "test_value"
    }

    try:
        # Вставка тестовой записи
        result = await collection.insert_one(test_document)
        if not result.inserted_id:
            print("Failed to insert test document!")
            return

        # Проверяем, что запись успешно вставлена
        fetched_document = await collection.find_one({"_id": result.inserted_id})
        if not fetched_document:
            print("Failed to read test document after insertion!")
            return
        else:
            print(f"Successfully read test document: {fetched_document}")

        # Удаляем тестовую запись
        await collection.delete_one({"_id": result.inserted_id})
        print(f"Successfully deleted test document with _id: {result.inserted_id}")

    except Exception as e:
        print(f"\nAn error occurred during running test_db_connection:\n{e}")


async def clear_console():
    os.system('cls' if os.name == 'nt' else 'clear')


def get_current_function_name():
    return inspect.stack()[1][3]


async def prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode = "prod"):
    mongo_db = client[mongo_db_name]
    collection = mongo_db[collection_name]
    data_preparer = DataPreparer(start_date, end_date, collection, mode)
    df = await data_preparer.prepare()
    median_price_calculator = MedianPriceCalculator(df, collection, mode)

    return median_price_calculator.calculate_median_avg_prices()


async def run_scheduled_task(task):
    global is_processing

    if not is_processing:
        is_processing = True

        try:
            await task()
        finally:
            is_processing = False
    else:
        print(f"Task {task.__name__} is already running!")


async def save_stats_to_db(
        collection_name: str,
        stats_df: DataFrame,
        start_date: datetime,
        end_date: datetime,
        analysis_type: AnalysisType,
        analysis_period: AnalysisPeriod,
        analysis_version: str
) -> None:
    collection_name += "_analysis"
    mongo_db = client[mongo_db_name]
    collection = mongo_db[collection_name]

    # Конвертируем DataFrame в список словарей
    data = stats_df.to_dict(orient="records")

    document = {
        'start_date': start_date,
        'end_date': end_date,
        'analysis_type': analysis_type.value,
        'analysis_period': analysis_period.value,
        'analysis_version': analysis_version,
        'data': data
    }

    await collection.insert_one(document)


async def entry_exists(
        collection_name: str,
        start_date: datetime,
        end_date: datetime,
        analysis_type: AnalysisType,
        analysis_period: AnalysisPeriod,
        analysis_version: str
) -> bool:
    """
    Проверяет существование записи с указанными параметрами в базе данных.
    """
    mongo_db = client[mongo_db_name]
    collection_name += "_analysis"
    collection = mongo_db[collection_name]

    filter_query = {
        'start_date': start_date,
        'end_date': end_date,
        'analysis_type': analysis_type.value,
        'analysis_period': analysis_period.value,
        'analysis_version': analysis_version
    }

    entry = await collection.find_one(filter_query)

    return bool(entry)


async def analyse_current_day_intermediary(current_datetime: datetime = None):
    try:
        now = current_datetime or datetime.now()

        print(f"\n\n{now}: current day intermediary analysis has started")

        start_date = datetime(now.year, now.month, now.day, 0, 0, 0)
        end_date = datetime(now.year, now.month, now.day, now.hour - 1, 59, 59)

        for collection_name in collections_to_analyse:
            district_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.DAILY_INTERMEDIARY, '1.0.0')
            city_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.DAILY_INTERMEDIARY, '1.0.0')

            if district_exists and city_exists:
                print(f"\nEntry already exists for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            district_df, city_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)

            if district_df.empty and city_df.empty:
                print(f"\nNo data for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            if not district_exists and not district_df.empty:
                await save_stats_to_db(collection_name, district_df, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.DAILY_INTERMEDIARY, '1.0.0')

            if not city_exists and not city_df.empty:
                await save_stats_to_db(collection_name, city_df, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.DAILY_INTERMEDIARY, '1.0.0')

    except Exception as e:
        function_name = get_current_function_name()
        print(f"\nError during {function_name}:\n{e}")


async def analyse_current_month_intermediary(current_datetime: datetime = None):
    try:
        now = current_datetime or datetime.now()

        print(f"\n\n{now}: current month intermediary analysis has started")

        if now.day == 1:
            yesterday = now - timedelta(1)
            start_date = datetime(yesterday.year, yesterday.month, 1, 0, 0, 0)
        else:
            start_date = datetime(now.year, now.month, 1, 0, 0, 0)

        end_date = datetime(now.year, now.month, now.day, 0, 0, 0) - timedelta(seconds=1)

        for collection_name in collections_to_analyse:
            district_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.MONTHLY_INTERMEDIARY, '1.0.0')
            city_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.MONTHLY_INTERMEDIARY, '1.0.0')

            if district_exists and city_exists:
                print(f"\nEntry already exists for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            district_df, city_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)

            if district_df.empty and city_df.empty:
                print(f"\nNo data for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            if not district_exists and not district_df.empty:
                await save_stats_to_db(collection_name, district_df, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.MONTHLY_INTERMEDIARY, '1.0.0')

            if not city_exists and not city_df.empty:
                await save_stats_to_db(collection_name, city_df, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.MONTHLY_INTERMEDIARY, '1.0.0')

    except Exception as e:
        function_name = get_current_function_name()
        print(f"\nError during {function_name}:\n{e}")


async def analyse_daily_total(current_datetime: datetime = None):
    try:
        now = current_datetime or datetime.now()

        print(f"\n\n{now}: started analysis of previous day's total")

        yesterday = now - timedelta(1)
        start_date = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0)
        end_date = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59)

        for collection_name in collections_to_analyse:
            district_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.DAILY_TOTAL, '1.0.0')
            city_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.DAILY_TOTAL, '1.0.0')

            if district_exists and city_exists:
                print(f"\nEntry already exists for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            district_df, city_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)

            if district_df.empty and city_df.empty:
                print(f"\nNo data for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            if not district_exists and not district_df.empty:
                await save_stats_to_db(collection_name, district_df, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.DAILY_TOTAL, '1.0.0')

            if not city_exists and not city_df.empty:
                await save_stats_to_db(collection_name, city_df, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.DAILY_TOTAL, '1.0.0')

    except Exception as e:
        function_name = get_current_function_name()
        print(f"\nError during {function_name}:\n{e}")


async def analyse_monthly_total(current_datetime: datetime = None):
    try:
        now = current_datetime or datetime.now()

        print(f"\n\n{now}: started analysis of previous month's total")

        first_day_of_current_month = datetime(now.year, now.month, 1, 0, 0, 0)
        first_day_of_previous_month = first_day_of_current_month - relativedelta(months=1)
        last_day_of_previous_month = first_day_of_current_month - timedelta(seconds=1)
        start_date = first_day_of_previous_month
        end_date = last_day_of_previous_month

        for collection_name in collections_to_analyse:
            district_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.MONTHLY_TOTAL, '1.0.0')
            city_exists = await entry_exists(collection_name, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.MONTHLY_TOTAL, '1.0.0')

            if district_exists and city_exists:
                print(f"\nEntry already exists for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            district_df, city_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)

            if district_df.empty and city_df.empty:
                print(f"\nNo data for collection: {collection_name} for start_date: {start_date} and end_date: {end_date}. Skipping...")
                continue

            if not district_exists and not district_df.empty:
                await save_stats_to_db(collection_name, district_df, start_date, end_date, AnalysisType.DISTRICT_AVG_MEAN, AnalysisPeriod.MONTHLY_TOTAL, '1.0.0')

            if not city_exists and not city_df.empty:
                await save_stats_to_db(collection_name, city_df, start_date, end_date, AnalysisType.CITY_AVG_MEAN, AnalysisPeriod.MONTHLY_TOTAL, '1.0.0')

    except Exception as e:
        function_name = get_current_function_name()
        print(f"\nError during {function_name}:\n{e}")


async def main():
    local_tz = pytz.timezone('Europe/Nicosia')
    scheduler = AsyncIOScheduler(timezone=local_tz)

    scheduler.add_job(clear_console, trigger=CronTrigger(day='1', hour='0', minute='0'))
    scheduler.add_job(run_scheduled_task, args=[analyse_current_day_intermediary], trigger=CronTrigger(hour=current_day_intermediary_hour))
    scheduler.add_job(run_scheduled_task, args=[analyse_current_month_intermediary], trigger=CronTrigger(hour=current_month_intermediary_hour, minute=current_month_intermediary_minute))
    scheduler.add_job(run_scheduled_task, args=[analyse_daily_total], trigger=CronTrigger(hour=daily_total_hour, minute=daily_total_minute))
    scheduler.add_job(run_scheduled_task, args=[analyse_monthly_total], trigger=CronTrigger(day=monthly_total_day, hour=monthly_total_hour, minute=monthly_total_minute))

    scheduler.start()

    try:
        while True:
            await asyncio.sleep(10)

    except (KeyboardInterrupt, asyncio.exceptions.CancelledError):
        print('Stopping the script...')

    finally:
        if client:
            client.close()

if __name__ == '__main__':
    asyncio.run(main())
