import { NoteEditor } from '@/components/admin/NoteEditor';

export const dynamic = 'force-dynamic';

export default function NewNotePage() {
  return <NoteEditor mode="create" />;
}
