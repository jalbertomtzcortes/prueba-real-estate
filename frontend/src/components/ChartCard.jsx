import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ChartCard({ city, data, average, growth }) {
  if (!city) {
    return (
      <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800">
        Selecciona una ciudad para visualizar datos
      </div>
    );
  }

  return (
    <div className="bg-[#15151a] p-6 rounded-2xl shadow-xl border border-gray-800">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
        Market Intelligence
      </p>

      <h2 className="text-2xl font-bold mb-6">
        Evolución de precios – {city}
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price_per_m2"
              stroke="#ffffff"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-[#1b1b22] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Promedio actual</p>
          <p className="text-lg font-semibold mt-2">
            ${average?.toFixed(2)}
          </p>
        </div>

        <div className="bg-[#1b1b22] p-4 rounded-lg">
          <p className="text-sm text-gray-400">Crecimiento</p>
          <p className="text-lg font-semibold mt-2">
            {growth?.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
