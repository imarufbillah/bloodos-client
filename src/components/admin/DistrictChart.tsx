/**
 * District Distribution Chart
 * PieChart showing request distribution by district (top 10) (Req 18.6)
 * Styled with BloodOS palette tokens
 */

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DistrictChartProps {
  data: Array<{ district: string; count: number }>;
}

// Color palette using BloodOS tokens for visual distinction
const COLORS = [
  "oklch(0.55 0.22 20)", // crimson
  "oklch(0.52 0.14 195)", // teal
  "oklch(0.58 0.12 75)", // ochre
  "oklch(0.65 0.02 270)", // slate-light
  "oklch(0.45 0.2 20)", // crimson-dark
  "oklch(0.42 0.12 195)", // teal-dark
  "oklch(0.48 0.1 75)", // ochre-dark
  "oklch(0.55 0.02 270)", // slate-medium
  "oklch(0.35 0.15 20)", // crimson-darker
  "oklch(0.32 0.1 195)", // teal-darker
];

export function DistrictChart({ data }: DistrictChartProps) {
  // Take top 10 districts by count (Req 18.6)
  const topDistricts = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate total for percentage
  const total = topDistricts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-paper border border-slate rounded-lg p-6">
      <h3 className="font-heading text-lg font-semibold text-ink mb-4">
        Requests by District (Top 10)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={topDistricts}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => {
              const { district, count } = props as unknown as { district: string; count: number };
              return `${district}: ${((count / total) * 100).toFixed(1)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {topDistricts.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.98 0.01 270)",
              border: "1px solid oklch(0.88 0.01 270)",
              borderRadius: "6px",
              fontSize: "13px",
            }}
            formatter={(value) => [
              `${value} requests (${(((value as number) / total) * 100).toFixed(1)}%)`,
              "Count",
            ]}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: "oklch(0.3 0.02 270)",
            }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
