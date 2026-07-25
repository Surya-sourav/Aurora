'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Spinner } from '@/components/ui/Spinner';
import type { Career } from '@/lib/types';

interface Props {
  initial?: Career;
  mode: 'create' | 'edit';
}

export function CareerEditor({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState<'idle' | 'save' | 'delete' | 'logo'>('idle');
  const [logoBust, setLogoBust] = useState(0);
  const [logoMime, setLogoMime] = useState(initial?.logo_mime ?? '');
  const [form, setForm] = useState({
    company_name: initial?.company_name ?? '',
    job_title: initial?.job_title ?? '',
    company_url: initial?.company_url ?? '',
    employment_type: initial?.employment_type ?? '',
    location: initial?.location ?? '',
    description: initial?.description ?? '',
    start_date: initial?.start_date ?? '',
    end_date: initial?.end_date ?? '',
    is_current: mode === 'edit' ? !initial?.end_date : false,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.company_name.trim() || !form.job_title.trim() || !form.start_date) {
      toast.error('company, title, and start date are required');
      return;
    }
    setSaving('save');
    try {
      const payload = {
        company_name: form.company_name,
        job_title: form.job_title,
        company_url: form.company_url || undefined,
        employment_type: form.employment_type || undefined,
        location: form.location || undefined,
        description: form.description || undefined,
        start_date: form.start_date,
        end_date: form.is_current ? null : form.end_date || null,
      };
      const url = mode === 'create'
        ? '/api/admin/proxy/career'
        : `/api/admin/proxy/career/${initial!.id}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`save failed (${res.status})${body ? `: ${body.slice(0, 200)}` : ''}`);
      }
      const data = (await res.json()) as { item: Career };
      toast.success('saved');
      if (mode === 'create') {
        router.push(`/admin/career/${data.item.id}/edit`);
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
    if (!confirm('delete this position permanently?')) return;
    setSaving('delete');
    try {
      const res = await fetch(`/api/admin/proxy/career/${initial.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      toast.success('deleted');
      router.push('/admin/career');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'delete failed');
    } finally {
      setSaving('idle');
    }
  };

  const uploadLogo = async (file: File) => {
    if (!initial) {
      toast.error('save the entry first, then upload a logo');
      return;
    }
    setSaving('logo');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/admin/proxy/career/${initial.id}/logo`, {
        method: 'PUT',
        body: fd,
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`logo upload failed (${res.status})${body ? `: ${body.slice(0, 200)}` : ''}`);
      }
      const data = (await res.json()) as { item: Career };
      setLogoMime(data.item.logo_mime);
      setLogoBust(Date.now());
      toast.success('logo uploaded');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'logo upload failed');
    } finally {
      setSaving('idle');
    }
  };

  const removeLogo = async () => {
    if (!initial) return;
    if (!confirm('remove logo?')) return;
    try {
      const res = await fetch(`/api/admin/proxy/career/${initial.id}/logo`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`failed (${res.status})`);
      setLogoMime('');
      setLogoBust(Date.now());
      toast.success('logo removed');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>
          {mode === 'create' ? 'new position' : 'edit position'}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" disabled={saving !== 'idle'} onClick={save}>
            {saving === 'save' ? <Spinner size={12} /> : <Save size={12} />}
            save
          </Button>
          {mode === 'edit' && (
            <Button variant="danger" size="sm" disabled={saving !== 'idle'} onClick={remove}>
              {saving === 'delete' ? <Spinner size={12} /> : <Trash2 size={12} />}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="job title" required>
          <Input
            value={form.job_title}
            onChange={(e) => set('job_title', e.target.value)}
            placeholder="Software Engineer"
          />
        </Field>
        <Field label="company" required>
          <Input
            value={form.company_name}
            onChange={(e) => set('company_name', e.target.value)}
            placeholder="Company Inc."
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="company URL" hint="optional — linkifies the company name">
          <Input
            value={form.company_url}
            onChange={(e) => set('company_url', e.target.value)}
            placeholder="https://company.com"
          />
        </Field>
        <Field label="employment type" hint="full-time · contract · internship ...">
          <Input
            value={form.employment_type}
            onChange={(e) => set('employment_type', e.target.value)}
            placeholder="full-time"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="start date" required>
          <Input
            type="date"
            value={form.start_date}
            onChange={(e) => set('start_date', e.target.value)}
          />
        </Field>
        <Field
          label="end date"
          hint={form.is_current ? 'marked as current' : 'blank if ongoing'}
        >
          <Input
            type="date"
            value={form.end_date}
            onChange={(e) => set('end_date', e.target.value)}
            disabled={form.is_current}
          />
        </Field>
        <Field label="location">
          <Input
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Bangalore"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 font-mono text-xs text-[--color-muted] cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_current}
          onChange={(e) => set('is_current', e.target.checked)}
          className="accent-[--color-accent]"
        />
        currently working here
      </label>

      <Field label="what you did · markdown" hint="bullet lists render nicely — ⌘/ctrl+s to save">
        <Textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={10}
          placeholder={'- Led migration from monolith to microservices\n- Shipped payments platform handling $2M/month\n- Mentored junior engineers'}
          className="font-mono text-sm"
        />
      </Field>

      <section className="space-y-3 pt-2 border-t border-[--color-border]">
        <h3 className="font-mono text-sm text-[--color-fg]">
          <span className="text-[--color-faint]">## </span>company logo
        </h3>
        {mode === 'edit' && initial ? (
          <div className="flex items-center gap-4">
            {logoMime ? (
              <div className="relative w-16 h-16 border border-[--color-border] rounded-md overflow-hidden bg-[--color-bg-elev]">
                <Image
                  src={`/api/img/career/${initial.id}/logo?v=${logoBust}`}
                  alt="logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 border border-dashed border-[--color-border] rounded-md flex items-center justify-center text-[--color-faint] font-mono text-xs">
                no logo
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 h-8 px-3 border border-[--color-border] rounded-md text-xs font-mono text-[--color-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors">
                  {saving === 'logo' ? <Spinner size={11} /> : null}
                  {logoMime ? 'replace' : 'upload'}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadLogo(f);
                    e.target.value = '';
                  }}
                />
              </label>
              {logoMime && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="font-mono text-xs text-[--color-danger] hover:underline text-left"
                >
                  remove logo
                </button>
              )}
              <p className="font-mono text-[10px] text-[--color-faint]">
                png · jpeg · webp · svg · max 2mb
              </p>
            </div>
          </div>
        ) : (
          <p className="font-mono text-xs text-[--color-faint]">
            save the entry first, then upload a logo
          </p>
        )}
      </section>
    </div>
  );
}
