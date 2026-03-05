import React from "react";

export default function AgentSelector({ agentType, setAgentType }) {
  return (
    <div className="flex gap-3">

      <button
        onClick={() => setAgentType("consultor")}
        className={`px-4 py-2 rounded-lg ${
          agentType === "consultor"
            ? "bg-green-600"
            : "bg-gray-800"
        }`}
      >
        🏢 Consultor Inmobiliario
      </button>

      <button
        onClick={() => setAgentType("bi")}
        className={`px-4 py-2 rounded-lg ${
          agentType === "bi"
            ? "bg-green-600"
            : "bg-gray-800"
        }`}
      >
        📊 Business Intelligence
      </button>

    </div>
  );
}