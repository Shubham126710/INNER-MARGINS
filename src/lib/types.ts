// Types for the blog
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  readTime: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  content: string;
  profileImage?: string;
  hobbies: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
}
