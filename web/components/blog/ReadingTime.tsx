import { Clock } from 'lucide-react';

export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[--color-faint] border border-[--color-border] rounded-md px-2 h-6">
      <Clock size={11} />
      {minutes} min
    </span>
  );
}
