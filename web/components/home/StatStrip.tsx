import { Eye, FileText, Radio } from 'lucide-react';

interface Props {
  availability?: string;
  views: number;
  posts: number;
}

export function StatStrip({ availability, views, posts }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
      {availability && (
        <Chip
          icon={<Radio size={11} className="text-[--color-accent]" />}
          label={availability}
        />
      )}
      <Chip
        icon={<Eye size={11} className="text-[--color-accent]" />}
        label={`${views.toLocaleString()} views`}
      />
      <Chip
        icon={<FileText size={11} className="text-[--color-accent]" />}
        label={`${posts} posts`}
      />
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 h-6 rounded-md border border-[--color-border] text-[--color-muted]">
      {icon}
      {label}
    </span>
  );
}
