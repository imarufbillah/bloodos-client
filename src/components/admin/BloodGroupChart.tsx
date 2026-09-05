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
import { Droplet } from "lucide-react";

interface BloodGroupChartProps {
  data: Array<{ bloodGroup: string; count: number }>;
}

export function BloodGroupChart({ data }: BloodGroupChartProps) {
  // Sort by count descending for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Droplet className="h-4 w-4 text-crimson fill-crimson" />
          <span>Demand by Blood Group (ABO/Rh)</span>
        </h3>
        <span className="font-mono text-[11px] text-muted-foreground">
          8 GROUPS
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/60"
            />
            <XAxis
              dataKey="bloodGroup"
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground font-mono"
              axisLine={{ stroke: "currentColor" }}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-muted-foreground font-mono"
              axisLine={{ stroke: "currentColor" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border, #e5e7eb)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--color-foreground, #000000)",
              }}
              cursor={{ fill: "currentColor", className: "text-muted/30" }}
              formatter={(value) => [`${value} requests`, "Broadcast Demand"]}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "6px",
              }}
            />
            <Bar
              dataKey="count"
              fill="oklch(0.55 0.22 25)"
              name="Active Broadcasts"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
