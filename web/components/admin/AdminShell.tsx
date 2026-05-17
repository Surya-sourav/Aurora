import Link from 'next/link';
import { Home } from 'lucide-react';
import { AdminNav } from './AdminNav';
import { LogoutButton } from './LogoutButton';

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[900px] px-6 py-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[--color-border]">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent] inline-flex items-center gap-1"
            >
              <Home size={11} /> back to site
            </Link>
            <span className="text-[--color-faint]">·</span>
            <span className="font-mono text-xs text-[--color-faint]">
              admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[--color-faint]">
              {email}
            </span>
            <LogoutButton />
          </div>
        </div>
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
