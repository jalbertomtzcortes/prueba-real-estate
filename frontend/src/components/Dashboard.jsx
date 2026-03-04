import React from "react";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [city, setCity] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [average, setAverage] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // =============================
  // FIX ENCODING VISUAL
  // =============================
  const fixEncoding = (text) => {
    try {
      return decodeURIComponent(escape(text));
    } catch {
      return text;
    }
  };

  // =============================
  // AUTO SCROLL
  // =============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =============================
  // SALUDO INICIAL
  // =============================
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Hola 👋 ¿Qué ciudad deseas analizar? Escribe 'ver ciudades' para mostrar opciones."
      }
    ]);
  }, []);

  // =============================
  // CARGAR MÉTRICAS CUANDO HAY CIUDAD
  // =============================
  useEffect(() => {
    if (!city) return;

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

        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: `📍 ${city}

Crecimiento: ${growthRes.data.growth || 0}%
Precio promedio: $${avgRes.data.average || 0} USD/m²`
          }
        ]);
      } catch (error) {
        console.error("Error cargando métricas", error);
      }
    };

    fetchData();
  }, [city]);

  // =============================
  // ENVIAR MENSAJE
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
      const response = await api.post("/chat", {
        message: userText
      });

      const data = response.data;

      // Mensaje principal
      if (data.reply) {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: data.reply }
        ]);
      }

      // 🔥 Mostrar ciudades como párrafos individuales
      if (data.cities && data.cities.length > 0) {
        setMessages(prev => [
          ...prev,
          ...data.cities.map(cityName => ({
            sender: "bot-city",
            text: fixEncoding(cityName)
          }))
        ]);
      }

      // Si el usuario escribió una ciudad válida
      if (!data.cities && userText) {
        setCity(userText);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error conectando con servidor." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Real Estate Intelligence
      </h1>

      {/* CHAT */}
      <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 h-[600px] flex flex-col">

        {/* MENSAJES */}
        <div className="flex-1 overflow-y-auto space-y-3 text-sm mb-4 pr-2">

          {messages.map((msg, i) => {

            // Usuario
            if (msg.sender === "user") {
              return (
                <div
                  key={i}
                  className="p-3 rounded-lg max-w-[80%] bg-blue-600 ml-auto"
                >
                  {msg.text}
                </div>
              );
            }

            // Ciudades listadas
            if (msg.sender === "bot-city") {
              return (
                <p
                  key={i}
                  className="p-3 rounded-lg max-w-[80%] bg-gray-800"
                >
                  {msg.text}
                </p>
              );
            }

            // Bot normal
            return (
              <div
                key={i}
                className="p-3 rounded-lg max-w-[80%] bg-gray-800"
              >
                {msg.text}
              </div>
            );
          })}

          {loading && (
            <div className="p-3 rounded-lg max-w-[80%] bg-gray-800">
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
    </div>
  );
}