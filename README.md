# Real Estate Analytics Platform

## Stack
Backend Node + Express
PostgreSQL
Login JWT
Frontend React
Dashboard
Chat AI
Workspace
Docker
## IA - BOT
Usuario  - ¿Qué ciudad tiene mayor precio promedio?
BOT - responderá algo como:

Según los datos analizados, las ciudades con mayor precio promedio por m² son:

1. Ciudad de México
2. Monterrey
3. Guadalajara

Ciudad de México presenta el mayor valor promedio, lo que refleja alta demanda y consolidación del mercado inmobiliario.

Para inversión patrimonial a largo plazo, CDMX sigue siendo el mercado más sólido.

BOT preguntas 

¿Dónde conviene invertir?
¿Qué ciudades tienen mayor crecimiento?
Compara Guadalajara vs Monterrey
## Levantar el proyecto

Como levantar el proyecto 
- docker compose up --build

Preguntar al Bot por CURL , POSTMAN
curl -X POST http://localhost:4000/api/ai \
-H "Content-Type: application/json" \
-d '{"question":"Que ciudad tiene mayor precio promedio"}'


## URL del proyecto

Front-end 
http://localhost:3000

Backend 
http://localhost:4000/api-docs

Neo4j
http://localhost:7474

##BI

🧠 Flujo BI 

1️⃣ Bot:

Seleccione las ciudades a comparar

API:

GET /api/cities

2️⃣ Usuario selecciona

Monterrey
Guadalajara

3️⃣ Bot

Seleccione periodo
2021 - 2024

4️⃣ Bot

Seleccione tipo de gráfico

Opciones:

1 Line
2 Bar
3 Growth comparison

5️⃣ API

POST /api/analysis/compare-cities

Body:

{
  "cityIds": [13,5],
  "from": 2021,
  "to": 2024
}

6️⃣ Backend responde

[
  {
    "id": 13,
    "name": "Monterrey",
    "avg_price": 42000,
    "growth_percentage": 35.2
  },
  {
    "id": 5,
    "name": "Guadalajara",
    "avg_price": 38000,
    "growth_percentage": 28.4
  }
]