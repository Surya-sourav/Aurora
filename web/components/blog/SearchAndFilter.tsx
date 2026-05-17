'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { TagChip } from './TagChip';
import { BlogCard } from './BlogCard';
import type { BlogSummary, Tag } from '@/lib/types';
import Link from 'next/link';

export function SearchAndFilter({
  items,
  tags,
  activeTag,
}: {
  items: BlogSummary[];
  tags: Tag[];
  activeTag?: string;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.filter(
      (b) =>
        b.heading.toLowerCase().includes(needle) ||
        b.excerpt.toLowerCase().includes(needle) ||
        b.tags.some((t) => t.toLowerCase().includes(needle)),
    );
  }, [items, q]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-faint]"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search this page..."
          className="pl-9"
        />
      </div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeTag && (
            <Link
              href="/blog"
              className="font-mono text-xs text-[--color-muted] hover:text-[--color-accent]"
            >
              × clear
            </Link>
          )}
          {tags.map((t) => (
            <TagChip key={t.tag} tag={t.tag} active={t.tag === activeTag} />
          ))}
        </div>
      )}
      <div>
        {filtered.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
            <span className="text-[--color-muted]">$</span> no results
          </p>
        ) : (
          filtered.map((b) => <BlogCard key={b.id} blog={b} />)
        )}
      </div>
    </div>
  );
}
