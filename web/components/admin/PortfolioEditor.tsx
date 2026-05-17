'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import { GalleryManager } from './GalleryManager';
import type { Personal } from '@/lib/types';

export function PortfolioEditor({ personal }: { personal: Personal }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: personal.name,
    email: personal.email,
    heading: personal.heading,
    sub_heading: personal.sub_heading,
    content: personal.content,
    information: personal.information,
    interests: personal.interests,
  });

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/proxy/personal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        <Field label="heading">
          <Input
            value={form.heading}
            onChange={(e) => set('heading', e.target.value)}
            placeholder="Hi, I'm ..."
          />
        </Field>
        <Field label="sub heading">
          <Input
            value={form.sub_heading}
            onChange={(e) => set('sub_heading', e.target.value)}
            placeholder="software engineer · ..."
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

      <div className="flex items-center gap-3 sticky bottom-4">
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
