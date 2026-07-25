import Image from 'next/image';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import type { Career } from '@/lib/types';

function formatDate(date: string | null): string {
  if (!date) return 'present';
  // date arrives as YYYY-MM-DD from Postgres
  const [y, m] = date.split('-');
  if (!y || !m) return date;
  return `${y}.${m}`;
}

export function CareerEntry({ item }: { item: Career }) {
  const isCurrent = !item.end_date;
  const dateRange = `${formatDate(item.start_date)} — ${formatDate(item.end_date)}`;
  const metaParts = [dateRange, item.location, item.employment_type].filter(Boolean);

  const companyEl = item.company_url ? (
    <a
      href={item.company_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[--color-accent] hover:underline underline-offset-2"
    >
      {item.company_name}
    </a>
  ) : (
    <span className="text-[--color-accent]">{item.company_name}</span>
  );

  return (
    <article className="relative pb-10 last:pb-0">
      <span
        className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full border-2 ${
          isCurrent ? 'border-[--color-accent]' : 'border-[--color-border]'
        } bg-[--color-bg] flex items-center justify-center`}
        aria-hidden="true"
      >
        {isCurrent && (
          <span className="w-1.5 h-1.5 rounded-full bg-[--color-accent] animate-pulse" />
        )}
      </span>

      <header className="flex items-start gap-3 mb-2">
        {item.logo_mime ? (
          <div className="w-11 h-11 shrink-0 border border-[--color-border] rounded-md overflow-hidden bg-[--color-bg-elev]">
            <Image
              src={`/api/img/career/${item.id}/logo`}
              alt={`${item.company_name} logo`}
              width={44}
              height={44}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-11 h-11 shrink-0 border border-dashed border-[--color-border] rounded-md flex items-center justify-center bg-[--color-bg-elev] font-mono text-[--color-faint] text-lg select-none">
            {item.company_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-base font-medium text-[--color-fg] leading-tight break-words">
            {item.job_title}
            <span className="text-[--color-faint]"> @ </span>
            {companyEl}
            {isCurrent && (
              <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-[--color-accent] border border-[--color-accent] rounded px-1.5 py-0.5 align-middle">
                current
              </span>
            )}
          </h3>
          <p className="font-mono text-xs text-[--color-muted] mt-1">
            {metaParts.map((p, i) => (
              <span key={i}>
                {i > 0 && <span className="text-[--color-faint]"> · </span>}
                {p}
              </span>
            ))}
          </p>
        </div>
      </header>

      {item.description && (
        <div className="mt-3">
          <MarkdownRenderer>{item.description}</MarkdownRenderer>
        </div>
      )}
    </article>
  );
}
