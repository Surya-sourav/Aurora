'use client';
import { useEffect, useRef, useState } from 'react';

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: 'var(--font-geist-mono), monospace',
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

export function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then(async (mermaid) => {
        try {
          const { svg } = await mermaid.render(idRef.current, code);
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'mermaid error');
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'mermaid load failed');
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <pre className="font-mono text-xs text-[--color-danger] border border-[--color-danger] rounded-md p-3 my-4">
        mermaid: {error}
        {'\n\n'}
        {code}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto border border-[--color-border] rounded-md p-4 bg-[--color-bg-elev]"
    />
  );
}
