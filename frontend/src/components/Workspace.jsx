import React from "react";
import { useState } from "react";
import AgentSelector from "./AgentSelector";
import BIWorkspace from "./BIWorkspace";
import RealEstateWorkspace from "./RealEstateWorkspace";

export default function Workspace() {

  const [agent, setAgent] = useState(null);
  const [city, setCity] = useState("");

  return (

    <div>

      <AgentSelector
        onSelectAgent={setAgent}
        selectedCity={city}
        setSelectedCity={setCity}
      />

      {agent === "bi" && <BIWorkspace city={city} />}

      {agent === "real_estate" && (
        <RealEstateWorkspace city={city} />
      )}

    </div>

  );
}