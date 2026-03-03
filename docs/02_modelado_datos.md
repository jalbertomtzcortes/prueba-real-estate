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

---

## 5. Escalabilidad Futura

- Posible particionamiento por país
- Row-level security para multi-tenant
- Integración futura con data warehouse


CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city_id INT REFERENCES cities(id),
  UNIQUE(name, city_id)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  zone_id INT REFERENCES zones(id),
  UNIQUE(name, zone_id)
);

CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  period DATE NOT NULL,
  price_per_m2 NUMERIC NOT NULL,
  UNIQUE(project_id, period)
);

CREATE TABLE staging_projects (
  city TEXT,
  zone TEXT,
  project_name TEXT,
  period TEXT,
  price_per_m2 NUMERIC
);

///migracion

INSERT INTO cities (name)
SELECT DISTINCT trim(convert_from(convert_to(city, 'LATIN1'), 'UTF8'))
FROM staging_projects
WHERE city IS NOT NULL;

INSERT INTO zones (name, city_id)
SELECT DISTINCT
  trim(s.zone),
  c.id
FROM staging_projects s
JOIN cities c ON trim(s.city) = c.name
WHERE s.zone IS NOT NULL;

INSERT INTO projects (name, zone_id)
SELECT DISTINCT
  trim(s.project_name),
  z.id
FROM staging_projects s
JOIN zones z ON trim(s.zone) = z.name
WHERE s.project_name IS NOT NULL;

INSERT INTO price_history (project_id, period, price_per_m2)
SELECT
  p.id,
  to_date(s.period, 'Mon-YY') AS period_date,
  s.price_per_m2
FROM staging_projects s
JOIN projects p 
  ON trim(s.project_name) = p.name
WHERE s.price_per_m2 IS NOT NULL;

CREATE INDEX idx_zones_city_id ON zones(city_id);
CREATE INDEX idx_projects_zone_id ON projects(zone_id);
CREATE INDEX idx_price_history_project_id ON price_history(project_id);
CREATE INDEX idx_price_history_period ON price_history(period);