import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function ChatPanel({ setAnalysisData }) {

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);
  const [awaitingDates, setAwaitingDates] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔹 Mensaje inicial
  useEffect(() => {
    resetToInitial();
  }, []);

  const resetToInitial = () => {
    setMessages([
      {
        sender: "bot",
        text:
          "Hola 👋 ¿Qué ciudad deseas analizar?\nEscribe 'ver ciudades' para mostrar opciones.",
      },
    ]);
    setSelectedCity(null);
    setAwaitingDates(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCityClick = (city) => {
    setSelectedCity(city);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: city.name },
      {
        sender: "bot",
        text: `Seleccionaste ${city.name}.\n¿De qué año a qué año?\nFormato: 2023-2024`,
      },
    ]);

    setAwaitingDates(true);
  };

  const handleDateResponse = async (text) => {

    const match = text.match(/^(\d{4})-(\d{4})$/);

    if (!match) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "No conozco lo que me estás preguntando 🤔\n\nPor favor usa el formato correcto:\n2023-2024",
        },
      ]);
      return;
    }

    const from = match[1];
    const to = match[2];

    try {
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

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `📍 ${selectedCity.name}

Periodo: ${from} a ${to}

📈 Crecimiento: ${result.growth}%
💰 Precio promedio: $${result.average} USD/m²`,
        },
      ]);

    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error obteniendo datos." },
      ]);
    }

    setAwaitingDates(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim().toLowerCase();

    setMessages((prev) => [...prev, { sender: "user", text: inputMessage }]);
    setInputMessage("");

    // 🔹 Si está esperando fechas
    if (awaitingDates) {
      handleDateResponse(userText);
      return;
    }

    // 🔹 Usuario pide ver ciudades
    if (userText === "ver ciudades") {

      setLoading(true);

      try {
        const response = await api.get("/cities");

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Selecciona una ciudad:" },
          ...response.data.map((city) => ({
            sender: "bot-city",
            cityData: city,
          })),
        ]);

      } catch {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error obteniendo ciudades." },
        ]);
      }

      setLoading(false);
      return;
    }

    // 🔹 Usuario escribe saludo u otra cosa
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "No conozco lo que me estás preguntando 🤔\n\nHola 👋 ¿Qué ciudad deseas analizar?\nEscribe 'ver ciudades' para mostrar opciones.",
      },
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
            const city = msg.cityData;

            return (
              <button
                key={i}
                onClick={() => handleCityClick(city)}
                className="block text-left p-3 bg-gray-800 rounded-lg hover:bg-green-600"
              >
                {city.name}
              </button>
            );
          }

          return (
            <div key={i} className="p-3 rounded-lg bg-gray-800 whitespace-pre-line">
              {msg.text}
            </div>
          );
        })}

        {loading && (
          <div className="p-3 rounded-lg bg-gray-800">
            Escribiendo...
          </div>
        )}

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