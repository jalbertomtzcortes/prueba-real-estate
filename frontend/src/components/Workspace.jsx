import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import api from "../services/api";

export default function Workspace({ agentType, data }) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    if (agentType !== "bi" || !data) return;

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Crecimiento (%)", "Precio Promedio"],
        datasets: [
          {
            label: data.city,
            data: [data.growth, data.average],
          },
        ],
      },
    });

  }, [data, agentType]);

  const generatePPT = async () => {
    await api.post("/presentation", data);
    window.open("http://localhost:4000/presentation.html", "_blank");
  };

  if (!data) return <div className="text-gray-400">Esperando análisis...</div>;

  return (
    <div className="space-y-6">

      {agentType === "consultor" && (
        <button
          onClick={generatePPT}
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          Generar PPT Ejecutivo
        </button>
      )}

      {agentType === "bi" && (
        <canvas ref={chartRef}></canvas>
      )}

    </div>
  );
}