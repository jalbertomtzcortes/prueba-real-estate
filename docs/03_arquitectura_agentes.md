# 03 – Arquitectura Agéntica

## 1. Concepto

La plataforma adopta un modelo agéntico donde cada agente tiene:

- Rol específico
- Contexto delimitado
- Estructura de respuesta tipada

---

## 2. Orquestador

Responsabilidades:

- Clasificación de intención
- Selección de agente
- Construcción de contexto
- Validación de respuesta

---

## 3. Agente 1 – Consultor Estratégico

Responsable de:

- Generar insights ejecutivos
- Resumir tendencias
- Producir narrativa tipo presentación

Output:

{
  type: "presentation",
  title: "",
  insights: [],
  metrics: [],
  visualData: []
}

---

## 4. Agente 2 – Analista BI

Responsable de:

- Generar datos para gráficos
- Comparativos
- Rankings
- Heatmaps

Output:

{
  type: "chart",
  chartType: "",
  labels: [],
  series: []
}

---

## 5. Buenas Prácticas

- Respuestas estructuradas
- Validación de esquema JSON
- Separación entre generación y ejecución de queries
- Control de tokens y costos