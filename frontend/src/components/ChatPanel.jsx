import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function ChatPanel({ agentType, setAnalysisData }) {

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [awaitingDates, setAwaitingDates] = useState(false);
  const messagesEndRef = useRef(null);

  // 🔥 Reiniciar flujo cuando cambia agente
  useEffect(() => {

    setSelectedCity(null);
    setAwaitingDates(false);
    setAnalysisData(null);

    if (agentType === "consultor") {
      setMessages([
        { sender: "bot", text: "🏢 Consultor Inmobiliario\n\nHola 👋 ¿Qué ciudad deseas analizar?\nEscribe 'ver ciudades'." }
      ]);
    } else {
      setMessages([
        { sender: "bot", text: "📊 Business Intelligence\n\nHola 👋 ¿Qué ciudad analítica deseas evaluar?\nEscribe 'ver ciudades'." }
      ]);
    }

  }, [agentType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setAwaitingDates(true);

    setMessages(prev => [
      ...prev,
      { sender: "user", text: city.name },
      { sender: "bot", text: "¿De qué año a qué año? Formato: 2023-2024" }
    ]);
  };

  const handleDateResponse = async (text) => {

    const match = text.match(/^(\d{4})-(\d{4})$/);

    if (!match) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "No conozco lo que me estás preguntando.\nUsa formato 2023-2024" }
      ]);
      return;
    }

    const from = match[1];
    const to = match[2];

    const growthRes = await api.get(
      `/analytics/growth?cityId=${selectedCity.id}&from=${from}&to=${to}`
    );

    const avgRes = await api.get(
      `/analytics/average?cityId=${selectedCity.id}&from=${from}&to=${to}`
    );

    const result = {
      city: selectedCity.name,
      from,
      to,
      growth: growthRes.data.growth,
      average: avgRes.data.average,
    };

    setAnalysisData(result);

    if (agentType === "consultor") {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `📍 ${result.city}\n\nAnálisis estratégico listo.\nPuedes generar el PPT ejecutivo.`
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `📊 ${result.city}\n\nAnálisis BI listo.\nVisualiza la gráfica en el panel izquierdo.`
        }
      ]);
    }

    setAwaitingDates(false);
  };

  const sendMessage = async () => {

    if (!inputMessage.trim()) return;

    const text = inputMessage;
    setInputMessage("");

    setMessages(prev => [...prev, { sender: "user", text }]);

    if (awaitingDates) {
      handleDateResponse(text);
      return;
    }

    if (text.toLowerCase() === "ver ciudades") {
      const res = await api.get("/cities");
      setMessages(prev => [
        ...prev,
        ...res.data.map(city => ({
          sender: "bot-city",
          cityData: city
        }))
      ]);
      return;
    }

    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "No conozco lo que me estás preguntando.\nEscribe 'ver ciudades'." }
    ]);
  };

  return (
    <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 h-full flex flex-col">

      <div className="flex-1 overflow-y-auto space-y-3 text-sm mb-4 pr-2">
        {messages.map((msg, i) => {

          if (msg.sender === "user") {
            return (
              <div key={i} className="p-3 rounded-lg bg-blue-600 ml-auto max-w-[80%]">
                {msg.text}
              </div>
            );
          }

          if (msg.sender === "bot-city") {
            return (
              <button
                key={i}
                onClick={() => handleCityClick(msg.cityData)}
                className="block text-left p-3 bg-gray-800 rounded-lg hover:bg-green-600"
              >
                {msg.cityData.name}
              </button>
            );
          }

          return (
            <div key={i} className="p-3 rounded-lg bg-gray-800 whitespace-pre-line">
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
          className="flex-1 bg-black p-3 rounded-lg"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-6 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}