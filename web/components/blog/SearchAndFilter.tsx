'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { TagChip } from './TagChip';
import { CategoryChip } from './CategoryChip';
import { BlogCard } from './BlogCard';
import { BlogTree } from './BlogTree';
import type { BlogSummary, Category, Tag } from '@/lib/types';

interface Props {
  items: BlogSummary[];
  tags: Tag[];
  categories: Category[];
  activeTag?: string;
  activeCategory?: string;
}

export function SearchAndFilter({
  items,
  tags,
  categories,
  activeTag,
  activeCategory,
}: Props) {
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

  const anyFilter = Boolean(q.trim() || activeTag || activeCategory);
  const activeCat = activeCategory
    ? categories.find((c) => c.slug === activeCategory)
    : undefined;
  const catById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

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

      {(activeTag || activeCategory) && (
        <div className="font-mono text-xs text-[--color-muted] flex items-center gap-2 flex-wrap">
          <span>
            <span className="text-[--color-faint]">$</span> filter:
          </span>
          {activeCat && (
            <CategoryChip
              category={activeCat}
              as="badge"
              active
            />
          )}
          {activeTag && (
            <span className="inline-flex items-center gap-1 font-mono text-xs px-2 h-6 rounded-md border border-[--color-accent] text-[--color-accent]">
              <span className="text-[--color-faint]">#</span>
              {activeTag}
            </span>
          )}
          <Link
            href="/blog"
            className="text-[--color-faint] hover:text-[--color-accent] transition-colors ml-1"
          >
            × clear
          </Link>
        </div>
      )}

      {categories.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[--color-faint]">
            categories
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                category={c}
                active={c.slug === activeCategory}
              />
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[--color-faint]">
            tags
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((t) => (
              <TagChip key={t.tag} tag={t.tag} active={t.tag === activeTag} />
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        {anyFilter ? (
          filtered.length === 0 ? (
            <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
              <span className="text-[--color-muted]">$</span> no results
            </p>
          ) : (
            <div>
              {filtered.map((b) => (
                <BlogCard
                  key={b.id}
                  blog={b}
                  category={b.category_id ? catById.get(b.category_id) : undefined}
                />
              ))}
            </div>
          )
        ) : items.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint] py-8 text-center">
            <span className="text-[--color-muted]">$</span> no posts yet
          </p>
        ) : (
          <BlogTree items={items} categories={categories} />
        )}
      </div>
    </div>
  );
}
