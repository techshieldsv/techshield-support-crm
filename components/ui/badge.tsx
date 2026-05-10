import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "blue" | "cyan" | "green" | "amber" | "red" | "slate";
};

const tones = {
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950 dark:text-blue-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-950 dark:text-cyan-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-200",
  red: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950 dark:text-red-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-900 dark:text-slate-200"
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-inset", tones[tone], className)}
      {...props}
    />
  );
}
