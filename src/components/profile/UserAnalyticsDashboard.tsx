"use client";

import * as React from "react";
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
import {
  Heart,
  Users,
  Trophy,
  Target,
  Activity,
  CheckCircle2,
  Sparkles,
  Droplet,
  Clock,
  ShieldCheck,
} from "lucide-react";

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
  open: "var(--teal)",
  in_progress: "var(--ochre)",
  fulfilled: "var(--teal)",
  cancelled: "var(--slate)",
  expired: "var(--muted-foreground)",
};

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-5 transition-all ${
        highlight
          ? "border-crimson/30 bg-crimson/5 ring-1 ring-crimson/10"
          : "border-border bg-card shadow-2xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {label}
          </p>
          <p className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground tabular-nums truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-muted-foreground pt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${
            highlight
              ? "bg-crimson/10 text-crimson"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}

export function UserAnalyticsDashboard({
  analytics,
}: {
  analytics: UserAnalytics;
}) {
  const statusData = Object.entries(analytics.requestsByStatus || {}).map(
    ([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
    }),
  );

  const timelineData = (analytics.activityTimeline || []).map((item) => ({
    ...item,
    label: `${MONTH_NAMES[item.month]} ${item.year}`,
  }));

  const hasActivity =
    analytics.totalRequests > 0 ||
    analytics.totalResponses > 0 ||
    analytics.totalDonations > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-border/70">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Operational Impact & Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Lifetime transfusion metrics, blood requests created, and volunteer responses.
          </p>
        </div>
      </div>

      {/* 4 Core Impact Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Lives Saved"
          value={analytics.livesSaved || 0}
          subtitle="Direct emergency transfusions"
          icon={Heart}
          highlight
        />
        <StatCard
          label="Verified Donations"
          value={analytics.verifiedDonations || 0}
          subtitle={`${analytics.totalDonations || 0} total logged`}
          icon={Trophy}
        />
        <StatCard
          label="Responses Given"
          value={analytics.totalResponses || 0}
          subtitle={`${analytics.responseSuccessRate || 0}% match rate`}
          icon={Users}
        />
        <StatCard
          label="Fulfillment Rate"
          value={`${analytics.fulfillmentRate || 0}%`}
          subtitle={`${analytics.totalRequests || 0} requests created`}
          icon={Target}
        />
      </div>


      {/* Impact Statement Card */}
      {analytics.livesSaved > 0 && (
        <div className="rounded-2xl border border-teal/30 bg-teal/5 p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal text-paper">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Direct Community Impact
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have helped save{" "}
              <strong className="text-crimson font-mono font-bold">
                {analytics.livesSaved}{" "}
                {analytics.livesSaved === 1 ? "life" : "lives"}
              </strong>{" "}
              across Bangladesh through{" "}
              <strong className="text-foreground">{analytics.totalResponses}</strong> volunteer responses and{" "}
              <strong className="text-foreground">{analytics.totalDonations}</strong> hospital donations.
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-crimson" />
              <span>Request Lifecycle Breakdown</span>
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              {analytics.totalRequests} TOTAL
            </span>
          </div>

          {statusData.length > 0 ? (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name.toLowerCase().replace(" ", "_")] || "var(--slate)"}
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
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-muted/20 border border-dashed border-border/80">
              <Droplet className="h-6 w-6 text-muted-foreground/40 mb-1" />
              <p className="text-xs text-muted-foreground">
                No blood requests created yet.
              </p>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-teal" />
              <span>Activity Cadence (Past 6 Months)</span>
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              DISPATCH TREND
            </span>
          </div>

          {timelineData.length > 0 ? (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/60" />
                  <XAxis
                    dataKey="label"
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
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--crimson)"
                    strokeWidth={2.5}
                    dot={{ fill: "var(--crimson)", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Activities"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-muted/20 border border-dashed border-border/80">
              <Activity className="h-6 w-6 text-muted-foreground/40 mb-1" />
              <p className="text-xs text-muted-foreground">
                Your activity timeline will populate as you create or respond to requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
