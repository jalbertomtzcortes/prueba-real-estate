import React from "react";
import { Line } from "react-chartjs-2";

export default function BIWidgets({ data }) {

  if (!data || data.length === 0) {
    return <p>No hay datos</p>;
  }

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Precio promedio",
        data: data.map((d) => d.price),
        borderWidth: 2
      }
    ]
  };

  return <Line data={chartData} />;
}