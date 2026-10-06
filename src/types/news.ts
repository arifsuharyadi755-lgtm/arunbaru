export type CategoryId = 
  | 'all'
  | 'politik'
  | 'olahraga'
  | 'kriminal'
  | 'ekonomi'
  | 'daerah'
  | 'lain_lain'
  | 'lapor_warga'
  | 'legalitas';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  badge: string;
  color: string;
  subcategories: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: CategoryId;
  categoryName: string;
  subCategory: string;
  summary: string;
  content: string[];
  imageUrl: string;
  imageCaption: string;
  author: string;
  publishedAt: string;
  timestamp: number;
  readTime: string;
  viewsCount: number;
  commentCount: number;
  isBreaking?: boolean;
  isEditorPick?: boolean;
  isOpinion?: boolean;
  authorRole?: string;
  authorAvatar?: string;
  authorBio?: string;
  pullQuote?: string;
  tags: string[];
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  category: CategoryId;
  articleId?: string;
  timestamp: number;
  read: boolean;
  priority: 'high' | 'normal';
}

export interface NotificationChannel {
  id: CategoryId | 'breaking';
  name: string;
  description: string;
  enabled: boolean;
}

export interface UserComment {
  id: string;
  articleId: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  upvotes: number;
  downvotes: number;
}
