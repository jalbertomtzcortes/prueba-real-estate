import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function BIWidgets({ data }) {

  if (!data) {
    return <div>No hay datos</div>;
  }

  const cities = Object.keys(data);

  if (cities.length < 2) {
    return <div>Selecciona dos ciudades</div>;
  }

  const merged = [];

  data[cities[0]].forEach((item, i) => {

    merged.push({
      year: item.year,
      city1: item.avg_price,
      city2: data[cities[1]][i]?.avg_price
    });

  });

  return (

    <div className="bg-[#15151a] p-6 rounded-xl border border-gray-800">

      <h2 className="text-xl font-bold mb-4">
        Comparativa de precios
      </h2>

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={merged}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="year" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="city1"
              stroke="#3b82f6"
              strokeWidth={3}
              name={cities[0]}
            />

            <Line
              type="monotone"
              dataKey="city2"
              stroke="#10b981"
              strokeWidth={3}
              name={cities[1]}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}