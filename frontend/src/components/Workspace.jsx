import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import api from "../services/api";

export default function Workspace({ agentType, data }) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [presentationReady, setPresentationReady] = useState(false);

  // ==========================
  // GRÁFICA SOLO PARA BI
  // ==========================
  useEffect(() => {

    if (agentType !== "bi") return;
    if (!data) return;
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

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
      options: {
        responsive: true,
      },
    });

  }, [data, agentType]);

  // ==========================
  // GENERAR PRESENTACIÓN
  // ==========================
  const generatePresentation = async () => {
    if (!data) return;

    await api.post("/presentation", data);
    setPresentationReady(true);
  };

  // ==========================
  // SIN DATOS
  // ==========================
  if (!data) {
    return (
      <div className="text-gray-400">
        Esperando análisis...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-bold mb-2">
          {agentType === "consultor"
            ? "Análisis Estratégico"
            : "Business Intelligence"}
        </h2>

        <p className="text-gray-400">
          Ciudad: {data.city} | Periodo: {data.from} - {data.to}
        </p>
      </div>

      {/* 📊 BI */}
      {agentType === "bi" && (
        <div className="bg-[#1c1c24] p-4 rounded-xl">
          <canvas ref={chartRef}></canvas>
        </div>
      )}

      {/* 🏢 CONSULTOR */}
      {agentType === "consultor" && (
        <div className="bg-[#1c1c24] p-4 rounded-xl">

          <button
            onClick={generatePresentation}
            className="bg-green-600 px-4 py-2 rounded-lg mb-4"
          >
            Generar Diapositiva IA
          </button>

          {presentationReady && (
            <iframe
              src="http://localhost:4000/presentation.html"
              className="w-full h-96 rounded-lg"
              title="presentation"
            />
          )}

        </div>
      )}

    </div>
  );
}