FROM python:3.11-slim

# Установить рабочую директорию внутри контейнера
WORKDIR /analysis

# Скопировать текущую директорию в контейнер в /app
COPY . /analysis

# Установить зависимости проекта
RUN pip install --no-cache-dir -r requirements.txt

# Установить утилиту make
RUN apt-get update && apt-get install -y make && apt-get clean && rm -rf /var/lib/apt/lists/*

# Команда для запуска приложения
CMD ["make", "start"]
