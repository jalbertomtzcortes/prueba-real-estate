import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentSelector({ onSelectAgent, selectedCity, setSelectedCity }) {

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {

        const res = await axios.get("http://localhost:4000/api/cities");

        if (Array.isArray(res.data)) {
          setCities(res.data);
        } else {
          setCities([]);
        }

      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  return (

    <div style={{ marginBottom: 20 }}>

      <h3>Seleccionar ciudad</h3>

      <select
        value={selectedCity || ""}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Selecciona ciudad</option>

        {cities?.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}

      </select>

      <div style={{ marginTop: 20 }}>

        <button onClick={() => onSelectAgent("bi")}>
          BI Dashboard
        </button>

        <button onClick={() => onSelectAgent("real_estate")}>
          Agente Inmobiliario
        </button>

      </div>

    </div>
  );
}
