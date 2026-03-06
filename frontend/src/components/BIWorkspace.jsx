import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import BIWidgets from "./BIWidgets";

export default function BIWorkspace({ city }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!city) return;

    const loadData = async () => {

      try {

        const res = await axios.post(
          "http://localhost:4000/api/analysis/compare-cities",
          {
            city
          }
        );

        setData(res.data);

      } catch (err) {

        console.error("BI error:", err);
        setData([]);

      }

    };

    loadData();

  }, [city]);

  return (

    <div>

      <h2>Dashboard BI</h2>

      <BIWidgets data={data} />

    </div>

  );
}