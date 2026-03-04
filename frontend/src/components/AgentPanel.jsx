import React from "react";
export default function AgentPanel({ city, growth, average }) {
  if (!city) {
    return (
      <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800">
        Esperando selección de ciudad...
      </div>
    );
  }

  return (
    <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800 h-full">
      <h3 className="text-lg font-semibold mb-4">
        Consultor Inmobiliario
      </h3>

      <div className="space-y-4 text-sm">
        <div className="bg-black p-3 rounded-lg">
          ¿Cómo se comporta {city}?
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          El precio promedio actual es de ${average?.toFixed(2)} USD/m².
          La ciudad presenta un crecimiento acumulado del {growth?.toFixed(2)}%.
        </div>

        <div className="bg-black p-3 rounded-lg">
          Recomendación estratégica
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          {growth > 20
            ? "Mercado en expansión acelerada. Perfil premium."
            : "Mercado estable. Ideal para inversión conservadora."}
        </div>
      </div>
    </div>
  );
}
