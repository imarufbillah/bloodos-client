"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BloodGroupChartProps {
  data: Array<{ bloodGroup: string; count: number }>;
}

export function BloodGroupChart({ data }: BloodGroupChartProps) {
  // Sort by count descending for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-paper border border-slate rounded-lg p-6">
      <h3 className="font-heading text-lg font-semibold text-ink mb-4">
        Requests by Blood Group
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.88 0.01 270)"
            opacity={0.5}
          />
          <XAxis
            dataKey="bloodGroup"
            tick={{ fill: "oklch(0.3 0.02 270)", fontSize: 12 }}
            axisLine={{ stroke: "oklch(0.88 0.01 270)" }}
          />
          <YAxis
            tick={{ fill: "oklch(0.3 0.02 270)", fontSize: 12 }}
            axisLine={{ stroke: "oklch(0.88 0.01 270)" }}
            label={{
              value: "Number of Requests",
              angle: -90,
              position: "insideLeft",
              style: { fill: "oklch(0.3 0.02 270)", fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.98 0.01 270)",
              border: "1px solid oklch(0.88 0.01 270)",
              borderRadius: "6px",
              fontSize: "13px",
            }}
            cursor={{ fill: "oklch(0.88 0.01 270)", opacity: 0.3 }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              color: "oklch(0.3 0.02 270)",
            }}
          />
          <Bar
            dataKey="count"
            fill="oklch(0.55 0.22 20)"
            name="Requests"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
