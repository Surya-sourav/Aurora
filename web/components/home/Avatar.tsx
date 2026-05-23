import Image from 'next/image';
import type { PersonalImage } from '@/lib/types';

interface Props {
  image?: PersonalImage;
  name: string;
  size?: number;
}

export function Avatar({ image, name, size = 88 }: Props) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || '~';

  return (
    <div
      className="relative shrink-0 group"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full border border-[--color-accent] overflow-hidden bg-[--color-bg-elev] avatar-frame"
        style={{ width: size, height: size }}
      >
        {image ? (
          <Image
            src={`/api/img/personal/images/${image.id}`}
            alt={image.alt_text || name}
            fill
            className="object-cover transition-[filter] duration-150 group-hover:[filter:hue-rotate(-12deg)_saturate(1.4)]"
            unoptimized
            sizes={`${size}px`}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono font-semibold text-[--color-accent] select-none"
               style={{ fontSize: size * 0.4 }}>
            {initials}
          </div>
        )}
      </div>
      <span
        className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[--color-accent] border-2 border-[--color-bg] animate-pulse"
        aria-label="online"
        title="online"
      />
    </div>
  );
}
