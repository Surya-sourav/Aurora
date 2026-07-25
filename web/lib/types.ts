export interface PersonalImage {
  id: string;
  alt_text: string;
  sort_order: number;
  mime_type?: string;
  size_bytes?: number;
}

export interface Socials {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  mastodon?: string;
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
  uses_page: string;
  now_page: string;
  location: string;
  availability: string;
  now_doing: string;
  socials: Socials;
  stack: string[];
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
  category_id: string | null;
  series_id: string | null;
  series_order: number;
  scheduled_publish_at: string | null;
  mastodon_post_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  sort_order: number;
  post_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  slug: string;
  heading: string;
  body: string;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface BlogRevision {
  id: string;
  blog_id: string;
  heading: string;
  subheading: string;
  body: string;
  excerpt: string;
  tags: string[];
  created_at: string;
}

export interface AnalyticsSummary {
  portfolio_views: number;
  total_blog_views: number;
  total_note_views: number;
  total_blogs: number;
  published_blogs: number;
  draft_blogs: number;
  total_notes: number;
  top_posts: {
    id: string;
    slug: string;
    heading: string;
    view_count: number;
    published_at: string | null;
  }[];
  recent_drafts: {
    id: string;
    slug: string;
    heading: string;
    updated_at: string;
  }[];
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

export interface Career {
  id: string;
  company_name: string;
  company_url: string;
  job_title: string;
  employment_type: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  logo_mime: string;
  personal_id: string | null;
  created_at: string;
  updated_at: string;
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
