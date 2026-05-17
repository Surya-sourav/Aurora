'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { SHORTCUTS } from '@/lib/shortcuts';

export function KeyboardShortcuts() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const [prefix, setPrefix] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();

      if (k === '?') {
        e.preventDefault();
        setShowHelp((s) => !s);
        return;
      }
      if (k === 'escape') {
        setShowHelp(false);
        setPrefix(null);
        return;
      }
      if (k === 't') {
        e.preventDefault();
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        return;
      }

      if (k === 'g') {
        setPrefix('g');
        setTimeout(() => setPrefix(null), 1200);
        return;
      }

      if (prefix === 'g') {
        const map: Record<string, string> = {
          h: '/',
          b: '/blog',
          i: '/interests',
          a: '/admin',
        };
        const dest = map[k];
        if (dest) {
          e.preventDefault();
          router.push(dest);
        }
        setPrefix(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prefix, router, setTheme, resolvedTheme]);

  return (
    <>
      {prefix === 'g' && (
        <div className="fixed bottom-4 left-4 z-40 font-mono text-xs px-3 h-8 inline-flex items-center bg-[--color-bg-elev] border border-[--color-accent] rounded-md text-[--color-accent]">
          g_
        </div>
      )}
      {showHelp && (
        <>
          <button
            type="button"
            aria-label="Close help"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowHelp(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[--color-bg] border border-[--color-border] rounded-lg p-5 shadow-2xl">
            <h2 className="font-mono text-sm mb-4 text-[--color-fg]">
              <span className="text-[--color-faint]">## </span>shortcuts
            </h2>
            <ul className="space-y-1.5">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.keys}
                  className="flex items-center justify-between font-mono text-xs"
                >
                  <span className="text-[--color-muted]">{s.label}</span>
                  <kbd className="kbd">{s.keys}</kbd>
                </li>
              ))}
            </ul>
            <p className="font-mono text-xs text-[--color-faint] mt-4">
              theme: <span className="text-[--color-accent]">{theme}</span> ·
              esc to close
            </p>
          </div>
        </>
      )}
    </>
  );
}

function isTyping() {
  if (typeof document === 'undefined') return false;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}
