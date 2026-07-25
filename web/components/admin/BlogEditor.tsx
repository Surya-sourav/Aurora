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
import { RevisionHistoryButton } from './RevisionHistoryButton';
import { SlashMenu } from './SlashMenu';
import { POST_TEMPLATES } from '@/lib/postTemplates';
import { Eye, History, Save, Send, Sparkles, Trash2 } from 'lucide-react';
import type { BlogDetail, Category, Series } from '@/lib/types';

interface Props {
  initial?: BlogDetail;
  mode: 'create' | 'edit';
  categories?: Category[];
  seriesList?: Series[];
}

interface FormState {
  heading: string;
  subheading: string;
  body: string;
  excerpt: string;
  signature: string;
  tagsRaw: string;
  slug: string;
  category_id: string;
  series_id: string;
  series_order: number;
  scheduled_publish_at: string;
  mastodon_post_url: string;
  is_published: boolean;
}

function draftKey(mode: 'create' | 'edit', id?: string) {
  return mode === 'create' ? 'aurora:draft:new' : `aurora:draft:${id ?? 'unknown'}`;
}

export function BlogEditor({
  initial,
  mode,
  categories = [],
  seriesList = [],
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState<'idle' | 'draft' | 'publish' | 'delete' | 'ai'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [restoredAt, setRestoredAt] = useState<string | null>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number } | null>(null);
  const [form, setForm] = useState<FormState>({
    heading: initial?.heading ?? '',
    subheading: initial?.subheading ?? '',
    body: initial?.body ?? '',
    excerpt: initial?.excerpt ?? '',
    signature: initial?.signature ?? '',
    tagsRaw: (initial?.tags ?? []).join(', '),
    slug: initial?.slug ?? '',
    category_id: initial?.category_id ?? '',
    series_id: initial?.series_id ?? '',
    series_order: initial?.series_order ?? 0,
    scheduled_publish_at: initial?.scheduled_publish_at
      ? initial.scheduled_publish_at.slice(0, 16)
      : '',
    mastodon_post_url: initial?.mastodon_post_url ?? '',
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

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Restore draft on mount
  useEffect(() => {
    const key = draftKey(mode, initial?.id);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { form: FormState; ts: number };
      if (mode === 'edit') {
        // only restore if newer than existing content
        const initialUpdated = initial?.updated_at
          ? new Date(initial.updated_at).getTime()
          : 0;
        if (parsed.ts <= initialUpdated) {
          localStorage.removeItem(key);
          return;
        }
      }
      if (parsed.form.body && parsed.form.body !== form.body) {
        setForm(parsed.form);
        setRestoredAt(new Date(parsed.ts).toLocaleTimeString());
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    const key = draftKey(mode, initial?.id);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ form, ts: Date.now() }),
        );
      } catch {
        /* ignore */
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form, mode, initial?.id]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey(mode, initial?.id));
    } catch {
      /* ignore */
    }
  };

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
        category_id: form.category_id || null,
        series_id: form.series_id || null,
        series_order: form.series_order,
        scheduled_publish_at: form.scheduled_publish_at
          ? new Date(form.scheduled_publish_at).toISOString()
          : null,
        mastodon_post_url: form.mastodon_post_url,
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
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(
          `save failed (${res.status})${body ? `: ${body.slice(0, 200)}` : ''}`,
        );
      }
      const data = (await res.json()) as { blog: BlogDetail };
      toast.success(publish ? 'published' : 'saved as draft');
      clearDraft();
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
      clearDraft();
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
    const data = (await res.json()) as {
      image: { id: string; alt_text: string };
    };
    const md = `![${data.image.alt_text || ''}](/api/img/images/${data.image.id})`;
    insertAtCursor(textareaRef.current, md);
    set('body', textareaRef.current?.value ?? form.body);
    toast.success('image inserted');
  };

  const suggestTags = async () => {
    if (!form.body.trim()) {
      toast.error('write something first');
      return;
    }
    setSaving('ai');
    try {
      const res = await fetch('/api/admin/proxy/ai/suggest-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading: form.heading, body: form.body }),
      });
      if (res.status === 501) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        toast.error(body.message ?? 'AI not configured');
        return;
      }
      if (!res.ok) throw new Error(`ai failed (${res.status})`);
      const data = (await res.json()) as { tags: string[] };
      const existing = tags;
      const merged = Array.from(new Set([...existing, ...data.tags])).slice(0, 10);
      set('tagsRaw', merged.join(', '));
      toast.success(`suggested ${data.tags.length} tags`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'ai failed');
    } finally {
      setSaving('idle');
    }
  };

  const applyTemplate = (key: string) => {
    const t = POST_TEMPLATES.find((x) => x.key === key);
    if (!t) return;
    if (form.body && !confirm('replace current body with template?')) return;
    setForm((f) => ({
      ...f,
      body: t.body,
      heading: t.heading ?? f.heading,
      tagsRaw: t.tags
        ? Array.from(new Set([...tags, ...t.tags])).join(', ')
        : f.tagsRaw,
    }));
    toast.success(`applied "${t.label}"`);
  };

  const insertMd = (before: string, after = '', placeholder = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const selected = el.value.slice(start, end) || placeholder;
    const text = `${before}${selected}${after}`;
    const newValue =
      el.value.slice(0, start) + text + el.value.slice(end);
    el.value = newValue;
    const newPos = start + before.length + selected.length;
    el.setSelectionRange(newPos, newPos);
    el.focus();
    set('body', newValue);
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

  // Slash-menu trigger: if user types "/" at start-of-line in textarea, show menu
  const onBodyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (e.key === '/') {
      const pos = el.selectionStart ?? 0;
      const prevChar = pos === 0 ? '\n' : el.value.charAt(pos - 1);
      if (prevChar === '\n' || pos === 0) {
        // capture caret position for absolute-positioned menu
        const rect = el.getBoundingClientRect();
        setSlashPos({ top: rect.top + 24, left: rect.left + 12 });
        setShowSlash(true);
      }
    }
    if (e.key === 'Escape') {
      setShowSlash(false);
    }
  };

  const applySlash = (cmd: string) => {
    setShowSlash(false);
    // remove the "/" that triggered
    const el = textareaRef.current;
    if (el) {
      const pos = el.selectionStart ?? 0;
      if (pos > 0 && el.value.charAt(pos - 1) === '/') {
        el.setSelectionRange(pos - 1, pos);
        insertMd('', '', '');
      }
    }
    switch (cmd) {
      case 'code':
        insertMd('```\n', '\n```\n', 'your code');
        break;
      case 'code-ts':
        insertMd('```ts\n', '\n```\n', 'const x = 42;');
        break;
      case 'callout-note':
        insertMd('> [!note]\n> ', '', 'something worth calling out');
        break;
      case 'callout-tip':
        insertMd('> [!tip]\n> ', '', 'a helpful tip');
        break;
      case 'callout-warn':
        insertMd('> [!warn]\n> ', '', 'careful with this');
        break;
      case 'callout-info':
        insertMd('> [!info]\n> ', '', 'context');
        break;
      case 'mermaid':
        insertMd(
          '```mermaid\ngraph LR\n  A[Start] --> B{Choice}\n  B -->|yes| C[Do it]\n  B -->|no| D[Skip]\n```\n',
          '',
        );
        break;
      case 'math':
        insertMd('$$\n', '\n$$\n', 'E = mc^2');
        break;
      case 'hr':
        insertMd('\n---\n', '', '');
        break;
      case 'todo':
        insertMd('- [ ] ', '', 'thing to do');
        break;
      case 'quote':
        insertMd('> ', '', 'quoted text');
        break;
      case 'wikilink':
        insertMd('[[', ']]', 'post-slug');
        break;
    }
  };

  return (
    <div className="space-y-4">
      {restoredAt && (
        <div className="font-mono text-xs px-3 py-2 border border-[--color-accent] rounded-md text-[--color-accent] bg-[--color-bg-elev] flex items-center justify-between gap-3">
          <span>
            <span className="text-[--color-faint]">$</span> restored autosaved draft
            from {restoredAt}
          </span>
          <button
            onClick={() => setRestoredAt(null)}
            className="text-[--color-faint] hover:text-[--color-fg]"
          >
            dismiss
          </button>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>
          {mode === 'create' ? 'new post' : 'edit post'}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            onChange={(e) => {
              if (e.target.value) {
                applyTemplate(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="h-8 rounded-md border border-[--color-border] bg-[--color-bg-elev] px-2 text-xs font-mono text-[--color-muted] focus:outline-none focus:border-[--color-accent]"
          >
            <option value="">📝 template…</option>
            {POST_TEMPLATES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          {mode === 'edit' && initial && (
            <RevisionHistoryButton
              blogId={initial.id}
              onRestore={(rev) => {
                setForm((f) => ({
                  ...f,
                  heading: rev.heading,
                  subheading: rev.subheading,
                  body: rev.body,
                  excerpt: rev.excerpt,
                  tagsRaw: rev.tags.join(', '),
                }));
                toast.success('restored revision');
              }}
            />
          )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="category" hint="manage in admin › categories">
          <select
            value={form.category_id ?? ''}
            onChange={(e) => set('category_id', e.target.value)}
            className="h-9 w-full rounded-md border border-[--color-border] bg-[--color-bg-elev] px-3 text-sm font-mono text-[--color-fg] focus:outline-none focus:border-[--color-accent]"
          >
            <option value="">— uncategorized —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="slug" hint="auto-generated if empty">
          <Input
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="my-first-post"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="series" hint="manage in admin › series">
          <select
            value={form.series_id ?? ''}
            onChange={(e) => set('series_id', e.target.value)}
            className="h-9 w-full rounded-md border border-[--color-border] bg-[--color-bg-elev] px-3 text-sm font-mono text-[--color-fg] focus:outline-none focus:border-[--color-accent]"
          >
            <option value="">— none —</option>
            {seriesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="series order" hint="lower = earlier">
          <Input
            type="number"
            value={form.series_order}
            onChange={(e) =>
              set('series_order', parseInt(e.target.value, 10) || 0)
            }
            disabled={!form.series_id}
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

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <Field label="tags" hint="comma separated">
          <Input
            value={form.tagsRaw}
            onChange={(e) => set('tagsRaw', e.target.value)}
            placeholder="systems, rust, distributed"
          />
        </Field>
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            disabled={saving !== 'idle'}
            onClick={suggestTags}
            title="Suggest tags via Claude (needs ANTHROPIC_API_KEY on backend)"
          >
            {saving === 'ai' ? (
              <Spinner size={12} />
            ) : (
              <Sparkles size={12} />
            )}
            suggest
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="schedule publish"
          hint="leave blank to publish immediately when clicking publish"
        >
          <Input
            type="datetime-local"
            value={form.scheduled_publish_at}
            onChange={(e) => set('scheduled_publish_at', e.target.value)}
            disabled={form.is_published}
          />
        </Field>
        <Field label="mastodon status URL" hint="paste after posting the link on mastodon to embed replies">
          <Input
            value={form.mastodon_post_url}
            onChange={(e) => set('mastodon_post_url', e.target.value)}
            placeholder="https://mastodon.social/@you/1234"
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
        <Field
          label="body · markdown"
          hint="type / at line-start for slash commands · drop images"
        >
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={form.body}
              onChange={(e) => set('body', e.target.value)}
              onKeyDown={onBodyKeyDown}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) void onDropImage(file);
              }}
              placeholder={`# my post\n\nwrite in **markdown**.\n\ntype "/" at the start of a line for slash commands.\n\n\`\`\`ts\nconst x = 42;\n\`\`\``}
              className="min-h-[500px] font-mono text-sm leading-relaxed"
            />
            {showSlash && slashPos && (
              <SlashMenu
                onSelect={applySlash}
                onDismiss={() => setShowSlash(false)}
              />
            )}
          </div>
        </Field>
        {showPreview && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[--color-muted]">
              <span className="text-[--color-faint]">$ </span>preview
            </span>
            <div className="mt-1.5 border border-[--color-border] rounded-md p-5 bg-[--color-bg] min-h-[500px] max-h-[700px] overflow-y-auto">
              <MarkdownRenderer>
                {form.body || '*nothing yet — start typing*'}
              </MarkdownRenderer>
            </div>
          </div>
        )}
      </div>

      <div className="font-mono text-xs text-[--color-faint] pt-2 border-t border-[--color-border] flex items-center gap-3 flex-wrap">
        <span>⌘+s save · ⌘+enter publish</span>
        <span>·</span>
        <span>autosave to browser · drop images · type "/" for commands</span>
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
