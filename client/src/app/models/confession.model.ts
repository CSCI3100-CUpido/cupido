export interface Confession {
  id: string;
  userId: string; // Added this field to fix the error
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isAnonymous: boolean;
  authorName?: string;
  authorPhoto?: string;
  isOwner?: boolean;
}

export interface ConfessionComment {
  id: string;
  confessionId: string;
  userId: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  authorName?: string;
  authorPhoto?: string;
  isOwner?: boolean;
}

export interface ConfessionCreate {
  content: string;
  imageUrl?: string;
  isAnonymous: boolean;
}