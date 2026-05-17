'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Eye, Save, Send, Trash2 } from 'lucide-react';
import type { BlogDetail } from '@/lib/types';

interface Props {
  initial?: BlogDetail;
  mode: 'create' | 'edit';
}

export function BlogEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState<'idle' | 'draft' | 'publish' | 'delete'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [form, setForm] = useState({
    heading: initial?.heading ?? '',
    subheading: initial?.subheading ?? '',
    body: initial?.body ?? '',
    excerpt: initial?.excerpt ?? '',
    signature: initial?.signature ?? '',
    tagsRaw: (initial?.tags ?? []).join(', '),
    slug: initial?.slug ?? '',
    is_published: initial?.is_published ?? false,
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

  const submit = async (publish: boolean) => {
    setSaving(publish ? 'publish' : 'draft');
    try {
      const payload = {
        heading: form.heading,
        subheading: form.subheading || undefined,
        body: form.body,
        excerpt: form.excerpt || undefined,
        signature: form.signature || undefined,
        tags: tags.length ? tags : undefined,
        slug: form.slug || undefined,
        is_published: publish,
      };
      const url =
        mode === 'create'
          ? '/api/admin/proxy/blog'
          : `/api/admin/proxy/blog/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      const data = (await res.json()) as { blog: BlogDetail };
      toast.success(publish ? 'published' : 'saved as draft');
      if (mode === 'create') {
        router.push(`/admin/blog/${data.blog.slug}/edit`);
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
    if (!confirm('delete this blog post permanently?')) return;
    setSaving('delete');
    try {
      const res = await fetch(`/api/admin/proxy/blog/${initial.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      toast.success('blog deleted');
      router.push('/admin/blog');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'delete failed');
    } finally {
      setSaving('idle');
    }
  };

  const onDropImage = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('alt_text', file.name);
    if (initial?.id) fd.append('blog_id', initial.id);
    const res = await fetch('/api/admin/proxy/images', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) {
      toast.error('upload failed');
      return;
    }
    const data = (await res.json()) as { image: { id: string; alt_text: string } };
    const md = `![${data.image.alt_text || ''}](/api/img/images/${data.image.id})`;
    insertAtCursor(textareaRef.current, md);
    set('body', textareaRef.current?.value ?? form.body);
    toast.success('image inserted');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void submit(form.is_published);
      }
      if (cmd && e.key === 'Enter') {
        e.preventDefault();
        void submit(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>
          {mode === 'create' ? 'new post' : 'edit post'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((p) => !p)}
          >
            <Eye size={12} />
            {showPreview ? 'hide preview' : 'preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={saving !== 'idle'}
            onClick={() => submit(false)}
          >
            {saving === 'draft' ? <Spinner size={12} /> : <Save size={12} />}
            save draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={saving !== 'idle'}
            onClick={() => submit(true)}
          >
            {saving === 'publish' ? <Spinner size={12} /> : <Send size={12} />}
            publish
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
          className="text-base"
          placeholder="the title of your post"
        />
      </Field>

      <Field label="subheading">
        <Input
          value={form.subheading}
          onChange={(e) => set('subheading', e.target.value)}
          placeholder="a short subtitle"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="slug" hint="auto-generated if empty">
          <Input
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="my-first-post"
          />
        </Field>
        <Field label="tags" hint="comma separated">
          <Input
            value={form.tagsRaw}
            onChange={(e) => set('tagsRaw', e.target.value)}
            placeholder="systems, rust, distributed"
          />
        </Field>
        <Field label="signature">
          <Input
            value={form.signature}
            onChange={(e) => set('signature', e.target.value)}
            placeholder="— surya, bangalore"
          />
        </Field>
      </div>

      <Field label="excerpt" hint="auto-derived from body if empty">
        <Textarea
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          rows={2}
        />
      </Field>

      <div
        className={`grid gap-4 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
      >
        <Field label="body · markdown" hint="drop images directly here">
          <Textarea
            ref={textareaRef}
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) void onDropImage(file);
            }}
            placeholder={`# my post\n\nwrite in **markdown**.\n\n\`\`\`ts\nconst x = 42;\n\`\`\``}
            className="min-h-[500px] font-mono text-sm leading-relaxed"
          />
        </Field>
        {showPreview && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[--color-muted]">
              <span className="text-[--color-faint]">$ </span>preview
            </span>
            <div className="mt-1.5 border border-[--color-border] rounded-md p-5 bg-[--color-bg] min-h-[500px] max-h-[700px] overflow-y-auto">
              <MarkdownRenderer>{form.body || '*nothing yet — start typing*'}</MarkdownRenderer>
            </div>
          </div>
        )}
      </div>

      <div className="font-mono text-xs text-[--color-faint] pt-2 border-t border-[--color-border]">
        ⌘+s save · ⌘+enter publish · drop images into body to insert
      </div>
    </div>
  );
}

function insertAtCursor(el: HTMLTextAreaElement | null, text: string) {
  if (!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const before = el.value.slice(0, start);
  const after = el.value.slice(end);
  el.value = `${before}\n\n${text}\n\n${after}`;
  const newPos = start + text.length + 4;
  el.setSelectionRange(newPos, newPos);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}
