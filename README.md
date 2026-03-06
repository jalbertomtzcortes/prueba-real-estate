# Real Estate Intelligence Platform

Plataforma de analítica inmobiliaria con:
- Dashboard React con dos agentes (`Consultor Inmobiliario` y `Maestro BI`)
- Backend Node.js/Express (REST + GraphQL)
- PostgreSQL (modelo relacional)
- Neo4j (grafo de conocimiento para traversal)

## Arquitectura Rápida
- `frontend/`: interfaz y flujos de agentes.
- `backend/`: APIs, lógica de negocio, GraphQL, carga de Neo4j.
- `database/`: inicialización SQL y datasets para bootstrap.
- `docs/`: documentación funcional y ejecutiva.

## Requisitos
- Docker Desktop + Docker Compose v2
- Puertos libres:
  - `3000` (frontend)
  - `4000` (backend)
  - `5432` (postgres)
  - `7474`, `7687` (neo4j)

## Variables de Entorno

### 1) Archivo raíz `.env`
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=real_estate
POSTGRES_DB=real_estate
POSTGRES_HOST=postgres_db
POSTGRES_PORT=5432

NEO4J_USER=neo4j
NEO4J_PASSWORD=admin123
NEO4J_URI=bolt://neo4j:7687

BACKEND_PORT=4000
```

### 2) Archivo `backend/.env`
```env
JWT_SECRET=replace_with_secure_secret
OPENAI_API_KEY=replace_with_openai_key
```

## Levantar el Proyecto (Docker)

Primera vez o si quieres reiniciar datos:
```bash
docker compose down -v
docker compose up --build
```

## Alcance de Entorno
- Este proyecto está configurado para ejecutarse en entorno local.
- No requiere dominio público ni deploy en Heroku para uso normal.

Si ya tienes volúmenes y solo quieres levantar:
```bash
docker compose up --build
```

## URLs
- Frontend: `http://localhost:3000`
- Backend (Swagger): `http://localhost:4000/api-docs`
- GraphQL: `http://localhost:4000/graphql`
- Neo4j Browser: `http://localhost:7474`

## Login
- Email: `admin@example.com`
- Password: `admin123`

## Flujos de la App

### Consultor Inmobiliario
- Selecciona `Ciudad 1`, `Ciudad 2` y rango de años.
- Genera una diapositiva ejecutiva con:
  - Gráfico comparativo de precios
  - Datos clave (promedios y crecimiento)
  - Conclusiones ejecutivas

### Maestro BI
- Selecciona ciudades y periodo.
- Elige tipo de vista:
  - `Comparativo`
  - `Heatmap` por zonas y años
  - `Tabla dinámica` (ordenable) con `Top N`
- Permite exportar CSV desde la tabla dinámica.

## Endpoints Principales
- `POST /api/auth/login`
- `GET /api/cities`
- `GET /api/analytics/compare`
- `GET /api/analytics/zone-evolution`
- `POST /api/presentation/generate`
- `POST /api/ai`

## GraphQL
Endpoint: `POST /graphql`

Ejemplo:
```graphql
query {
  projectsByCity(city: "Monterrey") {
    city
    zone
    name
    source
  }
}
```

## Troubleshooting
- Si cambia estructura de dataset o encoding:
  - reinicia con `docker compose down -v` y vuelve a levantar.
- Si frontend muestra bundle antiguo:
  - reconstruye con `docker compose up --build`.
- Si ves `ERR_CONNECTION_TIMED_OUT` a una IP externa:
  - valida `frontend/.env` con `VITE_API_URL=http://localhost:4000/api`
  - reconstruye frontend para regenerar `dist`.
- Si Neo4j falla auth por datos viejos:
  - elimina volúmenes (`down -v`) y vuelve a iniciar.

## Documentación Adicional
- Uso app: [docs/05_uso_app_consultor_bi.md](docs/05_uso_app_consultor_bi.md)
