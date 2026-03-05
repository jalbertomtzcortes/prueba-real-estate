# Real Estate Analytics Platform

## Stack
- PostgreSQL
- Neo4j
- Node.js
- Docker
- React
- IA
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
##

curl -X POST http://localhost:4000/api/ai \
-H "Content-Type: application/json" \
-d '{"question":"Que ciudad tiene mayor precio promedio"}'

- docker compose up --build


Front-end 
http://localhost:3000

Backend 
http://localhost:4000/api-docs

Neo4j
http://localhost:7474