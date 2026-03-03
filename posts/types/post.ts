export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    author?: any[];
    'wp:term'?: any[];
  };
  _links: any;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: any;
    image_meta: any;
  };
  post: number;
  source_url: string;
  _links: any;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  categories: string[];
  tags: string[];
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PostFilters {
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  page?: number;
  perPage?: number;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
}
