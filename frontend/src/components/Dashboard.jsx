import React from "react";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [city, setCity] = useState("Cancún");
  const [growth, setGrowth] = useState(0);
  const [average, setAverage] = useState(0);

  const [chatMode, setChatMode] = useState("agent");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // =============================
  // AUTO SCROLL
  // =============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =============================
  // CARGAR MÉTRICAS
  // =============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const growthRes = await api.get(
          `/analytics/growth?city=${encodeURIComponent(city)}`
        );
        const avgRes = await api.get(
          `/analytics/average?city=${encodeURIComponent(city)}`
        );

        setGrowth(growthRes.data.growth || 0);
        setAverage(avgRes.data.average || 0);
      } catch (error) {
        console.error("Error cargando métricas", error);
      }
    };

    fetchData();
  }, [city]);

  // =============================
  // SALUDO AUTOMÁTICO
  // =============================
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "Hola";

    if (hour < 12) greeting = "Buenos días";
    else if (hour < 19) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    setMessages([
      {
        sender: "bot",
        text: `${greeting}. Soy tu ${
          chatMode === "agent"
            ? "Consultor Inmobiliario"
            : "Analista Maestro"
        }. ¿Qué deseas analizar en ${city}?`
      }
    ]);
  }, [chatMode, city]);

  // =============================
  // RESET CONVERSACIÓN
  // =============================
  const resetConversation = () => {
    setMessages([]);
  };

  // =============================
  // ENVIAR MENSAJE (STREAMING)
  // =============================
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userText,
            mode: chatMode,
            city,
            growth,
            average,
            userId: "user1"
          })
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let botMessage = "";

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "" }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botMessage += chunk;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = botMessage;
          return updated;
        });
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error conectando con IA." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Real Estate Intelligence Dashboard
      </h1>

      {/* SELECT CIUDAD */}
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-[#1a1a22] p-2 rounded-lg"
        >
          <option>Cancún</option>
          <option>CDMX</option>
          <option>Monterrey</option>
          <option>Guadalajara</option>
        </select>

        <button
          onClick={resetConversation}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Reset Chat
        </button>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400 text-sm">Crecimiento</h2>
          <p className="text-3xl font-bold text-green-400">
            {growth}%
          </p>
        </div>

        <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400 text-sm">Precio Promedio</h2>
          <p className="text-3xl font-bold text-blue-400">
            ${average} USD/m²
          </p>
        </div>

      </div>

      {/* CHAT */}
      <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 h-[500px] flex flex-col">

        {/* BOTONES CAMBIO */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setChatMode("agent")}
            className={`px-4 py-2 rounded-lg ${
              chatMode === "agent"
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            Chat Agente
          </button>

          <button
            onClick={() => setChatMode("master")}
            className={`px-4 py-2 rounded-lg ${
              chatMode === "master"
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            Chat Maestro
          </button>
        </div>

        {/* MENSAJES */}
        <div className="flex-1 overflow-y-auto space-y-3 text-sm mb-4 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === "bot"
                  ? "bg-gray-800"
                  : "bg-blue-600 ml-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-800 p-3 rounded-lg w-fit">
              Escribiendo...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="flex gap-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-black p-3 rounded-lg"
            placeholder="Escribe tu pregunta..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 px-6 rounded-lg"
          >
            Enviar
          </button>
        </div>

      </div>

    </div>
  );
}