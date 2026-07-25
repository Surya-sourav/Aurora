import { CareerEntry } from './CareerEntry';
import type { Career } from '@/lib/types';

export function CareerTimeline({ items }: { items: Career[] }) {
  return (
    <div className="relative pl-8 border-l border-[--color-border] my-6 ml-2">
      {items.map((item) => (
        <CareerEntry key={item.id} item={item} />
      ))}
    </div>
  );
}
