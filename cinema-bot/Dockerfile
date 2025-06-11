FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY bot.py .
COPY config.py .
COPY handlers.py .
COPY api.py .

ENV PYTHONUNBUFFERED=1

RUN adduser --disabled-password --gecos '' appuser
USER appuser

CMD ["python", "bot.py"]
