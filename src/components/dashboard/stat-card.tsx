import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <Icon size={18} className="text-clinic-600" />
      </div>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </Card>
  );
}
