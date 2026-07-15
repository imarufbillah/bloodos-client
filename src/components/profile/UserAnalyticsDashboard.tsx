"use client";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Heart, Users, Trophy, Target } from "lucide-react";

export interface UserAnalytics {
  totalRequests: number;
  requestsByStatus: Record<string, number>;
  fulfillmentRate: number;
  responsesReceived: number;
  totalResponses: number;
  responsesByStatus: Record<string, number>;
  responseSuccessRate: number;
  totalDonations: number;
  verifiedDonations: number;
  livesSaved: number;
  activityTimeline: Array<{ month: number; year: number; count: number }>;
  impact: {
    requestsCreated: number;
    requestsFulfilled: number;
    responsesGiven: number;
    donationsCompleted: number;
    livesSaved: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  open: "oklch(0.65 0.17 175)",
  in_progress: "oklch(0.75 0.15 75)",
  fulfilled: "oklch(0.65 0.17 175)",
  cancelled: "oklch(0.55 0.02 270)",
  expired: "oklch(0.65 0.05 270)",
};

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-crimson/30 bg-crimson/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            highlight ? "bg-crimson/10 text-crimson" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-data">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function UserAnalyticsDashboard({ analytics }: { analytics: UserAnalytics }) {
  const statusData = Object.entries(analytics.requestsByStatus).map(
    ([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
    })
  );

  const timelineData = analytics.activityTimeline.map((item) => ({
    ...item,
    label: `${MONTH_NAMES[item.month]} ${item.year}`,
  }));

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-semibold text-ink">
        Your Impact
      </h3>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Requests Created"
          value={analytics.totalRequests}
          icon={Heart}
        />
        <StatCard
          label="Responses Given"
          value={analytics.totalResponses}
          icon={Users}
        />
        <StatCard
          label="Lives Saved"
          value={analytics.livesSaved}
          icon={Trophy}
          highlight
        />
        <StatCard
          label="Fulfillment Rate"
          value={`${analytics.fulfillmentRate}%`}
          icon={Target}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Pie Chart */}
        {statusData.length > 0 && (
          <div className="bg-paper border border-slate rounded-lg p-6">
            <h4 className="font-heading text-sm font-semibold text-ink mb-4">
              Request Status Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || "oklch(0.55 0.02 270)"}
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
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Activity Timeline */}
        {timelineData.length > 0 && (
          <div className="bg-paper border border-slate rounded-lg p-6">
            <h4 className="font-heading text-sm font-semibold text-ink mb-4">
              Activity (Last 6 Months)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.01 270)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "oklch(0.3 0.02 270)", fontSize: 11 }}
                  axisLine={{ stroke: "oklch(0.88 0.01 270)" }}
                />
                <YAxis
                  tick={{ fill: "oklch(0.3 0.02 270)", fontSize: 12 }}
                  axisLine={{ stroke: "oklch(0.88 0.01 270)" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.98 0.01 270)",
                    border: "1px solid oklch(0.88 0.01 270)",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="oklch(0.55 0.22 20)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.55 0.22 20)", r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Impact Summary */}
      {analytics.livesSaved > 0 && (
        <div className="rounded-lg bg-gradient-to-r from-crimson/10 to-teal/10 border border-crimson/20 p-6">
          <p className="text-sm text-ink">
            You&apos;ve helped save{" "}
            <span className="font-bold text-crimson">
              {analytics.livesSaved} {analytics.livesSaved === 1 ? "life" : "lives"}
            </span>{" "}
            through {analytics.totalResponses} responses and{" "}
            {analytics.totalDonations} donations.
          </p>
        </div>
      )}
    </div>
  );
}
