# Resumen Ejecutivo de Arquitectura

## 1) Visión General
Plataforma inmobiliaria con arquitectura por capas:
- `Frontend` React/Vite para dashboard y flujos de agentes.
- `Backend` Node.js/Express para APIs de negocio y GraphQL.
- `PostgreSQL` para modelo relacional y métricas históricas.
- `Neo4j` para grafo de conocimiento (traversal por ciudad/zona/proyecto).

## 2) URLs Base
- Frontend: `http://localhost:3000`
- Backend REST: `http://localhost:4000`
- Swagger: `http://localhost:4000/api-docs`
- GraphQL: `http://localhost:4000/graphql`
- Neo4j Browser: `http://localhost:7474`

## 3) Componentes Frontend Clave
- `App.jsx`: control de sesión.
- `Dashboard.jsx`: layout principal (workspace + panel de interacción).
- `AgentSelector.jsx`: cambio de agente.
- `ChatPanel.jsx`: orquesta consultas por flujo.
- `Workspace.jsx`: render de visualización según agente.
- `ChartCard.jsx`, `SlideView.jsx`, `PresentationView.jsx`: vistas de salida.

## 4) Capa Backend (REST + GraphQL)
- REST principal:
  - `GET /api/cities`
  - `GET /api/analytics/compare`
  - `POST /api/presentation/generate`
  - `POST /api/auth/login`
- GraphQL:
  - Datos de Neo4j (traversal): `projectsByCity(city)`
  - Datos de PostgreSQL: `projectsByCitySQL(city)`, `citiesSQL`

## 5) Modelo de Datos Relacional
PostgreSQL:
- `cities`
- `zones`
- `projects`
- `price_history`
- `users`

Relaciones:
- `cities 1..N zones`
- `zones 1..N projects`
- `projects 1..N price_history`

## 6) Grafo de Conocimiento (Neo4j)
Nodos:
- `City`
- `Zone`
- `Project`

Relaciones:
- `(City)-[:HAS_ZONE]->(Zone)`
- `(Zone)-[:HAS_PROJECT]->(Project)`
- `(Project)-[:IN_CITY]->(City)`

Esto habilita consultas de traversal por contexto geográfico y portafolio.

## 7) Carga y Normalización de Dataset
- Dataset limpio principal: `backend/src/dataset/dataset_clean.csv`
- Carga relacional inicial (Docker): `database/dataset_clean.csv`
- Se implementó normalización UTF-8 para corregir acentos y mojibake.

## 8) Tecnologías Usadas
- Frontend: React, Vite, Tailwind, Recharts
- Backend: Node.js, Express, GraphQL
- DB: PostgreSQL, Neo4j
- Infra: Docker Compose
- IA: OpenAI API (presentaciones/resúmenes ejecutivos)

## 9) Estado Ejecutivo
- Flujos de Consultor y BI disponibles en dashboard.
- Fuentes relacional y grafo expuestas para consumo.
- Pipeline de encoding corregido para datos en español.

