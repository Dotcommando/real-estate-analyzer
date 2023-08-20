import asyncio
from datetime import datetime, timedelta
from main import (
    analyse_current_month_intermediary,
    analyse_daily_total,
    analyse_monthly_total
)

RUN_ONCE_ANALYSIS_START_DATE = datetime.strptime('01.07.2023', '%d.%m.%Y')


async def run_primary_analysis(current_datetime):
    start_date = RUN_ONCE_ANALYSIS_START_DATE
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

    print(f"Анализ завершен для диапазона с {RUN_ONCE_ANALYSIS_START_DATE.strftime('%d.%m.%Y')} по {end_date.strftime('%d.%m.%Y')}.")


if __name__ == "__main__":
    now = datetime.now()
    asyncio.run(run_primary_analysis(now))
