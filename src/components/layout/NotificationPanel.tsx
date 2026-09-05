"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import type { NotificationDto } from "@/types/dto/notification.dto";
import type { PaginatedResponse } from "@/types/shared";
import { NotificationType } from "@/types/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BellDot,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Shield,
  Clock,
  MessageSquare,
  Mail,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface NotificationPanelProps {
  className?: string;
}

type NotificationFilter = "all" | "unread" | "requests";

export function NotificationPanel({ className }: NotificationPanelProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = React.useState<NotificationDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<NotificationFilter>("all");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const limit = 15;

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const fetchNotifications = React.useCallback(
    async (pageNum: number, silent: boolean = false) => {
      if (!session?.user) return;

      setIsLoading(true);
      try {
        const response = await apiFetch(
          `/api/notifications?page=${pageNum}&limit=${limit}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || "";

          if (
            response.status === 401 &&
            (message.includes("suspended") || message.includes("banned"))
          ) {
            return;
          }

          throw new Error("Failed to fetch notifications");
        }

        const data: PaginatedResponse<NotificationDto> = await response.json();

        if (pageNum === 1) {
          setNotifications(data.data);
        } else {
          setNotifications((prev) => [...prev, ...data.data]);
        }

        setHasMore(data.hasNextPage);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (!silent && isOpen) {
          toast.error("Failed to load notifications");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user, limit, isOpen],
  );

  React.useEffect(() => {
    if (session?.user) {
      fetchNotifications(1, true);
    }
  }, [session?.user, fetchNotifications]);

  React.useEffect(() => {
    if (!session?.user) return;

    const intervalId = setInterval(() => {
      fetchNotifications(1, true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [session?.user, fetchNotifications]);

  React.useEffect(() => {
    if (isOpen && session?.user) {
      fetchNotifications(1, false);
    }
  }, [isOpen, session?.user, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!session?.user) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)),
    );

    try {
      const response = await apiFetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: false } : n,
          ),
        );
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    if (!session?.user) return;

    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      const response = await apiFetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (!response.ok) {
        await fetchNotifications(1);
        throw new Error("Failed to mark all notifications as read");
      }

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    if (filter === "requests") {
      return notifications.filter(
        (n) =>
          n.type === NotificationType.NEW_MATCHING_REQUEST ||
          n.type === NotificationType.REQUEST_STATUS_CHANGE ||
          n.type === NotificationType.REQUEST_EXPIRING_SOON ||
          n.type === NotificationType.NEW_RESPONSE,
      );
    }
    return notifications;
  }, [notifications, filter]);

  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
        onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT)}
      >
        {unreadCount > 0 ? (
          <BellDot className="h-4.5 w-4.5 text-crimson animate-in fade-in-0 zoom-in-95 duration-150" />
        ) : (
          <Bell className="h-4.5 w-4.5 animate-in fade-in-0 zoom-in-95 duration-150" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-crimson px-1 font-mono text-[10px] font-bold text-paper shadow-2xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[calc(100vw-2rem)] sm:w-[380px] p-0 rounded-2xl border border-border bg-card shadow-lg overflow-hidden" 
        sideOffset={8}
      >
        {/* Header Capsule */}
        <div className="border-b border-border/80 bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-foreground tracking-tight">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-crimson/10 px-2 py-0.5 font-mono text-[10px] font-bold text-crimson">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-crimson hover:bg-crimson/5 rounded-lg"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Tactical Filter Segment */}
          <div className="mt-2.5 flex items-center gap-1 rounded-xl bg-muted/60 p-0.5 border border-border/60">
            {(
              [
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "requests", label: "Dispatches" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                  setFilter(tab.key);
                }}
                className={`flex-1 rounded-lg py-1 text-[11px] font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Feed */}
        <ScrollArea className="max-h-[380px] overflow-y-auto">
          {isLoading && page === 1 ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground/60 mb-2.5">
                <Bell className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {filter === "unread" ? "No unread notifications" : "All caught up"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground max-w-[220px] leading-relaxed">
                {filter === "unread"
                  ? "You have reviewed all urgent updates and dispatches."
                  : "You will receive real-time alerts for matching blood requests and coordinator responses here."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50 p-1">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onClose={() => setIsOpen(false)}
                />
              ))}

              {hasMore && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={isLoading}
                    className="w-full text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg h-8"
                  >
                    {isLoading ? "Loading..." : "Load older notifications"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// NotificationItem Component
// ============================================================================

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

function NotificationItem({
  notification,
  onMarkRead,
  onClose,
}: NotificationItemProps) {
  const [isOptimisticallyRead, setIsOptimisticallyRead] = React.useState(false);
  const icon = getNotificationIcon(notification.type);
  const link = getNotificationLink(notification);
  const isRead = notification.isRead || isOptimisticallyRead;

  const handleClick = () => {
    if (!isRead) {
      setIsOptimisticallyRead(true);
      onMarkRead(notification._id);
    }
    if (link) {
      onClose();
    }
  };

  const handleMarkReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setIsOptimisticallyRead(true);
    onMarkRead(notification._id);
  };

  const content = (
    <div
      className={`group relative flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50 cursor-pointer ${
        !isRead ? "bg-crimson/5 hover:bg-crimson/8" : ""
      }`}
    >
      {/* Visual Unread Bar */}
      {!isRead && (
        <div className="absolute left-1 top-3.5 bottom-3.5 w-1 rounded-full bg-crimson" />
      )}

      {/* Semantic Icon Capsule */}
      <div className="shrink-0 pl-1">{icon}</div>

      {/* Text Hierarchy */}
      <div className="flex-1 space-y-0.5 min-w-0 pr-1">
        <p className={`text-xs leading-snug truncate ${!isRead ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}>
          {notification.title}
        </p>
        <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/80 tabular-nums pt-0.5">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Dismiss / Mark Read Hover Action */}
      {!isRead && (
        <button
          type="button"
          onClick={handleMarkReadClick}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground rounded-md transition-opacity"
          aria-label="Mark as read"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} onClick={handleClick} className="block">
        {content}
      </Link>
    );
  }

  return <div onClick={handleClick}>{content}</div>;
}

// ============================================================================
// NotificationSkeleton Component
// ============================================================================

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl p-2.5 bg-card">
      <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-2.5 w-1/3 rounded" />
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getNotificationIcon(type: NotificationType) {
  const iconBase = "h-4 w-4";

  switch (type) {
    case NotificationType.NEW_MATCHING_REQUEST:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
          <Droplet className={`${iconBase} fill-crimson`} />
        </div>
      );
    case NotificationType.REQUEST_STATUS_CHANGE:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
          <AlertCircle className={iconBase} />
        </div>
      );
    case NotificationType.DONATION_VERIFIED:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <CheckCircle2 className={iconBase} />
        </div>
      );
    case NotificationType.RESPONSE_STATUS_CHANGE:
    case NotificationType.NEW_RESPONSE:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <MessageSquare className={iconBase} />
        </div>
      );
    case NotificationType.REQUEST_EXPIRING_SOON:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ochre/10 text-ochre">
          <Clock className={iconBase} />
        </div>
      );
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
          <Shield className={iconBase} />
        </div>
      );
    case NotificationType.CONTACT_INFO_REQUESTED:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
          <Mail className={iconBase} />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Bell className={iconBase} />
        </div>
      );
  }
}

function getNotificationLink(notification: NotificationDto): string | null {
  switch (notification.type) {
    case NotificationType.NEW_RESPONSE:
    case NotificationType.REQUEST_STATUS_CHANGE:
    case NotificationType.REQUEST_EXPIRING_SOON:
      return notification.relatedRequestId
        ? `/requests/${notification.relatedRequestId}`
        : null;

    case NotificationType.RESPONSE_STATUS_CHANGE:
      return "/profile";

    case NotificationType.NEW_MATCHING_REQUEST:
      return notification.relatedRequestId
        ? `/requests/${notification.relatedRequestId}`
        : "/requests";

    case NotificationType.DONATION_VERIFIED:
      return "/profile";

    case NotificationType.CONTACT_INFO_REQUESTED:
      return notification.relatedRequestId
        ? `/requests/${notification.relatedRequestId}`
        : null;

    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return null;

    default:
      return null;
  }
}
