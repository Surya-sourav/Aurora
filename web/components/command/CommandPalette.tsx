'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Command } from 'cmdk';
import {
  BookOpen,
  Bookmark as BookmarkIcon,
  Briefcase,
  FileText,
  Home,
  Lightbulb,
  LogIn,
  Moon,
  Search,
  StickyNote,
  Sun,
  Terminal,
} from 'lucide-react';
import type { BlogSummary, Note } from '@/lib/types';

interface Props {
  blogs?: BlogSummary[];
  notes?: Note[];
}

export function CommandPalette({ blogs = [], notes = [] }: Props) {
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
    const openIt = () => setOpen(true);
    window.addEventListener('aurora:open-palette', openIt);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('aurora:open-palette', openIt);
    };
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
            placeholder="type a command or search posts/notes..."
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
            <Item icon={<StickyNote size={13} />} onSelect={() => go('/notes')}>
              notes
            </Item>
            <Item icon={<Briefcase size={13} />} onSelect={() => go('/career')}>
              career
            </Item>
            <Item
              icon={<BookmarkIcon size={13} />}
              onSelect={() => go('/bookmarks')}
            >
              bookmarks
            </Item>
            <Item icon={<Lightbulb size={13} />} onSelect={() => go('/interests')}>
              interests
            </Item>
            <Item icon={<FileText size={13} />} onSelect={() => go('/uses')}>
              /uses · dev setup
            </Item>
            <Item icon={<FileText size={13} />} onSelect={() => go('/now')}>
              /now · current focus
            </Item>
            <Item icon={<LogIn size={13} />} onSelect={() => go('/admin')}>
              admin
            </Item>
          </Command.Group>

          {blogs.length > 0 && (
            <Command.Group
              heading="blog posts"
              className="text-xs font-mono text-[--color-faint] px-2 pt-3 pb-1"
            >
              {blogs.map((b) => (
                <Item
                  key={b.id}
                  icon={<BookOpen size={13} />}
                  onSelect={() => go(`/blog/${b.slug}`)}
                >
                  {b.heading}
                </Item>
              ))}
            </Command.Group>
          )}

          {notes.length > 0 && (
            <Command.Group
              heading="notes"
              className="text-xs font-mono text-[--color-faint] px-2 pt-3 pb-1"
            >
              {notes.map((n) => (
                <Item
                  key={n.id}
                  icon={<StickyNote size={13} />}
                  onSelect={() => go(`/notes/${n.slug}`)}
                >
                  {n.heading}
                </Item>
              ))}
            </Command.Group>
          )}

          <Command.Group
            heading="actions"
            className="text-xs font-mono text-[--color-faint] px-2 pt-3 pb-1"
          >
            <Item
              icon={
                resolvedTheme === 'dark' ? <Sun size={13} /> : <Moon size={13} />
              }
              onSelect={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                setOpen(false);
              }}
            >
              toggle theme · current: {resolvedTheme}
            </Item>
            <Item
              icon={<Terminal size={13} />}
              onSelect={() => {
                setOpen(false);
                window.dispatchEvent(new CustomEvent('aurora:open-terminal'));
              }}
            >
              open terminal · `
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
      <span className="flex-1 min-w-0 truncate">{children}</span>
    </Command.Item>
  );
}

function isTyping() {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}
