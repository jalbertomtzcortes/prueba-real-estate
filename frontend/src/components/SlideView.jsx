import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function SlideView({
  title,
  city1,
  city2,
  growth,
  growthCity2,
  average,
  averageCity2,
  history,
  executiveConclusions = []
}) {
  return (
    <div className="bg-[#15151a] p-8 rounded-2xl border border-gray-800">

      <h2 className="text-xl font-bold mb-6">{title}</h2>

      {/* Datos clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Crecimiento {city1}</p>
          <p className="text-2xl font-bold text-green-500">
            {growth?.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Precio Promedio {city1}</p>
          <p className="text-2xl font-bold">
            ${average?.toFixed(0)} USD/m²
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Crecimiento {city2}</p>
          <p className="text-2xl font-bold text-cyan-400">
            {Number(growthCity2 || 0).toFixed(2)}%
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Precio Promedio {city2}</p>
          <p className="text-2xl font-bold">
            ${Number(averageCity2 || 0).toFixed(0)} USD/m²
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={city1} stroke="#00ff99" strokeWidth={3} connectNulls />
            <Line type="monotone" dataKey={city2} stroke="#38bdf8" strokeWidth={3} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conclusión ejecutiva */}
      <div className="mt-8 bg-black p-6 rounded-xl">
        <h3 className="font-bold mb-2">Conclusión Ejecutiva</h3>
        <div className="text-gray-300 text-sm space-y-2">
          {(executiveConclusions || []).length > 0 ? (
            executiveConclusions.slice(0, 3).map((item, index) => (
              <p key={index}>• {item}</p>
            ))
          ) : (
            <p>
              • {city1} y {city2} muestran dinámicas diferenciadas. Se sugiere
              priorizar mercado con mayor crecimiento y monitorear dispersión de precios.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
