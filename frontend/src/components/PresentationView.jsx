import React from "react";

export default function PresentationView({ presentation }) {

  if (!presentation) return null;

  return (
    <div className="bg-[#15151a] p-8 rounded-2xl border border-gray-800 mt-8">

      <h2 className="text-xl font-bold mb-6">
        Presentación para Cliente
      </h2>

      {presentation.slides.map((slide, index) => (
        <div key={index} className="mb-6">

          <h3 className="text-lg font-semibold mb-2">
            {slide.title}
          </h3>

          <p className="text-gray-300">
            {slide.content}
          </p>

        </div>
      ))}

    </div>
  );
}