import type { Personal } from '@/lib/types';
import { ViewCountBadge } from '@/components/layout/ViewCountBadge';
import { AsciiBanner } from './AsciiBanner';

export function Hero({ personal }: { personal: Personal }) {
  return (
    <section className="space-y-6">
      <AsciiBanner name={personal.name} />
      <div className="space-y-2">
        <h1 className="font-mono text-2xl md:text-3xl font-medium tracking-tight">
          {personal.heading}
          <span className="caret">▮</span>
        </h1>
        {personal.sub_heading && (
          <p className="font-mono text-sm text-[--color-muted]">
            <span className="text-[--color-faint]">{'>'} </span>
            {personal.sub_heading}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ViewCountBadge count={personal.portfolio_view_count} label="views" />
        <span className="font-mono text-xs text-[--color-faint]">
          {personal.email}
        </span>
      </div>
    </section>
  );
}
