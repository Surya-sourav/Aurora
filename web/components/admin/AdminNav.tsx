'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/admin', label: 'dashboard' },
  { href: '/admin/portfolio', label: 'portfolio' },
  { href: '/admin/career', label: 'career' },
  { href: '/admin/blog', label: 'blogs' },
  { href: '/admin/notes', label: 'notes' },
  { href: '/admin/bookmarks', label: 'bookmarks' },
  { href: '/admin/categories', label: 'categories' },
  { href: '/admin/series', label: 'series' },
  { href: '/admin/analytics', label: 'analytics' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1 border-b border-[--color-border] overflow-x-auto">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'font-mono text-xs px-3 h-8 -mb-px inline-flex items-center border-b-2 transition-colors shrink-0',
              active
                ? 'border-[--color-accent] text-[--color-accent]'
                : 'border-transparent text-[--color-muted] hover:text-[--color-fg]',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
