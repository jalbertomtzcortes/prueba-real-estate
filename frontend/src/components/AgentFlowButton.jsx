import React from "react";

export default function AgentFlowButton({ onGenerate }) {
  return (
    <div className="mt-6">
      <button
        onClick={onGenerate}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
      >
        Generar presentación para cliente
      </button>
    </div>
  );
}