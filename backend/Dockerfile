FROM python:3.11-slim-bookworm

WORKDIR /app

# Обновляем систему и ставим нужные зависимости
RUN apt-get update && apt-get dist-upgrade -y \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3050
CMD ["python", "server.py"]

