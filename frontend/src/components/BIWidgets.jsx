import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function BIWidgets({ data }) {
  return (
    <div className="grid grid-cols-1 gap-8">

      <div className="bg-[#15151a] p-6 rounded-2xl border border-gray-800">
        <h3 className="mb-4 font-bold">Evolución de Precios</h3>

        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_price" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}