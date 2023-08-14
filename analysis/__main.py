import os
import json
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
from classes.data_analyser import DataAnalyser

load_dotenv()

mongo_username = os.getenv("MONGO_INITDB_ROOT_USERNAME")
mongo_password = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
mongo_port = os.getenv("MONGO_PORT")
mongo_db = os.getenv("MONGO_INITDB_DATABASE")
mongo_rs = os.getenv("MONGO_RS")

day_minute = os.getenv("DAY_ANALYSIS_MINUTE")
week_day = os.getenv("WEEK_ANALYSIS_DAY")
week_hour = int(os.getenv("WEEK_ANALYSIS_HOUR"))
week_minute = int(os.getenv("WEEK_ANALYSIS_MINUTE"))
week_second = int(os.getenv("WEEK_ANALYSIS_SECOND"))
month_day = int(os.getenv("MONTH_ANALYSIS_DAY"))
month_hour = int(os.getenv("MONTH_ANALYSIS_HOUR"))
month_minute = int(os.getenv("MONTH_ANALYSIS_MINUTE"))
month_second = int(os.getenv("MONTH_ANALYSIS_SECOND"))
dynamic_month_hour = int(os.getenv("DYNAMIC_MONTH_ANALYSIS_HOUR"))
dynamic_month_minute = int(os.getenv("DYNAMIC_MONTH_ANALYSIS_MINUTE"))
dynamic_month_second = int(os.getenv("DYNAMIC_MONTH_ANALYSIS_SECOND"))

collections = json.loads(os.getenv("MONGO_COLLECTIONS"))

mongo_dsn = f"mongodb://{mongo_username}:{mongo_password}@localhost:{mongo_port}/{mongo_db}?authSource=admin"


if mongo_rs:
    mongo_dsn += f"&replicaSet={mongo_rs}"

mongo_dsn += "&ssl=false"

client = AsyncIOMotorClient(mongo_dsn)

now = datetime.now()

past_three_days_start = (now - timedelta(days=3)).replace(hour=0, minute=0, second=0, microsecond=0)
past_three_days_end = now

past_week_start = (now - timedelta(days=now.weekday(), weeks=1)).replace(hour=0, minute=0, second=0, microsecond=0)
past_week_end = (now - timedelta(days=now.weekday())).replace(hour=23, minute=59, second=59, microsecond=999999)

past_month_start = (now.replace(day=1) - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
past_month_end = (now.replace(day=1) - timedelta(days=1)).replace(hour=23, minute=59, second=59, microsecond=999999)

beginning_of_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
beginning_of_month_end = now

analysers = {}

for collection in collections:
    analysers[collection] = {
        "day": DataAnalyser(past_three_days_start, past_three_days_end, client[mongo_db][collection]),
        "week": DataAnalyser(past_week_start, past_week_end, client[mongo_db][collection]),
        "month": DataAnalyser(past_month_start, past_month_end, client[mongo_db][collection]),
        "dynamic_month": DataAnalyser(beginning_of_month_start, beginning_of_month_end, client[mongo_db][collection])
    }


async def analyse_day():
    print(f"Starting day analysis at {datetime.now()}")
    for collection in collections:
        await analysers[collection]["day"].prepare()


async def analyse_week():
    print(f"Starting week analysis at {datetime.now()}")
    for collection in collections:
        await analysers[collection]["week"].prepare()


async def analyse_month():
    print(f"Starting month analysis at {datetime.now()}")
    for collection in collections:
        await analysers[collection]["month"].prepare()


async def analyse_dynamic_month():
    print(f"Starting dynamic month analysis at {datetime.now()}")
    for collection in collections:
        await analysers[collection]["dynamic_month"].prepare()


# Создание задач по расписанию
scheduler = AsyncIOScheduler()

scheduler.add_job(analyse_day, CronTrigger(minute=day_minute))
scheduler.add_job(analyse_week, CronTrigger(day_of_week=week_day, hour=week_hour, minute=week_minute, second=week_second))
scheduler.add_job(analyse_month, CronTrigger(day=month_day, hour=month_hour, minute=month_minute, second=month_second))
scheduler.add_job(analyse_dynamic_month, CronTrigger(hour=dynamic_month_hour, minute=dynamic_month_minute, second=dynamic_month_second))

scheduler.start()


async def main():
    try:
        while True:
            await asyncio.sleep(3600)

    except KeyboardInterrupt:
        print('Stopping the script...')

    finally:
        await client.close()


# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())
asyncio.run(main())
