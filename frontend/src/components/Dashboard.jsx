import { useEffect, useState } from "react";
import ChartCard from "./ChartCard";
import AgentPanel from "./AgentPanel";
import api from "../services/api";

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [chartData, setChartData] = useState([]);
  const [average, setAverage] = useState(null);
  const [growth, setGrowth] = useState(null);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const res = await api.get("/cities");
    setCities(res.data);
  };

  const loadCityAnalytics = async (city) => {
    setSelectedCity(city);

    const growthRes = await api.get(`/analytics/growth?city=${city}`);
    const avgRes = await api.get(`/analytics/average?city=${city}`);

    setChartData(growthRes.data.data || growthRes.data);
    setGrowth(growthRes.data.growth_percentage);
    setAverage(avgRes.data.average_price);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-wide">
          4S REAL ESTATE – Agentic Intelligence
        </h1>
        <div className="text-sm text-gray-400">
          {selectedCity || "Selecciona una ciudad"}
        </div>
      </div>

      <div className="p-6 flex gap-4 flex-wrap">
        {cities.map((c, i) => (
          <button
            key={i}
            onClick={() => loadCityAnalytics(c.name)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 p-8">
        <div className="col-span-2">
          <ChartCard
            city={selectedCity}
            data={chartData}
            average={average}
            growth={growth}
          />
        </div>
        <div>
          <AgentPanel
            city={selectedCity}
            growth={growth}
            average={average}
          />
        </div>
      </div>
    </div>
  );
}