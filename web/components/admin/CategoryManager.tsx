'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import type { Category } from '@/lib/types';

interface Props {
  initial: Category[];
}

interface DraftRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  sort_order: number;
  post_count: number;
  dirty: boolean;
}

function toDraft(c: Category): DraftRow {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    color: c.color ?? '',
    sort_order: c.sort_order ?? 0,
    post_count: c.post_count ?? 0,
    dirty: false,
  };
}

export function CategoryManager({ initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<DraftRow[]>(initial.map(toDraft));
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const patch = <K extends keyof DraftRow>(id: string, k: K, v: DraftRow[K]) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, [k]: v, dirty: true } : r)),
    );

  const save = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/proxy/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: row.name,
          slug: row.slug,
          description: row.description,
          color: row.color,
          sort_order: row.sort_order,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`save failed (${res.status})${body ? `: ${body.slice(0, 120)}` : ''}`);
      }
      const data = (await res.json()) as { item: Category };
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
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const label = row.post_count > 0
      ? `delete "${row.name}"? ${row.post_count} post(s) will become uncategorized.`
      : `delete "${row.name}"?`;
    if (!confirm(label)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/proxy/categories/${id}`, {
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
      const res = await fetch('/api/admin/proxy/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`add failed (${res.status})${body ? `: ${body.slice(0, 120)}` : ''}`);
      }
      const data = (await res.json()) as { item: Category };
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
            <span className="text-[--color-muted]">$</span> no categories yet · add one below
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="border border-[--color-border] rounded-md p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <Field label="name">
                  <Input
                    value={r.name}
                    onChange={(e) => patch(r.id, 'name', e.target.value)}
                  />
                </Field>
                <Field label="slug" hint="url-safe · used in /blog?category=...">
                  <Input
                    value={r.slug}
                    onChange={(e) => patch(r.id, 'slug', e.target.value)}
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
                    aria-label="Delete category"
                  >
                    <Trash2 size={11} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3">
                <Field label="description">
                  <Input
                    value={r.description}
                    onChange={(e) => patch(r.id, 'description', e.target.value)}
                    placeholder="short blurb (optional)"
                  />
                </Field>
                <Field label="accent color" hint="css color · e.g. oklch(0.7 0.2 200)">
                  <Input
                    value={r.color}
                    onChange={(e) => patch(r.id, 'color', e.target.value)}
                    placeholder="(default)"
                  />
                </Field>
                <Field label="sort order">
                  <Input
                    type="number"
                    value={r.sort_order}
                    onChange={(e) =>
                      patch(r.id, 'sort_order', parseInt(e.target.value, 10) || 0)
                    }
                  />
                </Field>
              </div>
              <div className="font-mono text-xs text-[--color-faint] pt-1 flex items-center gap-3">
                <GripVertical size={11} />
                <span>{r.post_count} post{r.post_count === 1 ? '' : 's'}</span>
                {r.dirty && (
                  <span className="text-[--color-accent]">· unsaved changes</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[--color-border] pt-4">
        <div className="flex items-end gap-3">
          <Field label="add new category" className="flex-1">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. tech · finance · philosophy"
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
