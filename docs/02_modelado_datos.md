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

SELECT id,name
FROM cities
ORDER BY name;

SELECT 
    ciudad,
    COUNT(*) as total_propiedades
FROM propiedades
GROUP BY ciudad
HAVING COUNT(*) > 5
ORDER BY total_propiedades DESC;



SELECT 
    c.name AS city,
    COUNT(p.id) AS total_projects
FROM cities c
JOIN zones z ON z.city_id = c.id
JOIN projects p ON p.zone_id = z.id
GROUP BY c.name
ORDER BY total_projects DESC;

SELECT
  EXTRACT(YEAR FROM ph.period) AS year,
  ROUND(AVG(ph.price_per_m2),2) AS avg_price
FROM price_history ph
JOIN projects p ON ph.project_id = p.id
JOIN zones z ON p.zone_id = z.id
JOIN cities c ON z.city_id = c.id
WHERE c.id = 13
GROUP BY year
ORDER BY year;

