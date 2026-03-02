01 – Especificación Técnica

El objetivo es desarrollar un prototipo funcional que permita interactuar con datos históricos del mercado inmobiliario través de agentes especializados.

Plataforma Agéntica de Inteligencia Inmobiliaria
______________________________________________
1. La solución :

Base de datos relacional (SQL)
Base de datos de grafos (Neo4j)
API unificada (GraphQL)
Backend en Node.js
Frontend en React
Capa agéntica de orquestación
___________________________________________

2. Arquitectura Propuesta

Se adopta una arquitectura modular orientada a servicios desacoplados, compuesta por:

Capa de Presentación (Frontend)
Capa de API (GraphQL Gateway)
Capa de Aplicación (Backend Node.js)
Capa Agéntica (Orquestador)
Capa de Persistencia (SQL + Grafo)
Capa de Infraestructura (Docker + CI/CD)
_________________________________________________
3. Modelo de Datos
PostgreSQL

Tablas:

cities
zones
projects
prices


Neo4j

Modelo:

(City)-[:HAS_ZONE]->(Zone)
(Zone)-[:HAS_PROJECT]->(Project)
_________________________________________________

4.Diseño de Agentes
Agente 1 – Consultor Estratégico  (Payload)

{
  "type": "presentation",
  "title": "...",
  "keyMetrics": [],
  "insights": [],
  "visualData": []
}

Agente 2 – Analista Bi (Payload)

{
  "type": "chart",
  "chartType": "bar | line | heatmap",
  "labels": [],
  "series": []
}

5 Estructura de Carpetas

backend/
src/
controllers/
services/
agents/
db/
utils/