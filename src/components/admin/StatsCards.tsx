import {
  TrendingUp,
  Users,
  Droplet,
  CheckCircle2,
  Activity,
  Heart,
} from "lucide-react";
import type { AdminStats } from "@/lib/api/admin";

interface StatsCardsProps {
  stats: AdminStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: Droplet,
      description: "All-time broadcasts",
      accent: "text-crimson",
      iconBg: "bg-crimson/10 text-crimson",
      highlight: false,
    },
    {
      title: "Active Dispatch",
      value: stats.activeRequests,
      icon: Activity,
      description: "Open & in-progress",
      accent: "text-crimson",
      iconBg: "bg-crimson/10 text-crimson",
      highlight: true,
    },
    {
      title: "Fulfilled",
      value: stats.fulfilledRequests,
      icon: CheckCircle2,
      description: "Completed transfusions",
      accent: "text-teal",
      iconBg: "bg-teal/10 text-teal",
      highlight: false,
    },
    {
      title: "Active Donors",
      value: stats.totalDonors,
      icon: Users,
      description: "Volunteers ready",
      accent: "text-teal",
      iconBg: "bg-teal/10 text-teal",
      highlight: false,
    },
    {
      title: "This Month",
      value: stats.donationsThisMonth,
      icon: TrendingUp,
      description: "Verified donations",
      accent: "text-ochre",
      iconBg: "bg-ochre/10 text-ochre",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-2xl border p-3.5 sm:p-4.5 transition-all ${
              card.highlight
                ? "border-crimson/30 bg-crimson/5 ring-1 ring-crimson/20"
                : "border-border bg-card shadow-2xs hover:border-border/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {card.title}
                </p>
                <p className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground tabular-nums truncate">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground truncate pt-0.5">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
