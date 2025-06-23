// features\subscription\types.ts
export interface CreateCheckoutSessionResponse {
  url: string;
}

export interface PremiumFeedPost {
  _id: string;
  media: string[];
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumFeedResponse {
  posts?: PremiumFeedPost[];
  isPremium?: boolean;
}

export interface APIError {
  error: string;
}
