import { Eye } from 'lucide-react';

export function ViewCountBadge({
  count,
  label = 'views',
}: {
  count: number;
  label?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-xs text-[--color-faint] border border-[--color-border] rounded-md px-2 h-6"
      title={`${count.toLocaleString()} ${label}`}
    >
      <Eye size={11} className="text-[--color-accent]" />
      {count.toLocaleString()}
      <span className="text-[--color-faint]">{label}</span>
    </span>
  );
}
