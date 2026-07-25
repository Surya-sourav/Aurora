import { BlogEditor } from '@/components/admin/BlogEditor';
import { fetchCategories, fetchSeriesList } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function NewBlogPage() {
  const [categories, seriesList] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchSeriesList().catch(() => []),
  ]);
  return (
    <BlogEditor mode="create" categories={categories} seriesList={seriesList} />
  );
}
