import React from "react";

export default function MasterPanel({ city, growth, average }) {
  return (
    <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 h-full">
      <h3 className="text-lg font-semibold mb-4">
        Dashboard Maestro
      </h3>

      <div className="space-y-4 text-sm">
        <div className="bg-gray-800 p-3 rounded-lg">
          Ciudad seleccionada: {city}
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          Precio promedio: ${average?.toFixed(2)} USD/m²
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          Crecimiento acumulado: {growth?.toFixed(2)}%
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          Vista ejecutiva con métricas globales.
        </div>
      </div>
    </div>
  );
}