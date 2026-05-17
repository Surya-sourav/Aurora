'use client';
import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({
  language,
  code,
  filename,
  children,
}: {
  language?: string;
  code: string;
  filename?: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  };

  return (
    <div className="my-6 group relative">
      <div className="flex items-center justify-between border border-[--color-border] border-b-0 rounded-t-md bg-[--color-bg-elev] px-3 h-8 text-xs font-mono text-[--color-muted]">
        <span>
          <span className="text-[--color-faint]">$</span>{' '}
          {filename ?? language ?? 'snippet'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 text-[--color-faint] hover:text-[--color-accent] transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={11} /> copied
            </>
          ) : (
            <>
              <Copy size={11} /> copy
            </>
          )}
        </button>
      </div>
      <div className="rounded-b-md border border-[--color-border] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
