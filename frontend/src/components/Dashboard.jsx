import React, { useState, useEffect } from "react";
import ChatPanel from "../components/ChatPanel";
import Workspace from "../components/Workspace";
import AgentSelector from "../components/AgentSelector";

export default function Dashboard({ onLogout }) {

  const [agentType, setAgentType] = useState("consultor");
  const [analysisData, setAnalysisData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {

    try {

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.log("No hay usuario en localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

    } catch (error) {

      console.error("Error leyendo usuario:", error);

    }

  }, []);

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

          {/* USER MENU */}
          <div className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-gray-800 px-4 py-2 rounded-lg"
            >
              {user?.name || "Usuario"} ⌄
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a22] border border-gray-700 rounded-lg">

                <div className="px-4 py-3 text-sm border-b border-gray-700">
                  <p className="font-semibold">{user?.name || "Usuario"}</p>
                  <p className="text-gray-400 text-xs">{user?.role || "-"}</p>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-600"
                >
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