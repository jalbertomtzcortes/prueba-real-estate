import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

const STAGES = {
  AWAIT_CITY_1: "await_city_1",
  AWAIT_CITY_2: "await_city_2",
  AWAIT_DATES: "await_dates",
  ERROR: "error",
};

const normalizeText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const parseYearRange = (message = "") => {
  const normalized = normalizeText(message);

  const strict = normalized.match(/(19\d{2}|20\d{2})\s*(?:-|a|hasta|to)\s*(19\d{2}|20\d{2})/);
  if (strict) {
    const left = Number(strict[1]);
    const right = Number(strict[2]);
    return left <= right
      ? { from: String(left), to: String(right) }
      : { from: String(right), to: String(left) };
  }

  const years = normalized.match(/(19\d{2}|20\d{2})/g) || [];
  if (years.length >= 2) {
    const left = Number(years[0]);
    const right = Number(years[1]);
    return left <= right
      ? { from: String(left), to: String(right) }
      : { from: String(right), to: String(left) };
  }

  return null;
};

const isShowCitiesCommand = (message = "") => {
  const normalized = normalizeText(message);
  return (
    normalized === "ver ciudades" ||
    normalized === "ciudades" ||
    normalized === "lista ciudades" ||
    normalized === "mostrar ciudades"
  );
};

const toChartData = (history = []) =>
  history.map((row) => ({
    year: String(row.year),
    avg_price: Number(row.avg_price),
    period: String(row.year),
    price_per_m2: Number(row.avg_price),
  }));

const toSingleCitySeries = (city, history = []) =>
  history.map((row) => ({
    year: String(row.year),
    [city]: Number(row.avg_price),
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
    [cityB]: mapB.get(year) ?? null,
  }));
};

const buildExecutiveConclusions = ({ cityA, cityB, growthA, growthB, avgA, avgB }) => {
  const spread = avgA - avgB;
  const leader = growthA >= growthB ? cityA : cityB;
  const lagger = leader === cityA ? cityB : cityA;

  return [
    `${leader} lidera crecimiento en el periodo con ${Math.max(growthA, growthB).toFixed(2)}%.`,
    spread >= 0
      ? `${cityA} mantiene mayor precio promedio (${avgA.toFixed(0)} USD/m2) frente a ${cityB} (${avgB.toFixed(0)} USD/m2).`
      : `${cityB} mantiene mayor precio promedio (${avgB.toFixed(0)} USD/m2) frente a ${cityA} (${avgA.toFixed(0)} USD/m2).`,
    `Factor clave: priorizar ${leader} y monitorear desaceleración en ${lagger}.`,
  ];
};

const buildSingleCityInsights = ({ city, growth, average, from, to }) => {
  return [
    `${city} registró un crecimiento de ${Number(growth || 0).toFixed(2)}% entre ${from} y ${to}.`,
    `El precio promedio estimado fue de ${Number(average || 0).toFixed(0)} USD/m2 durante el periodo analizado.`,
    `Insight clave: ${Number(growth || 0) >= 0 ? "la tendencia es favorable para seguimiento comercial e inversión." : "el mercado requiere cautela por la desaceleración observada."}`,
  ];
};

