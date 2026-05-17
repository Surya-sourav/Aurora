import { BlogEditor } from '@/components/admin/BlogEditor';

export const dynamic = 'force-dynamic';

export default function NewBlogPage() {
  return <BlogEditor mode="create" />;
}
