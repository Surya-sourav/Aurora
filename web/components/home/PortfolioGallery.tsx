import Image from 'next/image';
import type { PersonalImage } from '@/lib/types';

export function PortfolioGallery({ images }: { images: PersonalImage[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div
      className="grid gap-3 my-8"
      style={{
        gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, minmax(0, 1fr))`,
      }}
    >
      {images.map((img) => (
        <div
          key={img.id}
          className="relative aspect-square border border-[--color-border] rounded-md overflow-hidden bg-[--color-bg-elev]"
        >
          <Image
            src={`/api/img/personal/images/${img.id}`}
            alt={img.alt_text || 'portfolio image'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
