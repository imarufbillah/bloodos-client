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

// Calibrated OKLCH color palette matching BloodOS system tokens
const COLORS = [
  "oklch(0.55 0.22 25)", // crimson
  "oklch(0.52 0.14 175)", // teal
  "oklch(0.65 0.15 75)", // ochre
  "oklch(0.45 0.18 25)", // crimson dark
  "oklch(0.42 0.12 175)", // teal dark
  "oklch(0.55 0.12 75)", // ochre dark
  "oklch(0.60 0.08 260)", // slate
  "oklch(0.35 0.14 25)", // crimson deep
  "oklch(0.32 0.10 175)", // teal deep
  "oklch(0.50 0.05 260)", // muted slate
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
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border, #e5e7eb)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--color-foreground, #000000)",
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
