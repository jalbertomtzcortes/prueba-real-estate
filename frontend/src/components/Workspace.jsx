import React from "react";

export default function Workspace({ agentType, data }) {

  if (!data) {
    return <div>Selecciona una ciudad y periodo.</div>;
  }

  if (agentType === "consultor") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">
          Análisis Ejecutivo
        </h2>

        <div className="mb-4">
          <p>Ciudad: {data.city}</p>
          <p>Periodo: {data.from} - {data.to}</p>
          <p>Crecimiento: {data.growth}%</p>
          <p>Precio promedio: ${data.average}</p>
        </div>

        <div>
          <h3 className="font-bold mt-4">Conclusión:</h3>
          <p>
            {data.growth > 0
              ? "Mercado con tendencia positiva."
              : "Mercado con desaceleración."}
          </p>
        </div>
      </div>
    );
  }

  if (agentType === "bi") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">
          Business Intelligence
        </h2>

        <p>Ciudad: {data.city}</p>
        <p>Crecimiento: {data.growth}%</p>
        <p>Precio promedio: ${data.average}</p>
      </div>
    );
  }

  return null;
}