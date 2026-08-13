export type ItemCategory =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'footwear'
  | 'bag'
  | 'accessory'
  | 'jewelry'
  | 'other';

export const ITEM_CATEGORIES: ItemCategory[] = [
  'top',
  'bottom',
  'dress',
  'outerwear',
  'footwear',
  'bag',
  'accessory',
  'jewelry',
  'other',
];

export type ImageSourceKind = 'upload' | 'camera' | 'link';

export type ClothingItem = {
  id: string;
  title: string;
  category: ItemCategory;
  color: string;
  imageUrl: string;
  // Phase 2 (background-removed variant) — unused in Phase 1.
  cutoutImageUrl: string | null;
};

export type Outfit = {
  id: string;
  title: string | null;
  wornDate: string; // ISO date (YYYY-MM-DD)
  photoUrl: string;
  tags: string[];
  items: ClothingItem[];
  // Phase 2 (AI-generated composite) — unused in Phase 1.
  compositeImageUrl: string | null;
};
