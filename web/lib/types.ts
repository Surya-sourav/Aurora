export interface PersonalImage {
  id: string;
  alt_text: string;
  sort_order: number;
  mime_type?: string;
  size_bytes?: number;
}

export interface Personal {
  id: string;
  name: string;
  email: string;
  heading: string;
  sub_heading: string;
  content: string;
  information: string;
  interests: string;
  portfolio_view_count: number;
  images: PersonalImage[];
  created_at: string;
  updated_at: string;
}

export interface BlogImage {
  id: string;
  alt_text: string;
  mime_type?: string;
}

export interface BlogSummary {
  id: string;
  slug: string;
  heading: string;
  subheading: string;
  excerpt: string;
  signature: string;
  tags: string[];
  reading_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogDetail extends BlogSummary {
  body: string;
  images: BlogImage[];
}

export interface BlogListResult {
  success: true;
  items: BlogSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Tag {
  tag: string;
  count: number;
}

export interface BlogTotals {
  total: number;
  published: number;
  drafts: number;
}
