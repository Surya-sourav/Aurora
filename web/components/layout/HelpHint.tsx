'use client';

export function HelpHint() {
  return (
    <button
      type="button"
      className="hover:text-[--color-fg]"
      onClick={() =>
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true }))
      }
    >
      press <kbd className="kbd">?</kbd>
    </button>
  );
}
