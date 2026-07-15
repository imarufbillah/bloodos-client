"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export function TrendChart({ data }: TrendChartProps) {
  // Format date labels for better readability
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-paper border border-slate rounded-lg p-6">
      <h3 className="font-heading text-lg font-semibold text-ink mb-4">
        Request Trend (30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.88 0.01 270)"
            opacity={0.5}
          />
          <XAxis
            dataKey="formattedDate"
            tick={{ fill: "oklch(0.3 0.02 270)", fontSize: 11 }}
            axisLine={{ stroke: "oklch(0.88 0.01 270)" }}
            interval="preserveStartEnd"
            minTickGap={30}
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
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => [`${value} requests`, "Count"]}
          />
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              color: "oklch(0.3 0.02 270)",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="oklch(0.55 0.22 20)"
            strokeWidth={2}
            dot={{ fill: "oklch(0.55 0.22 20)", r: 3 }}
            activeDot={{ r: 5 }}
            name="Daily Requests"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
