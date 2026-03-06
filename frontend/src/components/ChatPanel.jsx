import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function ChatPanel({ agentType, setAnalysisData }) {
  const [cities, setCities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [from, setFrom] = useState("2021");
  const [to, setTo] = useState("2024");
  const [biViewType, setBiViewType] = useState("comparativo");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities`);
        setCities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error cargando ciudades:", error);
        setCities([]);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    setMessages([]);
    setAnalysisData(null);
  }, [agentType, setAnalysisData]);

  const toChartData = (history = []) =>
    history.map((row) => ({
      year: String(row.year),
      avg_price: Number(row.avg_price),
      period: String(row.year),
      price_per_m2: Number(row.avg_price)
    }));

  const computeGrowth = (history = []) => {
    if (!history.length) return 0;
    const sorted = [...history].sort((a, b) => Number(a.year) - Number(b.year));
    const first = Number(sorted[0].avg_price);
    const last = Number(sorted[sorted.length - 1].avg_price);
    if (!first) return 0;
    return ((last - first) / first) * 100;
  };

  const computeAverage = (history = []) => {
    if (!history.length) return 0;
    const total = history.reduce((acc, item) => acc + Number(item.avg_price), 0);
    return total / history.length;
  };

  const buildComparisonSeries = (cityA, cityB, historyA = [], historyB = []) => {
    const mapA = new Map(historyA.map((row) => [String(row.year), Number(row.avg_price)]));
    const mapB = new Map(historyB.map((row) => [String(row.year), Number(row.avg_price)]));
    const years = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();

    return years.map((year) => ({
      year,
      [cityA]: mapA.get(year) ?? null,
      [cityB]: mapB.get(year) ?? null
    }));
  };

  const buildExecutiveConclusions = ({
    cityA,
    cityB,
    growthA,
    growthB,
    avgA,
    avgB
  }) => {
    const spread = avgA - avgB;
    const leader = growthA >= growthB ? cityA : cityB;
    const lagger = leader === cityA ? cityB : cityA;

    return [
      `${leader} lidera crecimiento en el periodo con ${Math.max(growthA, growthB).toFixed(2)}%.`,
      spread >= 0
        ? `${cityA} mantiene mayor precio promedio (${avgA.toFixed(0)} USD/m2) frente a ${cityB} (${avgB.toFixed(0)} USD/m2).`
        : `${cityB} mantiene mayor precio promedio (${avgB.toFixed(0)} USD/m2) frente a ${cityA} (${avgA.toFixed(0)} USD/m2).`,
      `Recomendación ejecutiva: priorizar estrategias de entrada en ${leader} y monitorear riesgo de desaceleración en ${lagger}.`
    ];
  };

  const runFlow = async () => {
    if (!city1 || !city2 || city1 === city2) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Selecciona dos ciudades distintas para continuar."
        }
      ]);
      return;
    }

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `${agentType === "bi" ? "Flujo BI" : "Flujo Consultor"}: ${city1} vs ${city2} (${from}-${to})`
      }
    ]);

    try {
      const city1Obj = cities.find((city) => city.name === city1);
      const city2Obj = cities.find((city) => city.name === city2);

      const analyticsResponse = await axios.get(`${API_URL}/analytics/compare`, {
        params: {
          city1: city1Obj?.id,
          city2: city2Obj?.id,
          from,
          to
        }
      });

      const historyMap = analyticsResponse?.data?.history || {};
      const primaryHistory = historyMap[city1] || [];
      const secondaryHistory = historyMap[city2] || [];

      const average = computeAverage(primaryHistory);
      const growth = computeGrowth(primaryHistory);
      const averageCity2 = computeAverage(secondaryHistory);
      const growthCity2 = computeGrowth(secondaryHistory);
      const comparisonSeries = buildComparisonSeries(
        city1,
        city2,
        primaryHistory,
        secondaryHistory
      );

      if (agentType === "bi") {
        const zoneResponse = await axios.get(`${API_URL}/analytics/zone-evolution`, {
          params: {
            city1: city1Obj?.id,
            city2: city2Obj?.id,
            from,
            to
          }
        });

        setAnalysisData({
          city1,
          city2,
          viewType: biViewType,
          chartData: comparisonSeries,
          comparisonSeries,
          zoneRows: zoneResponse?.data?.rows || [],
          average,
          growth,
          averageCity2,
          growthCity2,
          secondaryHistory: toChartData(secondaryHistory)
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Vista BI (${biViewType}) lista. Ya puedes revisar heatmap, tabla dinámica o comparativo por zonas y ciudades.`
          }
        ]);
      } else {
        let presentation = null;
        let aiConclusions = [];

        try {
          const response = await axios.post(`${API_URL}/presentation/generate`, {
            city1: { name: city1, growth_percentage: growth.toFixed(2) },
            city2: {
              name: city2,
              growth_percentage: growthCity2.toFixed(2)
            },
            growth: growth.toFixed(2)
          });
          presentation = response.data;
          aiConclusions = (response?.data?.slides || [])
            .slice(0, 3)
            .map((slide) => slide.content)
            .filter(Boolean);
        } catch (error) {
          presentation = {
            slides: [
              {
                title: "Market Overview",
                content: `${city1} muestra un precio promedio de ${average.toFixed(2)} USD/m2 en el periodo ${from}-${to}.`
              },
              {
                title: "City Comparison",
                content: `Comparativo ejecutivo entre ${city1} y ${city2} con foco en tendencia anual de precios.`
              },
              {
                title: "Investment Opportunity",
                content: `Crecimiento acumulado estimado en ${city1}: ${growth.toFixed(2)}%.`
              }
            ]
          };
          console.error("No fue posible generar presentación con IA:", error);
        }

        setAnalysisData({
          title: `Análisis Ejecutivo: ${city1} vs ${city2}`,
          city1,
          city2,
          chartData: comparisonSeries,
          average,
          growth,
          averageCity2,
          growthCity2,
          executiveConclusions: aiConclusions.length
            ? aiConclusions
            : buildExecutiveConclusions({
              cityA: city1,
              cityB: city2,
              growthA: growth,
              growthB: growthCity2,
              avgA: average,
              avgB: averageCity2
            }),
          presentation
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Generé el análisis del consultor para ${city1} vs ${city2}. Ya está en el workspace.`
          }
        ]);
      }
    } catch (error) {
      console.error("Error en flujo de agente:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "No pude completar el flujo con esos parámetros. Intenta con otra combinación."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full rounded-2xl border border-gray-800 bg-[#15151a] p-5 flex flex-col">
      <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
        {agentType === "bi" ? "Maestro de BI" : "Consultor Inmobiliario"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
          value={city1}
          onChange={(event) => setCity1(event.target.value)}
        >
          <option value="">Ciudad 1</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
          value={city2}
          onChange={(event) => setCity2(event.target.value)}
        >
          <option value="">Ciudad 2</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <input
          className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
          type="number"
          min="2000"
          max="2099"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
        <input
          className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
          type="number"
          min="2000"
          max="2099"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
      </div>

      {agentType === "bi" && (
        <select
          className="mt-3 bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
          value={biViewType}
          onChange={(event) => setBiViewType(event.target.value)}
        >
          <option value="comparativo">Comparativo (ciudad vs ciudad)</option>
          <option value="heatmap">Heatmap (zonas por año)</option>
          <option value="table">Tabla dinámica (zonas)</option>
        </select>
      )}

      <button
        type="button"
        onClick={runFlow}
        disabled={loading}
        className="mt-4 bg-white text-black rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Ejecutar flujo"}
      </button>

      <div className="mt-5 flex-1 overflow-y-auto space-y-2 pr-1">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`rounded-lg px-3 py-2 text-sm ${
            m.sender === "user" ? "bg-black" : "bg-[#22222c] text-gray-200"
          }`}
        >
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            {m.sender}
          </p>
          <p>{m.text}</p>
        </div>
      ))}
      </div>
    </div>
  );
}
