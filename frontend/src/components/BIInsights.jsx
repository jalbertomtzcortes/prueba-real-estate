import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function colorForValue(value, min, max) {
  if (value == null || Number.isNaN(value)) return "rgba(55,65,81,0.25)";
  if (max <= min) return "rgba(16,185,129,0.5)";
  const ratio = (value - min) / (max - min);
  const alpha = 0.2 + ratio * 0.8;
  return `rgba(16,185,129,${alpha.toFixed(2)})`;
}

export default function BIInsights({ data }) {
  const [sortKey, setSortKey] = useState("avg_price");
  const [sortDirection, setSortDirection] = useState("desc");
  const [heatmapCity, setHeatmapCity] = useState(data?.city1 || "");
  const [tableCityFilter, setTableCityFilter] = useState("all");
  const [topN, setTopN] = useState(25);

  const zoneRows = useMemo(() => data?.zoneRows || [], [data?.zoneRows]);
  const comparisonSeries = useMemo(
    () => data?.comparisonSeries || [],
    [data?.comparisonSeries]
  );

  const sortedRows = useMemo(() => {
    const rows =
      tableCityFilter === "all"
        ? [...zoneRows]
        : zoneRows.filter((row) => row.city === tableCityFilter);

    rows.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (typeof left === "string") {
        return sortDirection === "asc"
          ? left.localeCompare(right)
          : right.localeCompare(left);
      }
      return sortDirection === "asc" ? left - right : right - left;
    });
    return rows.slice(0, Number(topN) || 25);
  }, [zoneRows, sortKey, sortDirection, topN, tableCityFilter]);

  const topZonesByCity = useMemo(() => {
    const rows = zoneRows.filter((row) => row.city === heatmapCity);
    const aggregates = new Map();
    rows.forEach((row) => {
      const current = aggregates.get(row.zone) || { total: 0, count: 0 };
      current.total += row.avg_price;
      current.count += 1;
      aggregates.set(row.zone, current);
    });

    return Array.from(aggregates.entries())
      .map(([zone, value]) => ({
        zone,
        avg: value.count ? value.total / value.count : 0
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, Number(topN) || 25)
      .map((row) => row.zone);
  }, [zoneRows, heatmapCity, topN]);

  const heatmapData = useMemo(() => {
    const rows = zoneRows.filter((row) => row.city === heatmapCity);
    const years = Array.from(new Set(rows.map((row) => row.year))).sort(
      (a, b) => a - b
    );
    const zones = Array.from(new Set(rows.map((row) => row.zone))).filter((zone) =>
      topZonesByCity.includes(zone)
    );
    const values = rows.map((row) => row.avg_price);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;

    const matrix = zones.map((zone) => ({
      zone,
      cells: years.map((year) => {
        const match = rows.find(
          (row) => row.zone === zone && row.year === year
        );
        return match ? match.avg_price : null;
      })
    }));

    return { years, zones, matrix, min, max };
  }, [zoneRows, heatmapCity, topZonesByCity]);

  const exportTableCsv = () => {
    const headers = ["city", "zone", "year", "avg_price"];
    const lines = sortedRows.map((row) =>
      [row.city, row.zone, row.year, row.avg_price.toFixed(2)]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bi_table_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full rounded-2xl border border-gray-800 bg-[#15151a] p-6 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Maestro BI</h2>
        <p className="text-sm text-gray-400">
          Vista: {data?.viewType || "comparativo"} | {data?.city1} vs {data?.city2}
        </p>
      </div>

      {data?.viewType === "comparativo" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-xs text-gray-400">Promedio {data?.city1}</p>
              <p className="text-xl font-semibold">
                {Number(data?.average || 0).toFixed(2)} USD/m2
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <p className="text-xs text-gray-400">Promedio {data?.city2}</p>
              <p className="text-xl font-semibold">
                {Number(data?.averageCity2 || 0).toFixed(2)} USD/m2
              </p>
            </div>
          </div>

          <div className="h-80 bg-black/30 rounded-lg p-4">
            <ResponsiveContainer>
              <LineChart data={comparisonSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey={data?.city1} stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey={data?.city2} stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data?.viewType === "heatmap" && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center flex-wrap">
            {[data?.city1, data?.city2].filter(Boolean).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setHeatmapCity(city)}
                className={`px-3 py-1 rounded-md border ${
                  heatmapCity === city
                    ? "bg-white text-black border-white"
                    : "border-gray-700 text-gray-300"
                }`}
              >
                {city}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-400">Top zonas</span>
              <input
                type="number"
                min="5"
                max="100"
                value={topN}
                onChange={(event) => setTopN(Number(event.target.value))}
                className="w-20 bg-[#0f0f14] border border-gray-700 rounded-lg px-2 py-1"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-gray-700">Zona</th>
                  {heatmapData.years.map((year) => (
                    <th key={year} className="text-left p-2 border-b border-gray-700">
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.matrix.map((row) => (
                  <tr key={row.zone}>
                    <td className="p-2 border-b border-gray-800">{row.zone}</td>
                    {row.cells.map((value, idx) => (
                      <td
                        key={`${row.zone}-${heatmapData.years[idx]}`}
                        className="p-2 border-b border-gray-800"
                        style={{
                          backgroundColor: colorForValue(
                            value,
                            heatmapData.min,
                            heatmapData.max
                          )
                        }}
                      >
                        {value == null ? "-" : value.toFixed(0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.viewType === "table" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <select
              value={tableCityFilter}
              onChange={(event) => setTableCityFilter(event.target.value)}
              className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="all">Todas las ciudades</option>
              {[data?.city1, data?.city2].filter(Boolean).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="avg_price">Precio</option>
              <option value="year">Año</option>
              <option value="city">Ciudad</option>
              <option value="zone">Zona</option>
            </select>
            <select
              value={sortDirection}
              onChange={(event) => setSortDirection(event.target.value)}
              className="bg-[#0f0f14] border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Top N</span>
              <input
                type="number"
                min="5"
                max="200"
                value={topN}
                onChange={(event) => setTopN(Number(event.target.value))}
                className="w-20 bg-[#0f0f14] border border-gray-700 rounded-lg px-2 py-1"
              />
            </div>
            <button
              type="button"
              onClick={exportTableCsv}
              className="ml-auto bg-white text-black px-3 py-2 rounded-lg font-medium"
            >
              Exportar CSV
            </button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto border border-gray-800 rounded-lg">
            <table className="min-w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-[#111118]">
                <tr>
                  <th className="text-left p-2 border-b border-gray-700">Ciudad</th>
                  <th className="text-left p-2 border-b border-gray-700">Zona</th>
                  <th className="text-left p-2 border-b border-gray-700">Año</th>
                  <th className="text-left p-2 border-b border-gray-700">Precio promedio</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr key={`${row.city_id}-${row.zone_id}-${row.year}`}>
                    <td className="p-2 border-b border-gray-800">{row.city}</td>
                    <td className="p-2 border-b border-gray-800">{row.zone}</td>
                    <td className="p-2 border-b border-gray-800">{row.year}</td>
                    <td className="p-2 border-b border-gray-800">
                      {row.avg_price.toFixed(2)} USD/m2
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
