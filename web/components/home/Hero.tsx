import type { Personal } from '@/lib/types';
import { Avatar } from './Avatar';
import { Tagline } from './Tagline';
import { StatStrip } from './StatStrip';
import { StackChips } from './StackChips';
import { SocialBar } from './SocialBar';

interface Props {
  personal: Personal;
  postCount: number;
}

export function Hero({ personal, postCount }: Props) {
  const subParts = [
    personal.sub_heading,
    personal.location,
    personal.availability,
  ].filter((s) => s && s.trim().length > 0);

  return (
    <section className="space-y-6 pb-6">
      <div className="font-mono text-xs text-[--color-muted]">
        <span className="text-[--color-accent]">$</span> whoami
      </div>

      <div className="flex items-start gap-5">
        <Avatar image={personal.images?.[0]} name={personal.name} size={88} />
        <div className="flex-1 min-w-0 space-y-1.5 pt-1">
          <h1 className="font-mono text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-[--color-fg]">
            {personal.name}
            <span className="caret">▮</span>
          </h1>
          {subParts.length > 0 && (
            <p className="font-mono text-sm text-[--color-muted] leading-relaxed">
              {subParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-[--color-faint]"> · </span>}
                  {part}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {personal.heading && <Tagline text={personal.heading} />}

      <StatStrip
        availability={personal.availability || undefined}
        views={personal.portfolio_view_count}
        posts={postCount}
      />

      <StackChips items={personal.stack ?? []} />

      <SocialBar email={personal.email} socials={personal.socials} />

      <hr className="border-0 border-t border-[--color-border] mt-2" />
    </section>
  );
}
