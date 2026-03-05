import React from "react";
import BIWidgets from "./BIWidgets";

export default function Workspace({ data }) {

  if (!data) {
    return (
      <div className="text-gray-400">
        Esperando análisis...
      </div>
    );
  }

  return <BIWidgets data={data} />;

}