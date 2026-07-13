/**
 * Admin Dashboard Stats Cards
 * Displays key metrics: totalRequests, activeRequests, fulfilledRequests, 
 * totalDonors, donationsThisMonth (Req 18.8)
 */

import { TrendingUp, Users, Droplet, CheckCircle, Activity } from "lucide-react";
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
      description: "All blood requests",
      color: "text-crimson",
    },
    {
      title: "Active Requests",
      value: stats.activeRequests,
      icon: Activity,
      description: "Open & in progress",
      color: "text-ochre",
    },
    {
      title: "Fulfilled Requests",
      value: stats.fulfilledRequests,
      icon: CheckCircle,
      description: "Successfully completed",
      color: "text-teal",
    },
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: Users,
      description: "Registered donors",
      color: "text-ink",
    },
    {
      title: "Donations This Month",
      value: stats.donationsThisMonth,
      icon: TrendingUp,
      description: "Verified donations",
      color: "text-teal",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-paper border border-slate rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-semibold text-ink mb-1">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-xs text-slate">{card.description}</p>
              </div>
              <div className={`${card.color} opacity-80`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
