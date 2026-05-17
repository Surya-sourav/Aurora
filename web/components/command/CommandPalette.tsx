'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Command } from 'cmdk';
import { Home, BookOpen, Lightbulb, Moon, Sun, LogIn, Search } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === '/' && !isTyping()) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('aurora:open-palette', () => setOpen(true));
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
    >
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg mx-4 bg-[--color-bg] border border-[--color-border] rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b border-[--color-border]">
          <Search size={14} className="text-[--color-faint]" />
          <Command.Input
            placeholder="type a command or search..."
            className="w-full h-11 bg-transparent font-mono text-sm text-[--color-fg] placeholder:text-[--color-faint] outline-none"
          />
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="p-4 text-sm font-mono text-[--color-faint] text-center">
            no matches
          </Command.Empty>
          <Command.Group
            heading="navigate"
            className="text-xs font-mono text-[--color-faint] px-2 pt-2 pb-1"
          >
            <Item icon={<Home size={13} />} onSelect={() => go('/')}>
              home
            </Item>
            <Item icon={<BookOpen size={13} />} onSelect={() => go('/blog')}>
              blog
            </Item>
            <Item icon={<Lightbulb size={13} />} onSelect={() => go('/interests')}>
              interests
            </Item>
            <Item icon={<LogIn size={13} />} onSelect={() => go('/admin')}>
              admin
            </Item>
          </Command.Group>
          <Command.Group
            heading="theme"
            className="text-xs font-mono text-[--color-faint] px-2 pt-3 pb-1"
          >
            <Item
              icon={resolvedTheme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              onSelect={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                setOpen(false);
              }}
            >
              toggle theme · current: {resolvedTheme}
            </Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}

function Item({
  icon,
  onSelect,
  children,
}: {
  icon: React.ReactNode;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 h-9 rounded-md font-mono text-sm text-[--color-fg] cursor-pointer data-[selected=true]:bg-[--color-bg-elev] data-[selected=true]:text-[--color-accent]"
    >
      <span className="text-[--color-faint]">{icon}</span>
      <span>{children}</span>
    </Command.Item>
  );
}

function isTyping() {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}
