-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'analyst',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city_id INT REFERENCES cities(id),
  UNIQUE(name, city_id)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  zone_id INT REFERENCES zones(id),
  UNIQUE(name, zone_id)
);

CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  period DATE NOT NULL,
  price_per_m2 NUMERIC NOT NULL,
  UNIQUE(project_id, period)
);

-- ============================================
-- STAGING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS staging_projects (
  city TEXT,
  zone TEXT,
  project_name TEXT,
  period TEXT,
  price_per_m2 NUMERIC
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_zones_city_id 
ON zones(city_id);

CREATE INDEX IF NOT EXISTS idx_projects_zone_id 
ON projects(zone_id);

CREATE INDEX IF NOT EXISTS idx_price_history_project_id 
ON price_history(project_id);

CREATE INDEX IF NOT EXISTS idx_price_history_period 
ON price_history(period);

-- ============================================
-- LIMPIAR STAGING
-- ============================================

TRUNCATE TABLE staging_projects;

-- ============================================
-- CARGAR CSV
-- IMPORTANTE:
-- En Docker debe estar en /app/database/dataset_clean.csv
-- ============================================



\copy staging_projects(city, zone, project_name, period, price_per_m2) FROM '/docker-entrypoint-initdb.d/dataset_clean.csv' DELIMITER ',' CSV HEADER;


-- ============================================
-- INSERTAR CIUDADES
-- ============================================

INSERT INTO cities (name)
SELECT DISTINCT trim(city)
FROM staging_projects
WHERE city IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INSERTAR ZONAS
-- ============================================

INSERT INTO zones (name, city_id)
SELECT DISTINCT
  trim(s.zone),
  c.id
FROM staging_projects s
JOIN cities c 
  ON trim(s.city) = c.name
WHERE s.zone IS NOT NULL
ON CONFLICT (name, city_id) DO NOTHING;

-- ============================================
-- INSERTAR PROYECTOS
-- ============================================

INSERT INTO projects (name, zone_id)
SELECT DISTINCT
  trim(s.project_name),
  z.id
FROM staging_projects s
JOIN zones z 
  ON trim(s.zone) = z.name
WHERE s.project_name IS NOT NULL
ON CONFLICT (name, zone_id) DO NOTHING;

-- ============================================
-- INSERTAR HISTORIAL DE PRECIOS
-- 🔥 CORREGIDO: period viene como AÑO (ej: 2023)
-- Se convierte a DATE como 2023-01-01
-- ============================================

INSERT INTO price_history (project_id, period, price_per_m2)
SELECT p.id,
       to_date(s.period, 'Mon-YY'),
       s.price_per_m2
FROM staging_projects s
JOIN projects p ON trim(s.project_name) = p.name
WHERE s.price_per_m2 IS NOT NULL
ON CONFLICT (project_id, period) DO NOTHING;

-- ============================================
-- MENSAJE FINAL
-- ============================================

INSERT INTO users (name, email, password, role)
VALUES 
  ('Administrador', 'admin@example.com', '$2b$10$F2CXg3jJs9eupHHbmDczNu9aGe3E7bd4g8EHr3VRspoSj0.jZdspu', 'admin')
ON CONFLICT (email) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'Base de datos inicializada correctamente ✅';
END $$;