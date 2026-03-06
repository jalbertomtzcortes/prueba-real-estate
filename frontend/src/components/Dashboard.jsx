import React, { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import Workspace from "../components/Workspace";
import AgentSelector from "../components/AgentSelector";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="M12 3 5 6v6c0 4.4 3 7.8 7 9 4-1.2 7-4.6 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
    <path d="M15 8l4 4-4 4M19 12H9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function Dashboard({ onLogout }) {
  const [agentType, setAgentType] = useState("consultor");
  const [analysisData, setAnalysisData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error leyendo usuario:", error);
      return null;
    }
  });

  return (

    <div className="h-screen bg-[#0f0f14] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Real Estate Intelligence
        </h1>

        <div className="flex items-center gap-6">

          <AgentSelector
            agentType={agentType}
            setAgentType={setAgentType}
          />

          <div className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <UserIcon />
              {user?.name || "Usuario"} ⌄
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a22] border border-gray-700 rounded-lg">

                <div className="px-4 py-3 text-sm border-b border-gray-700">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <ShieldIcon />
                    {user?.role || "Administrador"}
                  </p>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-600 flex items-center gap-2"
                >
                  <LogoutIcon />
                  Cerrar sesión
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        <div className="w-1/2 border-r border-gray-800 overflow-y-auto p-6">
          <Workspace agentType={agentType} data={analysisData} />
        </div>

        <div className="w-1/2 p-6">
          <ChatPanel
            key={agentType}
            agentType={agentType}
            setAnalysisData={setAnalysisData}
          />
        </div>

      </div>

    </div>

  );
}
