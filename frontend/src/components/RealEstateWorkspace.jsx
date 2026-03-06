import React from "react";
import axios from "axios";

export default function RealEstateWorkspace({ city }) {

  const generatePresentation = async () => {

    try {

      const res = await axios.post(
        "http://localhost:4000/api/real-estate/presentation",
        { city }
      );

      window.open(res.data.url);

    } catch (err) {

      console.error("presentation error", err);

    }

  };

  return (

    <div>

      <h2>Agente Inmobiliario</h2>

      <p>Ciudad seleccionada: {city}</p>

      <button onClick={generatePresentation}>
        Generar presentación PowerPoint
      </button>

    </div>

  );
}