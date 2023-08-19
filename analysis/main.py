import os
import ast
import pytz
import asyncio
from dotenv import load_dotenv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from motor.motor_asyncio import AsyncIOMotorClient
from apscheduler.triggers.cron import CronTrigger
from classes.median_price_calculator import MedianPriceCalculator
from classes.data_preparer import DataPreparer
from apscheduler.schedulers.asyncio import AsyncIOScheduler


load_dotenv()

mode = os.getenv("MODE", "prod")
if mode not in ("prod", "dev"):
    raise ValueError(f"Invalid mode: {mode}")

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

client = AsyncIOMotorClient(mongo_dsn)

is_processing = False


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


async def analyse_current_day_intermediary():
    print(f"\n\n{datetime.now()}: current day intermediary analysis has started")

    now = datetime.now()
    start_date = datetime(now.year, now.month, now.day, 0, 0, 0)
    end_date = datetime(now.year, now.month, now.day, 23, 59, 59)

    for collection_name in collections_to_analyse:
        median_avg_price_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)


async def analyse_current_month_intermediary():
    print(f"\n\n{datetime.now()}: current month intermediary analysis has started")

    now = datetime.now()
    first_day_of_current_month = datetime(now.year, now.month, 1, 0, 0, 0)
    last_day_of_current_month = first_day_of_current_month + relativedelta(months=1) - timedelta(seconds=1)
    start_date = first_day_of_current_month
    end_date = last_day_of_current_month

    for collection_name in collections_to_analyse:
        median_avg_price_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)


async def analyse_daily_total():
    print(f"\n\n{datetime.now()}: started analysis of previous day's total")

    yesterday = datetime.now() - timedelta(1)
    start_date = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0)
    end_date = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59)

    for collection_name in collections_to_analyse:
        median_avg_price_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)


async def analyse_monthly_total():
    print(f"\n\n{datetime.now()}: started analysis of previous month's total")

    now = datetime.now()
    first_day_of_current_month = datetime(now.year, now.month, 1, 0, 0, 0)
    first_day_of_previous_month = first_day_of_current_month - relativedelta(months=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(seconds=1)
    start_date = first_day_of_previous_month
    end_date = last_day_of_previous_month

    for collection_name in collections_to_analyse:
        median_avg_price_df = await prepare_data(mongo_db_name, collection_name, start_date, end_date, client, mode)


async def main():
    local_tz = pytz.timezone('Europe/Nicosia')
    scheduler = AsyncIOScheduler(timezone=local_tz)

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
