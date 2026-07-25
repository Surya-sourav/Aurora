'use client';
import { useEffect, useMemo, useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function TableOfContents({ body }: { body: string }) {
  const headings = useMemo<TocHeading[]>(() => {
    const lines = body.split('\n');
    let inCode = false;
    const out: TocHeading[] = [];
    for (const line of lines) {
      if (/^```/.test(line)) {
        inCode = !inCode;
        continue;
      }
      if (inCode) continue;
      const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (m) {
        const level = m[1].length;
        const text = m[2].replace(/[*_`]/g, '');
        out.push({ id: slugify(text), text, level });
      }
    }
    return out;
  }, [body]);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0% -70% 0%' },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="text-xs font-mono">
      <div className="text-[--color-faint] mb-2 uppercase tracking-wider">
        ## on this page
      </div>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: (h.level - 2) * 12 }}
          >
            <a
              href={`#${h.id}`}
              className={`block truncate transition-colors ${
                activeId === h.id
                  ? 'text-[--color-accent]'
                  : 'text-[--color-muted] hover:text-[--color-fg]'
              }`}
            >
              <span className="text-[--color-faint]">
                {h.level === 2 ? '▸ ' : '· '}
              </span>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
