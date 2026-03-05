import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

function ChartRenderer({ chart }) {

  if (!chart) return null;

  const data = {
    labels: chart.labels,
    datasets: chart.datasets
  };

  if (chart.chartType === "bar") return <Bar data={data} />;
  if (chart.chartType === "line") return <Line data={data} />;
  if (chart.chartType === "pie") return <Pie data={data} />;

  return null;
}

export default ChartRenderer;