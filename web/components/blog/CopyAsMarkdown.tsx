'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyAsMarkdown({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border border-[--color-border] text-[--color-muted] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors font-mono text-xs"
      title="Copy the post's markdown source"
    >
      {copied ? (
        <>
          <Check size={11} /> copied
        </>
      ) : (
        <>
          <Copy size={11} /> copy as md
        </>
      )}
    </button>
  );
}
