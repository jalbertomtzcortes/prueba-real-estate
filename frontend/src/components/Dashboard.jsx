import React, { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import Workspace from "../components/Workspace";
import AgentSelector from "../components/AgentSelector";

export default function Dashboard() {
  const [agentType, setAgentType] = useState("consultor");
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="h-screen bg-[#0f0f14] text-white flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Real Estate Intelligence
        </h1>

        <AgentSelector
          agentType={agentType}
          setAgentType={setAgentType}
        />
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT WORKSPACE */}
        <div className="w-1/2 border-r border-gray-800 overflow-y-auto p-6">
          <Workspace
            agentType={agentType}
            data={analysisData}
          />
        </div>

        {/* RIGHT CHAT */}
        <div className="w-1/2 p-6">
          <ChatPanel
            agentType={agentType}
            setAnalysisData={setAnalysisData}
          />
        </div>

      </div>
    </div>
  );
}