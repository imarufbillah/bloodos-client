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
import { TrendingUp } from "lucide-react";

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
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal" />
          <span>Broadcast Trend (Past 30 Days)</span>
        </h3>
        <span className="font-mono text-[11px] text-muted-foreground">
          DAILY CADENCE
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/60"
            />
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground font-mono"
              axisLine={{ stroke: "currentColor" }}
              interval="preserveStartEnd"
              minTickGap={25}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground font-mono"
              axisLine={{ stroke: "currentColor" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value) => [`${value} requests`, "Broadcast Demand"]}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--crimson)"
              strokeWidth={2.5}
              dot={{ fill: "var(--crimson)", r: 3 }}
              activeDot={{ r: 5 }}
              name="Daily Broadcasts"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
