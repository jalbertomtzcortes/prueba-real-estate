import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function ChatPanel({ agentType, setAnalysisData }) {

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [selectedCities, setSelectedCities] = useState([]);
  const [awaitingDates, setAwaitingDates] = useState(false);

  const messagesEndRef = useRef(null);

  const allowedCommands = ["ver ciudades"];

  // 🔹 Reiniciar flujo cuando cambia agente
  useEffect(() => {

    setSelectedCities([]);
    setAwaitingDates(false);
    setAnalysisData(null);

    if (agentType === "consultor") {
      setMessages([
        {
          sender: "bot",
          text: "🏢 Consultor\n\n¿Qué ciudad deseas analizar?\nEscribe 'ver ciudades'."
        }
      ]);
    } else {
      setMessages([
        {
          sender: "bot",
          text: "📊 Business Intelligence\n\nSelecciona DOS ciudades para comparar.\nEscribe 'ver ciudades'."
        }
      ]);
    }

  }, [agentType]);

  // 🔹 Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Seleccionar ciudad
  const handleCityClick = (city) => {

    if (agentType === "consultor") {

      setSelectedCities([city]);
      setAwaitingDates(true);

      setMessages(prev => [
        ...prev,
        { sender: "user", text: city.name },
        { sender: "bot", text: "¿Escriba el periodo? Formato 2023-2024" }
      ]);

      return;
    }

    // BI permite 2 ciudades
    if (selectedCities.length >= 2) return;

    const updated = [...selectedCities, city];
    setSelectedCities(updated);

    setMessages(prev => [
      ...prev,
      { sender: "user", text: city.name }
    ]);

    if (updated.length === 2) {

      setAwaitingDates(true);

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Ingresa periodo 2023-2024" }
      ]);
    }
  };

  // 🔹 Procesar fechas
  const handleDateResponse = async (text) => {

    const match = text.match(/^(\d{4})-(\d{4})$/);

    if (!match) {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Formato inválido. Usa 2023-2024" }
      ]);

      return;
    }

    const from = match[1];
    const to = match[2];

    try {

      // 🔥 CONSULTOR
      if (agentType === "consultor") {

        const city = selectedCities[0];

        const growth = await api.get(`/analytics/growth?cityId=${city.id}&from=${from}&to=${to}`);
        const avg = await api.get(`/analytics/average?cityId=${city.id}&from=${from}&to=${to}`);

        setAnalysisData({
          mode: "single",
          city: city.name,
          from,
          to,
          growth: growth.data.growth,
          average: avg.data.average
        });

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Análisis estratégico listo." }
        ]);
      }

      // 🔥 BI COMPARATIVO
      if (agentType === "bi") {

        const cityA = selectedCities[0];
        const cityB = selectedCities[1];

        const growthA = await api.get(`/analytics/growth?cityId=${cityA.id}&from=${from}&to=${to}`);
        const avgA = await api.get(`/analytics/average?cityId=${cityA.id}&from=${from}&to=${to}`);

        const growthB = await api.get(`/analytics/growth?cityId=${cityB.id}&from=${from}&to=${to}`);
        const avgB = await api.get(`/analytics/average?cityId=${cityB.id}&from=${from}&to=${to}`);

        setAnalysisData({
          mode: "compare",
          from,
          to,
          cityA: {
            name: cityA.name,
            growth: growthA.data.growth,
            average: avgA.data.average
          },
          cityB: {
            name: cityB.name,
            growth: growthB.data.growth,
            average: avgB.data.average
          }
        });

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Comparativo listo. Visualiza la gráfica." }
        ]);
      }

      setAwaitingDates(false);

    } catch (err) {

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error obteniendo análisis." }
      ]);

      console.error(err);
    }
  };

  // 🔹 Enviar mensaje
  const sendMessage = async () => {

    if (!inputMessage.trim()) return;

    const text = inputMessage;
    const textLower = text.toLowerCase();

    setInputMessage("");

    setMessages(prev => [
      ...prev,
      { sender: "user", text }
    ]);

    if (awaitingDates) {
      handleDateResponse(text);
      return;
    }

    if (textLower === "ver ciudades") {

      try {

        const res = await api.get("/cities");

        setMessages(prev => [
          ...prev,
          ...res.data.map(city => ({
            sender: "bot-city",
            cityData: city
          }))
        ]);

      } catch {

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "No se pudieron cargar las ciudades." }
        ]);
      }

      return;
    }

    // 🔹 comando desconocido
    if (!allowedCommands.includes(textLower)) {

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "No conozco ese comando.\n\nEscribe 'ver ciudades'."
        }
      ]);

      return;
    }
  };

  return (

    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">

        {messages.map((msg, i) => {

          if (msg.sender === "user")
            return (
              <div key={i} className="bg-blue-600 p-3 rounded">
                {msg.text}
              </div>
            );

          if (msg.sender === "bot-city")
            return (
              <button
                key={i}
                onClick={() => handleCityClick(msg.cityData)}
                className="bg-gray-700 p-3 rounded w-full text-left"
              >
                {msg.cityData.name}
              </button>
            );

          return (
            <div key={i} className="bg-gray-800 p-3 rounded">
              {msg.text}
            </div>
          );

        })}

        <div ref={messagesEndRef} />

      </div>

      <div className="flex gap-2">

        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-black p-3 rounded"
          placeholder="Escribe un mensaje..."
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 px-4 rounded"
        >
          Enviar
        </button>

      </div>

    </div>

  );
}