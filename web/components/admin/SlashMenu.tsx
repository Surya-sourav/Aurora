'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Code,
  FileCode,
  MessageSquare,
  Info,
  AlertTriangle,
  Lightbulb,
  GitBranch,
  Sigma,
  Minus,
  Check,
  Quote,
  Link as LinkIcon,
} from 'lucide-react';

const OPTIONS = [
  { key: 'code', label: 'Code block', icon: Code, hint: '```' },
  { key: 'code-ts', label: 'TypeScript block', icon: FileCode, hint: '```ts' },
  { key: 'callout-note', label: 'Callout: note', icon: MessageSquare, hint: '> [!note]' },
  { key: 'callout-tip', label: 'Callout: tip', icon: Lightbulb, hint: '> [!tip]' },
  { key: 'callout-warn', label: 'Callout: warn', icon: AlertTriangle, hint: '> [!warn]' },
  { key: 'callout-info', label: 'Callout: info', icon: Info, hint: '> [!info]' },
  { key: 'mermaid', label: 'Mermaid diagram', icon: GitBranch, hint: '```mermaid' },
  { key: 'math', label: 'Math block (KaTeX)', icon: Sigma, hint: '$$…$$' },
  { key: 'todo', label: 'TODO item', icon: Check, hint: '- [ ]' },
  { key: 'quote', label: 'Blockquote', icon: Quote, hint: '>' },
  { key: 'wikilink', label: 'Wikilink to post', icon: LinkIcon, hint: '[[slug]]' },
  { key: 'hr', label: 'Horizontal rule', icon: Minus, hint: '---' },
];

interface Props {
  onSelect: (key: string) => void;
  onDismiss: () => void;
}

export function SlashMenu({ onSelect, onDismiss }: Props) {
  const [filter, setFilter] = useState('');
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase()),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(filtered.length - 1, i + 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[idx]) onSelect(filtered[idx].key);
        return;
      }
      if (e.key === 'Backspace') {
        setFilter((f) => f.slice(0, -1));
        return;
      }
      if (/^[a-z0-9 ]$/i.test(e.key)) {
        setFilter((f) => f + e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, idx, onSelect, onDismiss]);

  useEffect(() => {
    setIdx(0);
  }, [filter]);

  return (
    <div
      ref={ref}
      className="absolute z-20 top-8 left-8 w-64 bg-[--color-bg] border border-[--color-accent] rounded-md shadow-xl overflow-hidden"
    >
      <div className="px-3 h-7 border-b border-[--color-border] font-mono text-xs text-[--color-faint] flex items-center gap-2">
        <span className="text-[--color-accent]">/</span>
        {filter || 'insert…'}
      </div>
      <ul className="max-h-64 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <li className="px-3 py-2 font-mono text-xs text-[--color-faint]">
            no matches
          </li>
        ) : (
          filtered.map((o, i) => {
            const Icon = o.icon;
            return (
              <li key={o.key}>
                <button
                  type="button"
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => onSelect(o.key)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-1.5 font-mono text-xs ${
                    i === idx
                      ? 'bg-[--color-bg-elev] text-[--color-accent]'
                      : 'text-[--color-fg]'
                  }`}
                >
                  <Icon size={11} className="shrink-0" />
                  <span className="flex-1">{o.label}</span>
                  <span className="text-[10px] text-[--color-faint]">
                    {o.hint}
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
