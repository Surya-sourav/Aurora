'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import { GalleryManager } from './GalleryManager';
import type { Personal, Socials } from '@/lib/types';

export function PortfolioEditor({ personal }: { personal: Personal }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: personal.name,
    email: personal.email,
    heading: personal.heading,
    sub_heading: personal.sub_heading,
    location: personal.location ?? '',
    availability: personal.availability ?? '',
    now_doing: personal.now_doing ?? '',
    stackRaw: (personal.stack ?? []).join(', '),
    socials: (personal.socials ?? {}) as Socials,
    content: personal.content,
    information: personal.information,
    interests: personal.interests,
  });

  const stack = useMemo(
    () =>
      form.stackRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [form.stackRaw],
  );

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        heading: form.heading,
        sub_heading: form.sub_heading,
        location: form.location,
        availability: form.availability,
        now_doing: form.now_doing,
        stack,
        socials: form.socials,
        content: form.content,
        information: form.information,
        interests: form.interests,
      };
      const res = await fetch('/api/admin/proxy/personal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      toast.success('portfolio saved');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setSocial = (k: keyof Socials, v: string) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="name">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
        </div>
        <Field label="tagline (heading)" hint="quoted on the landing — your elevator pitch">
          <Input
            value={form.heading}
            onChange={(e) => set('heading', e.target.value)}
            placeholder="building reliable systems & writing about them"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="role (sub heading)">
            <Input
              value={form.sub_heading}
              onChange={(e) => set('sub_heading', e.target.value)}
              placeholder="software engineer"
            />
          </Field>
          <Field label="location">
            <Input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="bangalore"
            />
          </Field>
          <Field label="availability">
            <Input
              value={form.availability}
              onChange={(e) => set('availability', e.target.value)}
              placeholder="open to collaboration"
            />
          </Field>
        </div>
        <Field label="stack" hint="comma separated · shown as chips">
          <Input
            value={form.stackRaw}
            onChange={(e) => set('stackRaw', e.target.value)}
            placeholder="typescript, postgres, rust"
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>socials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="github" hint="username or full URL">
            <Input
              value={form.socials.github ?? ''}
              onChange={(e) => setSocial('github', e.target.value)}
              placeholder="@your-handle"
            />
          </Field>
          <Field label="twitter / X" hint="username or full URL">
            <Input
              value={form.socials.twitter ?? ''}
              onChange={(e) => setSocial('twitter', e.target.value)}
              placeholder="@your-handle"
            />
          </Field>
          <Field label="linkedin" hint="username or full URL">
            <Input
              value={form.socials.linkedin ?? ''}
              onChange={(e) => setSocial('linkedin', e.target.value)}
              placeholder="your-handle"
            />
          </Field>
          <Field label="personal site / portfolio">
            <Input
              value={form.socials.website ?? ''}
              onChange={(e) => setSocial('website', e.target.value)}
              placeholder="https://your-site.com"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>now
        </h3>
        <Field label="currently working on" hint="markdown · short">
          <Textarea
            value={form.now_doing}
            onChange={(e) => set('now_doing', e.target.value)}
            rows={4}
            placeholder={'building Aurora — a portfolio + blog platform.\\n\\nreading: SICP'}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>bio · content (markdown)
        </h3>
        <Field label="content">
          <Textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            rows={10}
          />
        </Field>
        <Field label="information">
          <Textarea
            value={form.information}
            onChange={(e) => set('information', e.target.value)}
            rows={6}
          />
        </Field>
        <Field label="interests">
          <Textarea
            value={form.interests}
            onChange={(e) => set('interests', e.target.value)}
            rows={8}
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>gallery
        </h3>
        <GalleryManager initial={personal.images ?? []} />
      </section>

      <div className="flex items-center gap-3 sticky bottom-4 bg-[--color-bg] py-2">
        <Button onClick={save} disabled={saving} variant="primary">
          {saving ? <Spinner size={12} /> : null}
          save changes
        </Button>
        <span className="font-mono text-xs text-[--color-faint]">
          views: <span className="text-[--color-accent]">{personal.portfolio_view_count.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
