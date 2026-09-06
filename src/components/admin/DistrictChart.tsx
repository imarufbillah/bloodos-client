"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { MapPin } from "lucide-react";

interface DistrictChartProps {
  data: Array<{ district: string; count: number }>;
}

// Theme-consistent color palette matching BloodOS system tokens in globals.css
const COLORS = [
  "var(--crimson)",
  "var(--teal)",
  "var(--ochre)",
  "var(--slate)",
  "var(--primary)",
  "var(--secondary)",
  "var(--muted-foreground)",
  "var(--ring)",
  "var(--foreground)",
  "var(--accent-foreground)",
];

export function DistrictChart({ data }: DistrictChartProps) {
  // Take top 10 districts by count (Req 18.6)
  const topDistricts = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

  // Calculate total for percentage
  const total = topDistricts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-ochre" />
          <span>Regional Distribution (Top 10 Districts)</span>
        </h3>
        <span className="font-mono text-[11px] text-muted-foreground">
          {total} BROADCASTS
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topDistricts}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
              nameKey="district"
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
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              formatter={(value) => [
                `${value} requests (${(((value as number) / (total || 1)) * 100).toFixed(1)}%)`,
                "Broadcast Volume",
              ]}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                paddingTop: "6px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
