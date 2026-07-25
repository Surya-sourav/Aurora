import type {
  Personal,
  BlogDetail,
  BlogListResult,
  Bookmark,
  Career,
  Category,
  Note,
  Series,
  Tag,
} from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

type FetchOpts = {
  revalidate?: number | false;
  tags?: string[];
  cookieHeader?: string;
  cache?: RequestCache;
};

async function api<T>(
  path: string,
  opts: FetchOpts = {},
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (opts.cookieHeader) headers.set('Cookie', opts.cookieHeader);

  const nextOpts =
    opts.revalidate !== undefined || opts.tags
      ? {
          revalidate: opts.revalidate === false ? 0 : opts.revalidate,
          tags: opts.tags,
        }
      : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
    ...(nextOpts ? { next: nextOpts } : {}),
    ...(opts.cache ? { cache: opts.cache } : {}),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${path} — ${body}`);
  }
  return (await res.json()) as T;
}

export async function fetchPersonal() {
  const data = await api<{ success: true; personal: Personal }>('/personal', {
    revalidate: 60,
    tags: ['personal'],
  });
  return data.personal;
}

export async function fetchBlogList(params: {
  page?: number;
  tag?: string;
  category?: string;
  series?: string;
  search?: string;
  pageSize?: number;
} = {}) {
  const qp = new URLSearchParams();
  if (params.page) qp.set('page', String(params.page));
  if (params.tag) qp.set('tag', params.tag);
  if (params.category) qp.set('category', params.category);
  if (params.series) qp.set('series', params.series);
  if (params.search) qp.set('search', params.search);
  if (params.pageSize) qp.set('pageSize', String(params.pageSize));
  const qs = qp.toString() ? `?${qp}` : '';
  return api<BlogListResult>(`/blog${qs}`, {
    revalidate: 60,
    tags: ['blog'],
  });
}

export async function fetchCategories() {
  const data = await api<{ success: true; items: Category[] }>('/categories', {
    revalidate: 60,
    tags: ['categories'],
  });
  return data.items;
}

export async function fetchBlogBySlug(slug: string) {
  const data = await api<{ success: true; blog: BlogDetail }>(`/blog/${slug}`, {
    revalidate: 60,
    tags: ['blog', `blog:${slug}`],
  });
  return data.blog;
}

export async function fetchCareer() {
  const data = await api<{ success: true; items: Career[] }>('/career', {
    revalidate: 60,
    tags: ['career'],
  });
  return data.items;
}

export async function fetchTags() {
  const data = await api<{ success: true; tags: Tag[] }>('/tags', {
    revalidate: 300,
    tags: ['tags'],
  });
  return data.tags;
}

export async function fetchSeriesList() {
  const data = await api<{ success: true; items: Series[] }>('/series', {
    revalidate: 60,
    tags: ['series'],
  });
  return data.items;
}

export async function fetchSeriesBySlug(slug: string) {
  const data = await api<{
    success: true;
    series: Series;
    posts: BlogDetail[];
  }>(`/series/${slug}`, {
    revalidate: 60,
    tags: ['series', `series:${slug}`],
  });
  return data;
}

export async function fetchNotes() {
  const data = await api<{ success: true; items: Note[] }>('/notes', {
    revalidate: 60,
    tags: ['notes'],
  });
  return data.items;
}

export async function fetchNoteBySlug(slug: string) {
  const data = await api<{ success: true; item: Note }>(`/notes/${slug}`, {
    revalidate: 60,
    tags: ['notes', `note:${slug}`],
  });
  return data.item;
}

export async function fetchBookmarks() {
  const data = await api<{ success: true; items: Bookmark[] }>('/bookmarks', {
    revalidate: 60,
    tags: ['bookmarks'],
  });
  return data.items;
}

export const apiUrl = (path: string) => `${API_URL}${path}`;
