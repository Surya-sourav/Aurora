'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import type { Series } from '@/lib/types';

interface DraftRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  dirty: boolean;
}

function toDraft(s: Series): DraftRow {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description ?? '',
    sort_order: s.sort_order ?? 0,
    dirty: false,
  };
}

export function SeriesManager({ initial }: { initial: Series[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<DraftRow[]>(initial.map(toDraft));
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const patch = <K extends keyof DraftRow>(
    id: string,
    k: K,
    v: DraftRow[K],
  ) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, [k]: v, dirty: true } : r)),
    );

  const save = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/proxy/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: row.name,
          slug: row.slug,
          description: row.description,
          sort_order: row.sort_order,
        }),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      const data = (await res.json()) as { item: Series };
      setRows((rs) => rs.map((r) => (r.id === id ? toDraft(data.item) : r)));
      toast.success('saved');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'save failed');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('delete this series? blogs will keep their content, but lose the series link.'))
      return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/proxy/series/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      setRows((rs) => rs.filter((r) => r.id !== id));
      toast.success('deleted');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'delete failed');
    } finally {
      setBusy(null);
    }
  };

  const add = async () => {
    const name = newName.trim();
    if (!name) return;
    setBusy('__new');
    try {
      const res = await fetch('/api/admin/proxy/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(`add failed (${res.status})`);
      const data = (await res.json()) as { item: Series };
      setRows((rs) => [...rs, toDraft(data.item)]);
      setNewName('');
      toast.success('created');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'add failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] text-center py-8">
            <span className="text-[--color-muted]">$</span> no series yet · add one below
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="border border-[--color-border] rounded-md p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3">
                <Field label="name">
                  <Input
                    value={r.name}
                    onChange={(e) => patch(r.id, 'name', e.target.value)}
                  />
                </Field>
                <Field label="slug">
                  <Input
                    value={r.slug}
                    onChange={(e) => patch(r.id, 'slug', e.target.value)}
                  />
                </Field>
                <Field label="order">
                  <Input
                    type="number"
                    value={r.sort_order}
                    onChange={(e) =>
                      patch(r.id, 'sort_order', parseInt(e.target.value, 10) || 0)
                    }
                    className="w-20"
                  />
                </Field>
                <div className="flex items-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={busy === r.id || !r.dirty}
                    onClick={() => save(r.id)}
                  >
                    {busy === r.id ? <Spinner size={11} /> : null}
                    save
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() => remove(r.id)}
                  >
                    <Trash2 size={11} />
                  </Button>
                </div>
              </div>
              <Field label="description · markdown">
                <Textarea
                  value={r.description}
                  onChange={(e) => patch(r.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="what's the series about?"
                />
              </Field>
              {r.dirty && (
                <div className="font-mono text-xs text-[--color-accent]">
                  · unsaved changes
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[--color-border] pt-4">
        <div className="flex items-end gap-3">
          <Field label="add new series" className="flex-1">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Building a JIT Compiler"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void add();
                }
              }}
            />
          </Field>
          <Button
            variant="primary"
            disabled={busy === '__new' || !newName.trim()}
            onClick={add}
          >
            {busy === '__new' ? <Spinner size={12} /> : <Plus size={12} />}
            add
          </Button>
        </div>
      </div>
    </div>
  );
}
