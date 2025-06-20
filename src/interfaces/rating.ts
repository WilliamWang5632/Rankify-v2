export interface Rating {
  id: string;
  name: string;
  picture?: string;
  rating: number; // 0–10 with decimals
  review: string;
  createdAt?: string;
}