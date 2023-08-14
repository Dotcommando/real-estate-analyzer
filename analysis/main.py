import os
import ast
from fastapi import FastAPI
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from classes.median_price_calculator import MedianPriceCalculator
from classes.data_preparer import DataPreparer

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

app = FastAPI()

if collections_to_analyse_env is not None:
    collections_to_analyse = ast.literal_eval(collections_to_analyse_env)
else:
    collections_to_analyse = []

mongo_dsn = f"{mongo_protocol}://{mongo_username}:{mongo_password}@{mongo_host}:{mongo_port}/"

if mongo_rs:
    mongo_dsn += f"?replicaSet={mongo_rs}"

# Analysis period
start_date = datetime(2023, 7, 1)
end_date = datetime(2023, 7, 31)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.on_event("startup")
async def startup_event():
    client = AsyncIOMotorClient(mongo_dsn)

    for collection_name in collections_to_analyse:
        mongo_db = client[mongo_db_name]
        collection = mongo_db[collection_name]
        data_preparer = DataPreparer(start_date, end_date, collection, mode)
        df = await data_preparer.prepare()
        median_price_calculator = MedianPriceCalculator(df, collection, mode)
        median_avg_price_df = median_price_calculator.calculate_median_avg_prices()

        # print(df)