export default function ChatPanel({ agentType, setAnalysisData }) {
  const [cities, setCities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    city1: "",
    city2: "",
    from: "",
    to: "",
    stage: STAGES.AWAIT_CITY_1,
  });

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const formatCitiesList = (list = []) => {
    if (!list.length) return "No hay ciudades disponibles.";
    return list.map((city, index) => `${index + 1}.- ${city.name}`).join("\n");
  };

  const findCityFromMessage = (message) => {
    const trimmed = message.trim();
    if (!trimmed) return null;

    if (/^\d+$/.test(trimmed)) {
      const idx = Number(trimmed) - 1;
      if (idx >= 0 && idx < cities.length) return cities[idx];
    }

    const normalizedMessage = normalizeText(trimmed);

    const exact = cities.find((city) => normalizeText(city.name) === normalizedMessage);
    if (exact) return exact;

    const contains = cities.find((city) => normalizedMessage.includes(normalizeText(city.name)));
    return contains || null;
  };

  const bootConversation = (loadedCities) => {
    const introMessage = agentType === "bi"
      ? 'Maestro BI activo. Escribe "ver ciudades" Generar el Grafico.\nDespués escribe la Ciudad 1.'
      : 'Consultor Inmobiliario activo. Escribe "ver ciudades" para ver el catálogo.\nDespués escribe una ciudad.';

    setAnalysisData(null);
    setMessages([
      {
        sender: "bot",
        text: introMessage,
      },
    ]);

    setContext({
      city1: "",
      city2: "",
      from: "",
      to: "",
      stage: loadedCities.length ? STAGES.AWAIT_CITY_1 : STAGES.ERROR,
    });

    if (!loadedCities.length) {
      addBotMessage("No pude cargar ciudades. Intenta recargar la página.");
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities`);
        const loaded = Array.isArray(response.data) ? response.data : [];
        setCities(loaded);
        bootConversation(loaded);
      } catch (error) {
        console.error("Error cargando ciudades:", error);
        setCities([]);
        bootConversation([]);
      }
    };

    loadCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentType, setAnalysisData]);

  const runBiFlow = async ({ city1, city2, from, to }) => {
    const city1Obj = cities.find((city) => city.name === city1);
    const city2Obj = cities.find((city) => city.name === city2);

    if (!city1Obj || !city2Obj || city1Obj.id === city2Obj.id) {
      addBotMessage("Necesito dos ciudades válidas y distintas.");
      return false;
    }

    setLoading(true);

    try {
      const analyticsResponse = await axios.get(`${API_URL}/analytics/compare`, {
        params: {
          city1: city1Obj.id,
          city2: city2Obj.id,
          from,
          to,
        },
      });

      const historyMap = analyticsResponse?.data?.history || {};
      const primaryHistory = historyMap[city1] || [];
      const secondaryHistory = historyMap[city2] || [];

      const average = computeAverage(primaryHistory);
      const growth = computeGrowth(primaryHistory);
      const averageCity2 = computeAverage(secondaryHistory);
      const growthCity2 = computeGrowth(secondaryHistory);
      const comparisonSeries = buildComparisonSeries(city1, city2, primaryHistory, secondaryHistory);

      if (agentType === "bi") {
        const zoneResponse = await axios.get(`${API_URL}/analytics/zone-evolution`, {
          params: {
            city1: city1Obj.id,
            city2: city2Obj.id,
            from,
            to,
          },
        });

        setAnalysisData({
          city1,
          city2,
          viewType: "comparativo",
          chartData: comparisonSeries,
          comparisonSeries,
          zoneRows: zoneResponse?.data?.rows || [],
          average,
          growth,
          averageCity2,
          growthCity2,
          secondaryHistory: toChartData(secondaryHistory),
        });

        addBotMessage(
          `Análisis BI listo (${city1} vs ${city2}, ${from}-${to}).\n` +
            `Promedios: ${city1} ${average.toFixed(2)} USD/m2 | ${city2} ${averageCity2.toFixed(2)} USD/m2.`
        );
      } else {
        let aiConclusions = [];
        let presentation = null;

        try {
          const response = await axios.post(`${API_URL}/presentation/generate`, {
            city1: { name: city1, growth_percentage: growth.toFixed(2) },
            city2: { name: city2, growth_percentage: growthCity2.toFixed(2) },
            growth: growth.toFixed(2),
          });

          presentation = response.data;
          aiConclusions = (response?.data?.slides || [])
            .slice(0, 3)
            .map((slide) => slide.content)
            .filter(Boolean);
        } catch (error) {
          console.error("No fue posible generar presentación con IA:", error);
        }

        const finalConclusions = aiConclusions.length
          ? aiConclusions
          : buildExecutiveConclusions({
              cityA: city1,
              cityB: city2,
              growthA: growth,
              growthB: growthCity2,
              avgA: average,
              avgB: averageCity2,
            });

        setAnalysisData({
          title: `Análisis Ejecutivo: ${city1} vs ${city2}`,
          city1,
          city2,
          chartData: comparisonSeries,
          average,
          growth,
          averageCity2,
          growthCity2,
          executiveConclusions: finalConclusions,
          presentation,
        });

        addBotMessage(
          `Comparativo generado (${city1} vs ${city2}, ${from}-${to}).\n` +
            finalConclusions.slice(0, 3).map((item, idx) => `${idx + 1}. ${item}`).join("\n")
        );
      }

      return true;
    } catch (error) {
      console.error("Error en flujo de agente:", error);
      addBotMessage("No pude completar el análisis con esos parámetros. Intenta de nuevo.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const runConsultorFlow = async ({ city1, from, to }) => {
    const city = cities.find((item) => item.name === city1);

    if (!city) {
      addBotMessage("Necesito una ciudad válida.");
      return false;
    }

    setLoading(true);

    try {
      const historyResponse = await axios.get(`${API_URL}/analytics/city-history`, {
        params: {
          cityId: city.id,
          from,
          to,
        },
      });

      const history = historyResponse?.data?.history || [];
      const average = computeAverage(history);
      const growth = computeGrowth(history);

      let aiInsights = [];
      let presentation = null;
      let usedAiPresentation = false;

      try {
        const response = await axios.post(`${API_URL}/presentation/generate`, {
          city: {
            name: city1,
            growth_percentage: Number(growth || 0).toFixed(2),
            average_price: Number(average || 0).toFixed(2),
          },
          from,
          to,
        });

        presentation = response.data;
        aiInsights = Array.isArray(response?.data?.insights)
          ? response.data.insights.filter(Boolean).slice(0, 3)
          : [];
        usedAiPresentation = aiInsights.length > 0 || (response?.data?.slides || []).length > 0;

        if (!aiInsights.length) {
          aiInsights = (response?.data?.slides || [])
            .map((slide) => slide.content)
            .filter(Boolean)
            .slice(0, 3);
        }
      } catch (error) {
        console.error("No fue posible generar presentación con IA:", error);
      }

      const finalInsights = aiInsights.length
        ? aiInsights
        : buildSingleCityInsights({ city: city1, growth, average, from, to });

      setAnalysisData({
        title: `Diapositiva IA: ${city1}`,
        city1,
        from,
        to,
        chartData: toSingleCitySeries(city1, history),
        average,
        growth,
        executiveConclusions: finalInsights,
        presentation,
      });

      addBotMessage(
        `${usedAiPresentation
          ? `La IA ha generado la diapositiva de ${city1} (${from}-${to}).`
          : `Generé la diapositiva de ${city1} (${from}-${to}) con insights base porque la IA no estuvo disponible.`}\n` +
          finalInsights.slice(0, 3).map((item, idx) => `${idx + 1}. ${item}`).join("\n")
      );

      return true;
    } catch (error) {
      console.error("Error en flujo de consultor:", error);
      addBotMessage("No pude completar la diapositiva con esos parámetros. Intenta de nuevo.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const promptForDates = () => {
    addBotMessage("Ahora escribe el rango de fechas. Ejemplo: 2021-2024");
  };

  const handleMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message) return;

    addUserMessage(message);

    if (isShowCitiesCommand(message)) {
      addBotMessage(`Ciudades disponibles:\n${formatCitiesList(cities)}`);

      if (context.stage === STAGES.AWAIT_CITY_1) {
        addBotMessage(
          agentType === "bi"
            ? 'Escribe la Ciudad 1 (nombre o número).'
            : 'Escribe una ciudad (nombre o número).'
        );
      } else if (context.stage === STAGES.AWAIT_CITY_2) {
        addBotMessage('Escribe la Ciudad 2 (nombre o número).');
      }

      return;
    }

    if (context.stage === STAGES.ERROR) {
      addBotMessage('El flujo está en error por falta de datos. Recarga la página.');
      return;
    }

    if (context.stage === STAGES.AWAIT_CITY_1) {
      const city = findCityFromMessage(message);
      if (!city) {
        addBotMessage(
          agentType === "bi"
            ? 'No reconocí esa ciudad. Escribe "ver ciudades" y luego indica Ciudad 1.'
            : 'No reconocí esa ciudad. Escribe "ver ciudades" y luego indica una ciudad.'
        );
        return;
      }

      if (agentType === "bi") {
        setContext((prev) => ({ ...prev, city1: city.name, stage: STAGES.AWAIT_CITY_2 }));
        addBotMessage(`Ciudad 1 seleccionada: ${city.name}. Ahora escribe la Ciudad 2.`);
        return;
      }

      setContext((prev) => ({ ...prev, city1: city.name, stage: STAGES.AWAIT_DATES }));
      addBotMessage(`Ciudad seleccionada: ${city.name}.`);
      promptForDates();
      return;
    }

    if (context.stage === STAGES.AWAIT_CITY_2) {
      const city = findCityFromMessage(message);
      if (!city) {
        addBotMessage('No reconocí esa ciudad. Escribe "ver ciudades" y luego indica Ciudad 2.');
        return;
      }

      if (city.name === context.city1) {
        addBotMessage('Ciudad 2 debe ser distinta a Ciudad 1. Escribe otra ciudad.');
        return;
      }

      setContext((prev) => ({ ...prev, city2: city.name, stage: STAGES.AWAIT_DATES }));
      addBotMessage(`Ciudad 2 seleccionada: ${city.name}.`);
      promptForDates();
      return;
    }

    if (context.stage === STAGES.AWAIT_DATES) {
      const range = parseYearRange(message);
      if (!range) {
        addBotMessage('Formato de fechas inválido. Ejemplo: 2021-2024');
        return;
      }

      setContext((prev) => ({ ...prev, from: range.from, to: range.to }));

      const success = agentType === "bi"
        ? await runBiFlow({
            city1: context.city1,
            city2: context.city2,
            from: range.from,
            to: range.to,
          })
        : await runConsultorFlow({
            city1: context.city1,
            from: range.from,
            to: range.to,
          });

      setContext((prev) => ({
        ...prev,
        city1: "",
        city2: "",
        from: range.from,
        to: range.to,
        stage: success ? STAGES.AWAIT_CITY_1 : STAGES.AWAIT_DATES,
      }));

      if (success) {
        addBotMessage(
          agentType === "bi"
            ? 'Puedes generar otro gráfico. Escribe "ver ciudades" o selecciona la Ciudad 1.'
            : 'Puedes generar otra diapositiva. Escribe "ver ciudades" o selecciona otra ciudad.'
        );
      }
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentInput = input;
    setInput("");
    await handleMessage(currentInput);
  };

  return (
    <div className="h-full rounded-2xl border border-gray-800 bg-[#15151a] p-5 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-2">
        {agentType === "bi" ? "Maestro BI" : "Consultor Inmobiliario"}
      </h2>

      <p className="text-lg text-white mb-4 leading-relaxed">
        {agentType === "bi"
          ? 'Maestro BI activo. Escribe "ver ciudades" Generar el Grafico'
          : 'Consultor Inmobiliario activo. Escribe "ver ciudades" para ver el catálogo.'}
      </p>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              m.sender === "user" ? "bg-black" : "bg-[#22222c] text-gray-200"
            }`}
          >
            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">{m.sender}</p>
            <p className="whitespace-pre-line">{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribe aquí..."
          disabled={loading}
          className="flex-1 bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-white text-black rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
