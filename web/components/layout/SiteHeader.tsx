import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { CommandPaletteTrigger } from '@/components/command/CommandPaletteTrigger';

export function SiteHeader({ name = 'aurora' }: { name?: string }) {
  return (
    <header className="border-b border-[--color-border] bg-[--color-bg]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-[760px] px-6 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight hover:text-[--color-accent] transition-colors"
        >
          <span className="text-[--color-accent]">~</span>
          <span className="text-[--color-muted]">/</span>
          {name.toLowerCase().replace(/\s+/g, '-')}
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href="/blog">blog</NavLink>
          <NavLink href="/interests">interests</NavLink>
          <CommandPaletteTrigger />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-xs px-2 h-8 inline-flex items-center text-[--color-muted] hover:text-[--color-fg] transition-colors rounded-md"
    >
      {children}
    </Link>
  );
}
