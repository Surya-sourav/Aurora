'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="h-8 w-8 inline-flex items-center justify-center border border-[--color-border] rounded-md"
      />
    );
  }

  const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
  const icon =
    theme === 'system' ? (
      <Monitor size={14} />
    ) : (resolvedTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />);

  return (
    <button
      onClick={() => setTheme(next)}
      title={`theme: ${theme} (click for ${next})`}
      aria-label="Toggle theme"
      className="h-8 w-8 inline-flex items-center justify-center border border-[--color-border] rounded-md hover:border-[--color-accent] transition-colors text-[--color-muted] hover:text-[--color-fg]"
    >
      {icon}
    </button>
  );
}
