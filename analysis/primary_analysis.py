import os
import asyncio
from dotenv import load_dotenv
from datetime import datetime, timedelta
from main import (
    test_db_connection,
    analyse_current_month_intermediary,
    analyse_daily_total,
    analyse_monthly_total
)


load_dotenv()

run_once_analysis_start_date = datetime.strptime(os.getenv("RUN_ONCE_ANALYSIS_START_DATE", '01.07.2023'), '%d.%m.%Y')
skip_run_once = os.getenv('SKIP_RUN_ONCE_ANALYSIS', 'False').lower() == 'true'


async def run_primary_analysis(current_datetime):
    if skip_run_once == True:
        print("Пропускаем первичный анализ...")
        return

    start_date = run_once_analysis_start_date
    end_date = current_datetime

    current_date = start_date

    while current_date <= end_date:
        print(f"\nДата текущего анализа: {current_date}")

        if current_date.day != 1:  # Если это не первый день месяца
            await analyse_daily_total(current_date)
            await analyse_current_month_intermediary(current_date)

        else:
            if current_date != start_date:  # Если это не начальная дата анализа
                await analyse_daily_total(current_date)
                await analyse_monthly_total(current_date)

        current_date += timedelta(days=1)

    print(f"Анализ завершен для диапазона с {run_once_analysis_start_date.strftime('%d.%m.%Y')} по {end_date.strftime('%d.%m.%Y')}.")


if __name__ == "__main__":
    loop = asyncio.get_event_loop()

    print("Проверка подключения к БД...")
    loop.run_until_complete(test_db_connection())

    now = datetime.now()
    loop.run_until_complete(run_primary_analysis(now))
