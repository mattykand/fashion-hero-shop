import { Lock } from "lucide-react";

interface PreviewMetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export function PreviewMetricCard({ label, value, hint }: PreviewMetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5">
      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
        <Lock className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <p className="pr-8 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p aria-hidden="true" className="mt-3 select-none text-2xl font-bold text-gray-900 blur-sm">
        {value}
      </p>
      <p className="mt-2 text-xs text-gray-400">{hint}</p>
    </div>
  );
}
