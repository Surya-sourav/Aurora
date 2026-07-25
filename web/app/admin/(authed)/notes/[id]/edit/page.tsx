import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { NoteEditor } from '@/components/admin/NoteEditor';
import type { Note } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchOne(id: string): Promise<Note | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return null;
  try {
    // notes are fetched by slug; list all and filter
    const res = await fetch(`${API_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { items: Note[] };
    return data.items.find((n) => n.id === id) ?? null;
  } catch {
    return null;
  }
}

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await fetchOne(id);
  if (!note) notFound();
  return <NoteEditor mode="edit" initial={note} />;
}
