# Real Estate Analytics Platform

## Stack
- PostgreSQL
- Neo4j
- Node.js
- Docker

## Arquitectura
- ETL para transformación de dataset
- Modelo relacional normalizado
- Histórico de precios por proyecto
- Queries analíticas optimizadas

## Cómo correr el proyecto

##
- docker compose up --build
- docker exec -it postgres_db psql -U admin -d realestate 
y ejecutar los comandos  de /docs/02_modelo_datos.md


BackEnd - Endpoints
http://localhost:4000/api-docs