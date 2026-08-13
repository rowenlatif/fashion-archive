import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { randomStoragePath, resolveImageUrls, uploadImage } from '@/data/storage';
import { supabase } from '@/lib/supabase';
import type { ClothingItem, ImageSourceKind, ItemCategory } from '@/types/domain';

export type ItemRow = {
  id: string;
  title: string;
  category: ItemCategory;
  color: string;
  image_path: string;
  cutout_image_path: string | null;
};

const ITEM_COLUMNS = 'id, title, category, color, image_path, cutout_image_path';

// Resolves every row's image_path/cutout_image_path to signed URLs in one
// batched request, rather than one round trip per item.
export async function toClothingItems(rows: ItemRow[]): Promise<ClothingItem[]> {
  const paths = new Set<string>();
  for (const row of rows) {
    paths.add(row.image_path);
    if (row.cutout_image_path) paths.add(row.cutout_image_path);
  }
  const urls = await resolveImageUrls('item-images', [...paths]);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    color: row.color,
    imageUrl: urls[row.image_path],
    cutoutImageUrl: row.cutout_image_path ? (urls[row.cutout_image_path] ?? null) : null,
  }));
}

async function fetchItems(): Promise<ClothingItem[]> {
  const { data, error } = await supabase
    .from('items')
    .select(ITEM_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return toClothingItems(data as ItemRow[]);
}

export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: fetchItems });
}

export type CreateItemInput = {
  title: string;
  category: ItemCategory;
  color: string;
  image: { kind: ImageSourceKind; uri: string };
};

async function createItem(input: CreateItemInput): Promise<ClothingItem> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const imagePath =
    input.image.kind === 'link'
      ? input.image.uri
      : await uploadImage('item-images', randomStoragePath(user.id), input.image.uri);

  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: user.id,
      title: input.title,
      category: input.category,
      color: input.color,
      image_path: imagePath,
      image_source: input.image.kind,
    })
    .select(ITEM_COLUMNS)
    .single();
  if (error) throw error;

  const [item] = await toClothingItems([data as ItemRow]);
  return item;
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
