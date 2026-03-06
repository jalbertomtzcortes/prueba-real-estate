import React from "react";
import SlideView from "./SlideView";
import BIInsights from "./BIInsights";

export default function Workspace({ agentType, data }) {
  if (!data) {
    return (
      <div className="h-full rounded-2xl border border-gray-800 bg-[#15151a] p-8">
        <p className="text-xl text-white font-medium leading-relaxed">
          Interactúa con el chat del panel derecho para seleccionar ciudades y
          fechas, y luego generar el análisis.
        </p>
      </div>
    );
  }

  if (agentType === "bi") {
    return <BIInsights data={data} />;
  }

  return (
    <div className="space-y-6">
      <SlideView
        title={data.title}
        city1={data.city1}
        city2={data.city2}
        growth={data.growth}
        growthCity2={data.growthCity2}
        average={data.average}
        averageCity2={data.averageCity2}
        history={data.chartData}
        executiveConclusions={data.executiveConclusions}
      />
    </div>
  );
}
