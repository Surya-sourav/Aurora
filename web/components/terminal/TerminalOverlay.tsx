'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Line {
  kind: 'input' | 'output' | 'error' | 'link';
  text: string;
  href?: string;
}

const HELP_TEXT = [
  'available commands:',
  '  ls          — list sections',
  '  cd <path>   — go to /blog, /notes, /career, ~ (home), etc.',
  '  cat <slug>  — open a blog post',
  '  find <q>    — search blog titles',
  '  whoami      — about the site',
  '  uptime      — nostalgia',
  '  clear       — clear the terminal',
  '  exit        — close (or press backtick again)',
  '  help        — this list',
];

interface BlogHit {
  slug: string;
  heading: string;
}

export function TerminalOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<BlogHit[]>([]);

  useEffect(() => {
    const openIt = () => {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 20);
      if (history.length === 0) {
        setHistory([
          { kind: 'output', text: 'aurora shell v1 · type "help" for commands · esc or ` to exit' },
        ]);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '`') return;
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setOpen((o) => !o);
      if (!open) {
        setTimeout(() => inputRef.current?.focus(), 20);
        if (history.length === 0) {
          setHistory([
            { kind: 'output', text: 'aurora shell v1 · type "help" for commands · esc or ` to exit' },
          ]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('aurora:open-terminal', openIt);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('aurora:open-terminal', openIt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // lazy-fetch blog list on first open
  useEffect(() => {
    if (!open || blogs.length > 0) return;
    fetch('/api/img/blog?pageSize=50', { cache: 'no-store' })
      .catch(() => null)
      .then(() =>
        fetch(
          (process.env.NEXT_PUBLIC_API_URL ?? '') + '/blog?pageSize=50',
          { cache: 'no-store' },
        ),
      )
      .then((r) => (r && r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items) {
          setBlogs(
            data.items.map((b: { slug: string; heading: string }) => ({
              slug: b.slug,
              heading: b.heading,
            })),
          );
        }
      })
      .catch(() => undefined);
  }, [open, blogs.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const push = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) {
      push([{ kind: 'input', text: '$ ' }]);
      return;
    }
    setPast((p) => [...p, cmd]);
    setPastIdx(-1);
    push([{ kind: 'input', text: `$ ${cmd}` }]);
    const [verb, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');

    switch (verb.toLowerCase()) {
      case 'help':
        push(HELP_TEXT.map((t) => ({ kind: 'output', text: t })));
        break;
      case 'ls': {
        push([
          { kind: 'output', text: 'drwxr-xr-x  ~/            (home)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/blog        (writing)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/notes       (short-form)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/career      (timeline)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/interests   (things i think about)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/bookmarks   (link log)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/uses        (dev setup)' },
          { kind: 'output', text: 'drwxr-xr-x  ~/now         (current focus)' },
        ]);
        break;
      }
      case 'cd': {
        const target = arg.replace(/^~/, '').replace(/^\//, '');
        const map: Record<string, string> = {
          '': '/',
          home: '/',
          blog: '/blog',
          notes: '/notes',
          career: '/career',
          interests: '/interests',
          bookmarks: '/bookmarks',
          uses: '/uses',
          now: '/now',
          admin: '/admin',
        };
        const dest = map[target.toLowerCase()];
        if (dest) {
          push([{ kind: 'output', text: `→ ${dest}` }]);
          setOpen(false);
          router.push(dest);
        } else {
          push([{ kind: 'error', text: `cd: no such directory: ${arg}` }]);
        }
        break;
      }
      case 'cat': {
        if (!arg) {
          push([{ kind: 'error', text: 'cat: missing operand' }]);
          break;
        }
        push([{ kind: 'output', text: `→ /blog/${arg}` }]);
        setOpen(false);
        router.push(`/blog/${arg}`);
        break;
      }
      case 'find': {
        if (!arg) {
          push([{ kind: 'error', text: 'find: usage — find <query>' }]);
          break;
        }
        const needle = arg.toLowerCase();
        const hits = blogs
          .filter((b) => b.heading.toLowerCase().includes(needle))
          .slice(0, 10);
        if (hits.length === 0) {
          push([{ kind: 'output', text: 'no matches' }]);
        } else {
          push(
            hits.map((h) => ({
              kind: 'link',
              text: `  ▸ ${h.heading}`,
              href: `/blog/${h.slug}`,
            })),
          );
        }
        break;
      }
      case 'whoami': {
        push([
          { kind: 'output', text: 'aurora · personal portfolio & tech blog' },
          { kind: 'output', text: 'built with nestjs + next.js · deployed on the internet' },
        ]);
        break;
      }
      case 'uptime': {
        push([
          {
            kind: 'output',
            text: `up ${Math.floor(performance.now() / 1000)}s in this tab · still curious`,
          },
        ]);
        break;
      }
      case 'clear': {
        setHistory([]);
        break;
      }
      case 'exit': {
        setOpen(false);
        break;
      }
      case 'sudo': {
        push([{ kind: 'error', text: `${cmd}: nice try` }]);
        break;
      }
      default:
        push([{ kind: 'error', text: `${verb}: command not found · try "help"` }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(value);
      setValue('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (past.length === 0) return;
      const nextIdx = pastIdx === -1 ? past.length - 1 : Math.max(0, pastIdx - 1);
      setPastIdx(nextIdx);
      setValue(past[nextIdx] ?? '');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (pastIdx === -1) return;
      const nextIdx = pastIdx + 1;
      if (nextIdx >= past.length) {
        setPastIdx(-1);
        setValue('');
      } else {
        setPastIdx(nextIdx);
        setValue(past[nextIdx] ?? '');
      }
      return;
    }
    if (e.key === '`') {
      e.preventDefault();
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4">
      <div
        className="w-full max-w-2xl bg-[--color-bg] border border-[--color-accent] rounded-md shadow-2xl overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 px-3 h-7 border-b border-[--color-border] bg-[--color-bg-elev]">
          <span className="w-2.5 h-2.5 rounded-full bg-[--color-danger]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[--color-muted]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[--color-accent]" />
          <span className="font-mono text-[10px] text-[--color-faint] ml-2">
            aurora — bash — press ` or esc to close
          </span>
        </div>
        <div
          ref={scrollRef}
          className="max-h-[60vh] overflow-y-auto p-3 font-mono text-sm leading-relaxed"
        >
          {history.map((line, i) => {
            if (line.kind === 'link' && line.href) {
              return (
                <div key={i}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push(line.href!);
                    }}
                    className="text-[--color-accent] hover:underline text-left"
                  >
                    {line.text}
                  </button>
                </div>
              );
            }
            return (
              <div
                key={i}
                className={
                  line.kind === 'error'
                    ? 'text-[--color-danger]'
                    : line.kind === 'input'
                      ? 'text-[--color-fg]'
                      : 'text-[--color-muted]'
                }
              >
                {line.text}
              </div>
            );
          })}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[--color-accent]">$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent outline-none text-[--color-fg] font-mono text-sm caret-[--color-accent]"
              aria-label="terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
