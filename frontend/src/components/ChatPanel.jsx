import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPanel({ setAnalysisData }) {

  const [cities, setCities] = useState([]);
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {

    axios.get("http://localhost:4000/api/cities")
      .then(res => {
        setCities(res.data);
      })
      .catch(err => console.error(err));

  }, []);

  useEffect(() => {

    if (!city1 || !city2 || !from || !to) return;

    axios.get("http://localhost:4000/api/analytics/compare", {
      params: {
        city1,
        city2,
        from,
        to
      }
    })
      .then(res => {
        setAnalysisData(res.data);
      })
      .catch(err => console.error(err));

  }, [city1, city2, from, to]);

  return (

    <div className="space-y-4">

      <h3 className="text-lg font-bold">
        Comparar ciudades
      </h3>

      <select
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setCity1(e.target.value)}
      >
        <option>Selecciona ciudad 1</option>

        {cities.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}

      </select>

      <select
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setCity2(e.target.value)}
      >
        <option>Selecciona ciudad 2</option>

        {cities.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}

      </select>

      <input
        className="w-full p-2 bg-gray-800 rounded"
        placeholder="Año inicio (ej: 2021)"
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        className="w-full p-2 bg-gray-800 rounded"
        placeholder="Año fin (ej: 2024)"
        onChange={(e) => setTo(e.target.value)}
      />

    </div>

  );

}