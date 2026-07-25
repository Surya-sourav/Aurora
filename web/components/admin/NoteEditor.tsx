'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import type { Note } from '@/lib/types';

interface Props {
  initial?: Note;
  mode: 'create' | 'edit';
}

export function NoteEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState<'idle' | 'save' | 'delete'>('idle');
  const [form, setForm] = useState({
    heading: initial?.heading ?? '',
    body: initial?.body ?? '',
    slug: initial?.slug ?? '',
    tagsRaw: (initial?.tags ?? []).join(', '),
  });
  const tags = useMemo(
    () =>
      form.tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [form.tagsRaw],
  );
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.heading.trim() || !form.body.trim()) {
      toast.error('heading and body are required');
      return;
    }
    setSaving('save');
    try {
      const payload = {
        heading: form.heading,
        body: form.body,
        slug: form.slug || undefined,
        tags: tags.length ? tags : undefined,
      };
      const url =
        mode === 'create'
          ? '/api/admin/proxy/notes'
          : `/api/admin/proxy/notes/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      const data = (await res.json()) as { item: Note };
      toast.success('saved');
      if (mode === 'create') {
        router.push(`/admin/notes/${data.item.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'save failed');
    } finally {
      setSaving('idle');
    }
  };

  const remove = async () => {
    if (!initial) return;
    if (!confirm('delete this note permanently?')) return;
    setSaving('delete');
    try {
      const res = await fetch(`/api/admin/proxy/notes/${initial.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      toast.success('deleted');
      router.push('/admin/notes');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'delete failed');
    } finally {
      setSaving('idle');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>
          {mode === 'create' ? 'new note' : 'edit note'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={saving !== 'idle'}
            onClick={save}
          >
            {saving === 'save' ? <Spinner size={12} /> : <Save size={12} />}
            save
          </Button>
          {mode === 'edit' && (
            <Button
              variant="danger"
              size="sm"
              disabled={saving !== 'idle'}
              onClick={remove}
            >
              {saving === 'delete' ? <Spinner size={12} /> : <Trash2 size={12} />}
            </Button>
          )}
        </div>
      </div>

      <Field label="heading" required>
        <Input
          value={form.heading}
          onChange={(e) => set('heading', e.target.value)}
          placeholder="a short title"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="slug" hint="auto-generated if empty">
          <Input
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="til-postgres-not-in-null"
          />
        </Field>
        <Field label="tags" hint="comma separated">
          <Input
            value={form.tagsRaw}
            onChange={(e) => set('tagsRaw', e.target.value)}
            placeholder="til, postgres"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="body · markdown">
          <Textarea
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            rows={16}
            className="font-mono text-sm"
            placeholder={'a short-form note or TIL.\n\nsupports **markdown**, `code`, callouts, and math.'}
          />
        </Field>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[--color-muted]">
            <span className="text-[--color-faint]">$ </span>preview
          </span>
          <div className="mt-1.5 border border-[--color-border] rounded-md p-4 bg-[--color-bg] min-h-[380px] max-h-[520px] overflow-y-auto">
            <MarkdownRenderer>
              {form.body || '*nothing yet*'}
            </MarkdownRenderer>
          </div>
        </div>
      </div>
    </div>
  );
}
