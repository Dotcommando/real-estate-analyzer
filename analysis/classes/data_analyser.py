from datetime import datetime
from bson.objectid import ObjectId
from typing import List
from motor.motor_asyncio import AsyncIOMotorCollection


class DataAnalyser:
    def __init__(self, start_date: datetime, end_date: datetime, collection: AsyncIOMotorCollection):
        self.start_date = start_date
        self.end_date = end_date
        self.collection = collection

    @staticmethod
    def datetime_to_objectid(dt: datetime) -> ObjectId:
        """
        Convert datetime to ObjectId
        """
        return ObjectId.from_datetime(generation_time=dt)

    async def analyse(self):
        start_oid = self.datetime_to_objectid(self.start_date)
        end_oid = self.datetime_to_objectid(self.end_date)

        cursor = self.collection.find({
            "$and": [
                {"_id": {"$gte": start_oid, "$lte": end_oid}},
                {"active_dates": {
                    "$elemMatch": {
                        "$date": {
                            "$gte": self.start_date.isoformat(),
                            "$lte": self.end_date.isoformat()
                        }
                    }
                }}
            ]
        })

        # Обработка данных
        data = await cursor.to_list(length=None)

        # Здесь проведите анализ данных
