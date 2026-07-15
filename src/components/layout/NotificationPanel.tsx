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

interface NotificationPanelProps {
  className?: string;
}

export function NotificationPanel({ className }: NotificationPanelProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = React.useState<NotificationDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const limit = 10;

  // Use useMemo to ensure unreadCount is always fresh and triggers re-render
  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  // Define fetchNotifications before useEffect
  const fetchNotifications = React.useCallback(
    async (pageNum: number, silent: boolean = false) => {
      if (!session?.user) return;

      setIsLoading(true);
      try {
        const response = await apiFetch(
          `/api/notifications?page=${pageNum}&limit=${limit}`,
        );

        if (!response.ok) {
          // Check if it's a ban/suspension error (redirect will happen in apiFetch)
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || "";

          // Don't throw error if it's a suspension (redirect is handling it)
          if (
            response.status === 401 &&
            (message.includes("suspended") || message.includes("banned"))
          ) {
            // apiFetch will handle redirect to /suspended
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
          // Only show error toast if panel is open and not silent
          toast.error("Failed to load notifications");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user, limit, isOpen],
  );

  // Fetch notifications immediately on mount and when user logs in
  React.useEffect(() => {
    if (session?.user) {
      fetchNotifications(1, true); // Silent fetch on mount
    }
  }, [session?.user, fetchNotifications]);

  // Poll for new notifications every 30 seconds (when user is logged in)
  React.useEffect(() => {
    if (!session?.user) return;

    const intervalId = setInterval(() => {
      // Only fetch first page to check for new notifications (silent)
      fetchNotifications(1, true);
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [session?.user, fetchNotifications]);

  // Refresh notifications when panel opens (to get latest)
  React.useEffect(() => {
    if (isOpen && session?.user) {
      fetchNotifications(1, false); // Non-silent fetch when opening
    }
  }, [isOpen, session?.user, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!session?.user) return;

    // Optimistic update: immediately update UI before API call
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
        // Revert optimistic update on failure
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

    // Optimistic update: immediately update UI before API call
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      const response = await apiFetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (!response.ok) {
        // Revert would be complex here, so just refetch on error
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

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={`relative h-9 w-9 inline-flex items-center justify-center rounded-md transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
      >
        {unreadCount > 0 ? (
          <BellDot className="h-4 w-4 animate-in fade-in-0 zoom-in-95 duration-150" />
        ) : (
          <Bell className="h-4 w-4 animate-in fade-in-0 zoom-in-95 duration-150" />
        )}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px] font-medium animate-in fade-in-0 zoom-in-95 duration-200"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-90 sm:w-105" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between pb-2">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Mark all read
              </Button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <ScrollArea className="h-100">
          {isLoading && page === 1 ? (
            <div className="space-y-3 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                No notifications yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;ll see updates about your requests and responses here
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onClose={() => setIsOpen(false)}
                />
              ))}

              {hasMore && (
                <div className="pt-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={isLoading}
                    className="w-full text-xs"
                  >
                    {isLoading ? "Loading..." : "Load more"}
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

  // Merge actual state with optimistic state
  const isRead = notification.isRead || isOptimisticallyRead;

  const handleClick = () => {
    if (!isRead) {
      setIsOptimisticallyRead(true); // Immediate visual feedback
      onMarkRead(notification._id);
    }
    if (link) {
      onClose();
    }
  };

  const handleMarkReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOptimisticallyRead(true); // Immediate visual feedback
    onMarkRead(notification._id);
  };

  const content = (
    <div
      className={`group relative flex gap-3 rounded-md p-3 transition-colors hover:bg-accent ${
        !isRead ? "bg-accent/50" : ""
      }`}
    >
      {/* Unread indicator dot */}
      {!isRead && (
        <div className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-crimson animate-in fade-in-0 zoom-in-50 duration-200" />
      )}

      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
          !isRead ? "bg-crimson/10" : "bg-muted"
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="text-sm font-medium leading-tight">
          {notification.title}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Mark read button */}
      {!isRead && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleMarkReadClick}
          aria-label="Mark as read"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} onClick={handleClick}>
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
    <div className="flex gap-3 rounded-md p-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getNotificationIcon(type: NotificationType) {
  const iconClass = "h-5 w-5";

  switch (type) {
    case NotificationType.NEW_RESPONSE:
      return <MessageSquare className={iconClass} />;
    case NotificationType.RESPONSE_STATUS_CHANGE:
      return <CheckCircle2 className={iconClass} />;
    case NotificationType.REQUEST_STATUS_CHANGE:
      return <AlertCircle className={iconClass} />;
    case NotificationType.NEW_MATCHING_REQUEST:
      return <Droplet className={`${iconClass} text-crimson`} />;
    case NotificationType.DONATION_VERIFIED:
      return <CheckCircle2 className={`${iconClass} text-teal`} />;
    case NotificationType.REQUEST_EXPIRING_SOON:
      return <Clock className={`${iconClass} text-ochre`} />;
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return <Shield className={iconClass} />;
    case NotificationType.CONTACT_INFO_REQUESTED:
      return <Mail className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
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
      return "/profile"; // Go to user's response history

    case NotificationType.NEW_MATCHING_REQUEST:
      return notification.relatedRequestId
        ? `/requests/${notification.relatedRequestId}`
        : "/requests";

    case NotificationType.DONATION_VERIFIED:
      return "/profile"; // Go to user's donation history

    case NotificationType.CONTACT_INFO_REQUESTED:
      return notification.relatedRequestId
        ? `/requests/${notification.relatedRequestId}`
        : null;

    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return null; // System announcements don't have links

    default:
      return null;
  }
}
