  // src/features/products/types.ts

  export interface Location {
    type: 'Point';
    coordinates: [number, number];
  }

  export interface Category {
    _id: string;
    title: string;
    imageUrl: string;
  }

  export interface OwnerShort {
    userId: string;
    username: string;
    profilePicture: string;
    fullName?: string;
  }

  export interface Product {
    _id: string;
    owner: string | OwnerShort;
    title: string;
    images: string[];
    price: string;
    condition: string;
    description: string;
    category: string | Category;
    location: Location;
    isSold: boolean;
    soldTo?: string | null;
    clickCount: number;
    avgRating?: number;
    ratingsCount?: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface NewProductRequest {
    title: string;
    price: string;
    condition: string;
    description: string;
    category: string;
    lng: string;
    lat: string;
    pictures?: File[];
  }

  export interface ChangeStatusRequest {
    isSold: boolean;
    soldTo?: string | null;
  }

  export interface RatingResponse {
    message: string;
    ratings: Record<'1'|'2'|'3'|'4'|'5', number>;
    yourRating: number;
  }

  export interface RatingDetail {
    userId: string;
    username: string;
    fullName: string;
    profilePicture: string;
    createdAt: string;
  }

  export interface RatingsMap {
    '1star': { count: number; users: RatingDetail[] };
    '2star': { count: number; users: RatingDetail[] };
    '3star': { count: number; users: RatingDetail[] };
    '4star': { count: number; users: RatingDetail[] };
    '5star': { count: number; users: RatingDetail[] };
  }

  export interface SearchParams {
    q: string;
    category?: string;
    sort?: 'popularity' | 'rating' | 'recent' | 'priceAsc' | 'priceDesc';
    lng?: number;
    lat?: number;
    page?: number;
    limit?: number;
  }

  export interface Category {
  _id: string;
  title: string;
  imageUrl: string;
}
