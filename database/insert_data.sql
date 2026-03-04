INSERT INTO cities (name)
SELECT DISTINCT trim(city)
FROM staging_projects
WHERE city IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO zones (name, city_id)
SELECT DISTINCT trim(s.zone), c.id
FROM staging_projects s
JOIN cities c ON trim(s.city) = c.name
WHERE s.zone IS NOT NULL
ON CONFLICT (name, city_id) DO NOTHING;

INSERT INTO projects (name, zone_id)
SELECT DISTINCT trim(s.project_name), z.id
FROM staging_projects s
JOIN zones z ON trim(s.zone) = z.name
WHERE s.project_name IS NOT NULL
ON CONFLICT (name, zone_id) DO NOTHING;

INSERT INTO price_history (project_id, period, price_per_m2)
SELECT p.id,
       to_date(s.period, 'Mon-YY'),
       s.price_per_m2
FROM staging_projects s
JOIN projects p ON trim(s.project_name) = p.name
WHERE s.price_per_m2 IS NOT NULL
ON CONFLICT (project_id, period) DO NOTHING;