'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Clock, Eye } from 'lucide-react';
import type { BlogSummary, Category } from '@/lib/types';

interface Props {
  items: BlogSummary[];
  categories: Category[];
}

const STORAGE_KEY = 'aurora:blog-tree-closed';

export function BlogTree({ items, categories }: Props) {
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setClosed(new Set(JSON.parse(stored)));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggle = (key: string) => {
    const next = new Set(closed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setClosed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      /* ignore */
    }
  };

  const groups = groupByCategory(items, categories);

  if (groups.length === 0) {
    return (
      <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
        <span className="text-[--color-muted]">$</span> nothing to show
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const isClosed = hydrated && closed.has(group.key);
        return (
          <section key={group.key}>
            <button
              type="button"
              onClick={() => toggle(group.key)}
              className="flex items-center gap-2 font-mono text-sm w-full text-left py-1 group"
              aria-expanded={!isClosed}
            >
              {isClosed ? (
                <ChevronRight
                  size={13}
                  className="text-[--color-faint] group-hover:text-[--color-accent]"
                />
              ) : (
                <ChevronDown size={13} className="text-[--color-accent]" />
              )}
              <span className="text-[--color-fg] group-hover:text-[--color-accent]">
                {group.label}
              </span>
              <span className="text-[--color-faint]">
                · {group.items.length}{' '}
                {group.items.length === 1 ? 'post' : 'posts'}
              </span>
            </button>
            {!isClosed && (
              <ul className="mt-2 ml-[6px] pl-4 border-l border-[--color-border] divide-y divide-[--color-border]/60">
                {group.items.map((b) => (
                  <TreeBlogRow key={b.id} blog={b} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function TreeBlogRow({ blog }: { blog: BlogSummary }) {
  const date = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : 'draft';
  return (
    <li>
      <Link
        href={`/blog/${blog.slug}`}
        className="flex items-baseline gap-3 py-2 group"
      >
        <span className="text-[--color-faint] text-xs shrink-0">▸</span>
        <span className="font-mono text-sm text-[--color-fg] group-hover:text-[--color-accent] flex-1 min-w-0 truncate transition-colors">
          {blog.heading}
        </span>
        <span className="hidden sm:inline-flex items-center gap-3 font-mono text-[10px] text-[--color-faint] shrink-0">
          <span>{date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={9} />
            {blog.reading_time_minutes}m
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye size={9} />
            {blog.view_count}
          </span>
        </span>
      </Link>
    </li>
  );
}

function groupByCategory(items: BlogSummary[], categories: Category[]) {
  const byId = new Map<string, BlogSummary[]>();
  const uncat: BlogSummary[] = [];
  for (const item of items) {
    if (item.category_id) {
      const list = byId.get(item.category_id) ?? [];
      list.push(item);
      byId.set(item.category_id, list);
    } else {
      uncat.push(item);
    }
  }
  const sortedCats = [...categories].sort(
    (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name),
  );
  const result: { key: string; label: string; items: BlogSummary[] }[] = [];
  for (const cat of sortedCats) {
    const list = byId.get(cat.id);
    if (list && list.length > 0) {
      result.push({ key: cat.slug, label: cat.name, items: list });
    }
  }
  if (uncat.length > 0) {
    result.push({ key: '_uncat', label: 'uncategorized', items: uncat });
  }
  return result;
}
