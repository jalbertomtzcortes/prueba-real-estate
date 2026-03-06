# Uso de la App: Consultor Inmobiliario y Maestro BI

## 1) Objetivo
Este documento explica el flujo funcional del dashboard para los dos agentes:
- `Consultor Inmobiliario`
- `Maestro de BI`

## 2) Acceso
- Frontend: `http://localhost:3000`
- Login por defecto:
  - Email: `admin@example.com`
  - Password: `admin123`

## 3) Flujo del Consultor Inmobiliario
1. Inicia sesión.
2. En el selector de agente, elige `Consultor Inmobiliario`.
3. En el panel derecho (`ChatPanel`), selecciona:
   - `Ciudad 1`
   - `Ciudad 2`
   - `Año inicio` y `Año fin`
4. Presiona `Ejecutar flujo`.
5. El sistema consulta analítica y construye:
   - Vista ejecutiva en `Workspace` (slide con crecimiento y promedio).
   - Presentación generada por IA (si hay API key), con fallback local si falla IA.

## 4) Flujo del Maestro BI
1. En el selector de agente, elige `Maestro de BI`.
2. Selecciona `Ciudad 1`, `Ciudad 2` y rango de años.
3. Presiona `Ejecutar flujo`.
4. El sistema muestra en `Workspace`:
   - Gráfica de evolución.
   - Métricas agregadas (promedio y crecimiento del periodo).

## 5) Endpoints usados por el Frontend
- `GET /api/cities`
  - Catálogo de ciudades para selects.
- `GET /api/analytics/compare?city1={id}&city2={id}&from={yyyy}&to={yyyy}`
  - Serie histórica para comparación por periodo.
- `POST /api/presentation/generate`
  - Generación de narrativa/estructura de presentación para el consultor.

## 6) Validación rápida
1. Levantar contenedores:
   - `docker compose up --build`
2. Login en frontend.
3. Ejecutar ambos agentes y validar:
   - Carga de ciudades con acentos correctos.
   - Gráfica en workspace.
   - Mensajes de estado en panel derecho.

