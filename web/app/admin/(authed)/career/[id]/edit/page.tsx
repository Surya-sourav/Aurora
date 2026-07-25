import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { CareerEditor } from '@/components/admin/CareerEditor';
import type { Career } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchOne(id: string): Promise<Career | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/career/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { item: Career };
    return data.item;
  } catch {
    return null;
  }
}

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await fetchOne(id);
  if (!item) notFound();
  return <CareerEditor mode="edit" initial={item} />;
}
