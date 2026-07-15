import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-9 w-full appearance-none rounded-lg border border-input bg-transparent px-3 py-2 pr-8 text-base transition-colors outline-none",
            "hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
            "md:text-sm dark:bg-input/30 dark:hover:border-foreground/30",
            error &&
              "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
