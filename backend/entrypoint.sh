#!/bin/sh

echo "Esperando a Postgres..."
until pg_isready -h postgres -p 5432; do
  sleep 2
done

echo "Postgres listo."

echo "1️⃣ Transformando dataset..."
node src/services/transformDataset.js

echo "2️⃣ Importando CSV a Postgres..."

PGPASSWORD=$POSTGRES_PASSWORD psql \
  -h postgres \
  -U $POSTGRES_USER \
  -d $POSTGRES_DB \
  -c "\copy staging_projects(city, zone, project_name, period, price_per_m2) FROM '/app/database/dataset_clean.csv' DELIMITER ',' CSV HEADER"

echo "3️⃣ Ejecutando inserts..."

PGPASSWORD=$POSTGRES_PASSWORD psql \
  -h postgres \
  -U $POSTGRES_USER \
  -d $POSTGRES_DB \
  -f /app/database/insert_data.sql

echo "4️⃣ Iniciando servidor..."
node src/server.js