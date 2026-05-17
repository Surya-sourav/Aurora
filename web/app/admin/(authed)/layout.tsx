import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect('/admin/login');
  return <AdminShell email={session.user.email}>{children}</AdminShell>;
}
