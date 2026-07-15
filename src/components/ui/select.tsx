"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

function Select<Value = string>({
  ...props
}: SelectPrimitive.Root.Props<Value>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

interface SelectTriggerProps extends SelectPrimitive.Trigger.Props {
  error?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none",
          "hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
          "md:text-sm dark:bg-input/30 dark:hover:border-foreground/30",
          "[&>span]:line-clamp-1 [&>span]:text-start",
          error &&
            "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
          className,
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon className="shrink-0">
          <ChevronDown
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectPortal({ ...props }: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />;
}

function SelectContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  collisionBoundary,
  collisionPadding = 8,
  className,
  children,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionBoundary"
    | "collisionPadding"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        positionMethod="fixed"
        alignItemWithTrigger={false}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "z-50 w-(--anchor-width) min-w-32 origin-(--transform-origin) rounded-lg border border-border bg-popover text-popover-foreground shadow-lg duration-100 outline-none",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          <div className="max-h-(--available-height,300px) overflow-y-auto overflow-x-hidden overscroll-contain p-1">
            {children}
          </div>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectGroup({ ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.Item.Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <SelectPrimitive.Item
        ref={ref}
        data-slot="select-item"
        className={cn(
          "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
          "focus:bg-accent focus:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span
          className="pointer-events-none absolute left-2 flex items-center justify-center"
          data-slot="select-item-indicator"
        >
          <SelectPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
