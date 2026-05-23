'use client';
import { useEffect, useRef, useState } from 'react';

export function Tagline({ text }: { text: string }) {
  const [played, setPlayed] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPlayed(true);
      return;
    }
    const cached = sessionStorage.getItem('aurora:tagline-played');
    if (cached === '1') {
      setPlayed(true);
      return;
    }
    sessionStorage.setItem('aurora:tagline-played', '1');
  }, []);

  if (!text) return null;

  return (
    <blockquote className="border-l-2 border-[--color-accent] pl-4 my-6 max-w-[600px]">
      <span
        ref={ref}
        className={`font-serif text-lg md:text-xl italic text-[--color-fg] leading-snug ${played ? '' : 'tagline-typewriter'}`}
        style={{
          // restrict via inline style so animation knows the target width
          ['--tw-chars' as string]: `${text.length}ch`,
        }}
      >
        “{text}”
      </span>
      <style>{`
        .tagline-typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          max-width: var(--tw-chars);
          animation: tagline-type 1.6s steps(${Math.max(text.length, 1)}, end) 0.25s 1 both;
        }
        @keyframes tagline-type {
          from { max-width: 0; }
          to   { max-width: var(--tw-chars); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tagline-typewriter { animation: none; max-width: none; }
        }
      `}</style>
    </blockquote>
  );
}
