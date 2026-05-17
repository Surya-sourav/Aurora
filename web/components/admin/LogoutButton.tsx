'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1 font-mono text-xs text-[--color-muted] hover:text-[--color-danger] transition-colors"
    >
      <LogOut size={11} /> logout
    </button>
  );
}
