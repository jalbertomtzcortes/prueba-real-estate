# 02 – Modelado de Datos

## 1. Estrategia General

Se adopta modelo híbrido:

- PostgreSQL → Datos históricos y métricas
- Neo4j → Relaciones estructurales

Separación clara entre:

- Temporalidad estructural
- Temporalidad métrica

---


## 2. Modelo Relacional (PostgreSQL)

### Entidades

cities
- id
- name
- country
- created_at

zones
- id
- name
- city_id
- created_at

projects
- id
- name
- zone_id
- launch_date
- delivery_date
- status
- created_at

prices
- id
- project_id
- period_start
- period_end
- quarter
- price_per_m2
- created_at

---

## 3. Decisiones Técnicas

- Índices en claves foráneas
- Índice compuesto (project_id, period_start)
- Separación de precios para optimizar agregaciones
- Uso de DATE para evitar ambigüedad temporal

---

## 4. Modelo de Grafo (Neo4j)

Estructura:

(City)-[:HAS_ZONE]->(Zone)
(Zone)-[:HAS_PROJECT]->(Project)

Se evita almacenar histórico de precios en el grafo para mantener eficiencia en consultas de relación.

