import React from "react";

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="M4 20V6l8-3 8 3v14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 10h2m-2 4h2m4-4h2m-2 4h2M10 20v-3h4v3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="M4 20h16M7 16V9m5 7V5m5 11v-4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function AgentSelector({ agentType, setAgentType }) {
  const buttonClass = (type) =>
    `px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
      agentType === type
        ? "bg-white text-black border-white"
        : "bg-transparent text-gray-200 border-gray-700 hover:border-gray-500"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={buttonClass("consultor")}
        onClick={() => setAgentType("consultor")}
      >
        <BuildingIcon />
        Consultor Inmobiliario
      </button>

      <button
        type="button"
        className={buttonClass("bi")}
        onClick={() => setAgentType("bi")}
      >
        <ChartIcon />
        Maestro BI
      </button>
    </div>
  );
}
