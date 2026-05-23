import Image from 'next/image';
import type { PersonalImage } from '@/lib/types';

interface Props {
  images: PersonalImage[];
  skipFirst?: boolean;
}

export function PortfolioGallery({ images, skipFirst = false }: Props) {
  const visible = skipFirst ? images.slice(1) : images;
  if (!visible || visible.length === 0) return null;
  const cols = Math.min(visible.length, 3);
  return (
    <div
      className="grid gap-3 my-6"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 180px))`,
      }}
    >
      {visible.map((img) => (
        <div
          key={img.id}
          className="relative aspect-square border border-[--color-border] rounded-md overflow-hidden bg-[--color-bg-elev] group"
        >
          <Image
            src={`/api/img/personal/images/${img.id}`}
            alt={img.alt_text || 'portfolio image'}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
