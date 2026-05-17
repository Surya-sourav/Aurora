'use client';
import { Search } from 'lucide-react';

export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent('aurora:open-palette'))
      }
      className="hidden sm:inline-flex items-center gap-2 h-8 px-2 border border-[--color-border] rounded-md text-xs font-mono text-[--color-muted] hover:text-[--color-fg] transition-colors"
      title="Open command palette (⌘K)"
    >
      <Search size={11} />
      <span>search</span>
      <kbd className="kbd">⌘K</kbd>
    </button>
  );
}
