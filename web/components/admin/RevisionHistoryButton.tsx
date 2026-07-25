'use client';
import { useState } from 'react';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { BlogRevision } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  blogId: string;
  onRestore: (rev: BlogRevision) => void;
}

export function RevisionHistoryButton({ blogId, onRestore }: Props) {
  const [open, setOpen] = useState(false);
  const [revisions, setRevisions] = useState<BlogRevision[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<BlogRevision | null>(null);

  const load = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/proxy/blog/${blogId}/revisions`);
      if (!res.ok) throw new Error(`failed (${res.status})`);
      const data = (await res.json()) as { items: BlogRevision[] };
      setRevisions(data.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={load}>
        <History size={12} />
        history
      </Button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-[--color-bg] border border-[--color-border] rounded-lg p-5 shadow-2xl grid grid-cols-[240px_1fr] gap-4 max-h-[80vh]">
            <div className="border-r border-[--color-border] pr-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm">
                  <span className="text-[--color-faint]">## </span>revisions
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[--color-faint] hover:text-[--color-fg]"
                >
                  <X size={13} />
                </button>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 font-mono text-xs text-[--color-faint]">
                  <Spinner size={11} /> loading…
                </div>
              ) : revisions.length === 0 ? (
                <p className="font-mono text-xs text-[--color-faint]">
                  no revisions yet
                </p>
              ) : (
                <ul className="space-y-1">
                  {revisions.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setPreview(r)}
                        className={`w-full text-left px-2 py-1.5 rounded font-mono text-xs transition-colors ${
                          preview?.id === r.id
                            ? 'bg-[--color-bg-elev] text-[--color-accent]'
                            : 'text-[--color-muted] hover:bg-[--color-bg-elev]'
                        }`}
                      >
                        {new Date(r.created_at).toLocaleString()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="overflow-y-auto">
              {preview ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-sm text-[--color-fg]">
                      {preview.heading}
                    </h4>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onRestore(preview);
                        setOpen(false);
                      }}
                    >
                      restore
                    </Button>
                  </div>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-[--color-muted] bg-[--color-bg-elev] border border-[--color-border] rounded-md p-3">
                    {preview.body}
                  </pre>
                </div>
              ) : (
                <p className="font-mono text-xs text-[--color-faint] text-center py-8">
                  select a revision to preview
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
