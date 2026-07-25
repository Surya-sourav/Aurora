import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import { CategoryManager } from '@/components/admin/CategoryManager';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAdminCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Category[] };
    return data.items;
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const items = await fetchAdminCategories();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-lg">
          <span className="text-[--color-faint]">## </span>categories
        </h2>
        <p className="font-mono text-xs text-[--color-faint] mt-1">
          group blogs into buckets like tech · finance · philosophy · they show up as a collapsible tree on /blog
        </p>
      </div>
      <CategoryManager initial={items} />
    </div>
  );
}
