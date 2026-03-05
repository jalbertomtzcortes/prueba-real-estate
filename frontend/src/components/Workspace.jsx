import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Workspace({ agentType, data }) {

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {

    if (!data || agentType !== "bi") return;

    if (chartInstance.current) chartInstance.current.destroy();

    if (data.mode === "compare") {

      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["Crecimiento (%)", "Precio Promedio"],
          datasets: [
            {
              label: data.cityA.name,
              data: [data.cityA.growth, data.cityA.average],
            },
            {
              label: data.cityB.name,
              data: [data.cityB.growth, data.cityB.average],
            }
          ],
        },
      });

    }

  }, [data, agentType]);

  if (!data) return <div>Esperando análisis...</div>;

  if (agentType === "consultor") {
    return <div>Análisis estratégico listo. Genera PPT.</div>;
  }

  return <canvas ref={chartRef}></canvas>;
}