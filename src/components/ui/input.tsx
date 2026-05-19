import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-100",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-clinic-500 focus:ring-2 focus:ring-clinic-100",
        className
      )}
      {...props}
    />
  );
}
