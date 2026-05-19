import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white shadow-panel", className)} {...props}>
      {children}
    </div>
  );
}
