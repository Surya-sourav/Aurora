'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import type { Bookmark } from '@/lib/types';

interface Props {
  initial: Bookmark[];
}

interface Draft {
  url: string;
  title: string;
  note: string;
  tagsRaw: string;
}

const EMPTY_DRAFT: Draft = { url: '', title: '', note: '', tagsRaw: '' };

export function BookmarkManager({ initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<Bookmark[]>(initial);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [busy, setBusy] = useState<string | null>(null);

  const add = async () => {
    if (!draft.url.trim()) {
      toast.error('url required');
      return;
    }
    setBusy('__new');
    try {
      const tags = draft.tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch('/api/admin/proxy/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: draft.url,
          title: draft.title || undefined,
          note: draft.note || undefined,
          tags: tags.length ? tags : undefined,
        }),
      });
      if (!res.ok) throw new Error(`add failed (${res.status})`);
      const data = (await res.json()) as { item: Bookmark };
      setRows((rs) => [data.item, ...rs]);
      setDraft(EMPTY_DRAFT);
      toast.success('bookmarked');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'add failed');
    } finally {
      setBusy(null);
    }
  };

  const toggleFav = async (b: Bookmark) => {
    setBusy(b.id);
    try {
      const res = await fetch(`/api/admin/proxy/bookmarks/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !b.is_favorite }),
      });
      if (!res.ok) throw new Error(`failed (${res.status})`);
      const data = (await res.json()) as { item: Bookmark };
      setRows((rs) => rs.map((r) => (r.id === b.id ? data.item : r)));
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'failed');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('remove bookmark?')) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/proxy/bookmarks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      setRows((rs) => rs.filter((r) => r.id !== id));
      toast.success('removed');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'delete failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="border border-[--color-border] rounded-md p-4 space-y-3">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>add bookmark
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
          <Field label="url" required>
            <Input
              type="url"
              value={draft.url}
              onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
              placeholder="https://…"
            />
          </Field>
          <Field label="title">
            <Input
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="(optional — falls back to url)"
            />
          </Field>
        </div>
        <Field label="commentary">
          <Input
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            placeholder="why is this worth saving?"
          />
        </Field>
        <div className="flex items-end gap-3">
          <Field label="tags" hint="comma separated" className="flex-1">
            <Input
              value={draft.tagsRaw}
              onChange={(e) =>
                setDraft((d) => ({ ...d, tagsRaw: e.target.value }))
              }
              placeholder="rust, essay"
            />
          </Field>
          <Button
            variant="primary"
            disabled={busy === '__new' || !draft.url.trim()}
            onClick={add}
          >
            {busy === '__new' ? <Spinner size={12} /> : <Plus size={12} />}
            add
          </Button>
        </div>
      </section>

      {rows.length === 0 ? (
        <p className="font-mono text-sm text-[--color-faint] text-center py-8">
          <span className="text-[--color-muted]">$</span> no bookmarks yet
        </p>
      ) : (
        <ul className="divide-y divide-[--color-border] border-y border-[--color-border]">
          {rows.map((b) => (
            <li key={b.id} className="py-3 flex items-center gap-3">
              <button
                onClick={() => toggleFav(b)}
                disabled={busy === b.id}
                className={`shrink-0 p-1 rounded transition-colors ${
                  b.is_favorite
                    ? 'text-[--color-accent]'
                    : 'text-[--color-faint] hover:text-[--color-accent]'
                }`}
                title="Toggle favorite"
              >
                <Star size={13} fill={b.is_favorite ? 'currentColor' : 'none'} />
              </button>
              <div className="flex-1 min-w-0">
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-[--color-fg] hover:text-[--color-accent] block truncate"
                >
                  {b.title || b.url}
                </a>
                <div className="font-mono text-xs text-[--color-faint] truncate">
                  {b.url}
                </div>
                {b.note && (
                  <div className="font-serif text-sm text-[--color-muted] italic mt-1">
                    {b.note}
                  </div>
                )}
              </div>
              <Button
                variant="danger"
                size="sm"
                disabled={busy === b.id}
                onClick={() => remove(b.id)}
              >
                {busy === b.id ? <Spinner size={11} /> : <Trash2 size={11} />}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
