
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

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  role VARCHAR(20),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ÍNDICES

CREATE INDEX idx_zones_city_id ON zones(city_id);
CREATE INDEX idx_projects_zone_id ON projects(zone_id);
CREATE INDEX idx_price_history_project_id ON price_history(project_id);
CREATE INDEX idx_price_history_period ON price_history(period);