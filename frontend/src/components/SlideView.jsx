import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function SlideView({ title, growth, average, history }) {
  return (
    <div className="bg-[#15151a] p-8 rounded-2xl border border-gray-800">

      <h2 className="text-xl font-bold mb-6">{title}</h2>

      {/* Datos clave */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Crecimiento</p>
          <p className="text-2xl font-bold text-green-500">
            {growth?.toFixed(2)}%
          </p>
        </div>

        <div className="bg-black p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Precio Promedio</p>
          <p className="text-2xl font-bold">
            ${average?.toFixed(0)} USD/m²
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avg_price" stroke="#00ff99" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conclusión ejecutiva */}
      <div className="mt-8 bg-black p-6 rounded-xl">
        <h3 className="font-bold mb-2">Conclusión Ejecutiva</h3>
        <p className="text-gray-400">
          El mercado muestra un crecimiento sostenido del {growth?.toFixed(2)}%.
          El precio promedio se posiciona en ${average?.toFixed(0)} USD/m²,
          reflejando estabilidad y potencial de inversión.
        </p>
      </div>

    </div>
  );
}