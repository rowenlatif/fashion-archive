import type { ImageSource } from 'expo-image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { toClothingItems, type ItemRow } from '@/data/items';
import { randomStoragePath, resolveImageUrl, resolveImageUrls, uploadImage } from '@/data/storage';
import { supabase } from '@/lib/supabase';
import type { ClothingItem, Outfit } from '@/types/domain';

type OutfitRow = {
  id: string;
  title: string | null;
  worn_date: string;
  photo_path: string;
  composite_image_path: string | null;
  outfit_tags: { tags: { label: string } | null }[];
  outfit_items: { items: ItemRow | null }[];
};

const OUTFIT_COLUMNS = `
  id, title, worn_date, photo_path, composite_image_path,
  outfit_tags(tags(label)),
  outfit_items(items(id, title, category, color, image_path, cutout_image_path))
`;

function itemRowsOf(row: OutfitRow): ItemRow[] {
  return row.outfit_items.map((oi) => oi.items).filter((item): item is ItemRow => !!item);
}

function tagsOf(row: OutfitRow): string[] {
  return row.outfit_tags.map((ot) => ot.tags?.label).filter((label): label is string => !!label);
}

// Single-outfit mapping — used for the detail fetch, where there's only one
// outfit's photo/items to resolve, so batching across outfits doesn't apply.
async function mapOutfitRow(row: OutfitRow): Promise<Outfit> {
  const [items, photoUrl, compositeImageUrl] = await Promise.all([
    toClothingItems(itemRowsOf(row)),
    resolveImageUrl('outfit-photos', row.photo_path),
    row.composite_image_path ? resolveImageUrl('outfit-photos', row.composite_image_path) : null,
  ]);
  return {
    id: row.id,
    title: row.title,
    wornDate: row.worn_date,
    photoUrl,
    compositeImageUrl,
    tags: tagsOf(row),
    items,
  };
}

async function fetchOutfits(): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select(OUTFIT_COLUMNS)
    .order('worn_date', { ascending: false });
  if (error) throw error;
  const rows = data as unknown as OutfitRow[];

  // Batched across every outfit's photo/composite in one signing request,
  // rather than per-outfit round trips.
  const photoPaths = new Set<string>();
  for (const row of rows) {
    photoPaths.add(row.photo_path);
    if (row.composite_image_path) photoPaths.add(row.composite_image_path);
  }
  const [photoUrls, itemsByOutfit] = await Promise.all([
    resolveImageUrls('outfit-photos', [...photoPaths]),
    Promise.all(rows.map((row) => toClothingItems(itemRowsOf(row)))),
  ]);

  return rows.map((row, i) => ({
    id: row.id,
    title: row.title,
    wornDate: row.worn_date,
    photoUrl: photoUrls[row.photo_path],
    compositeImageUrl: row.composite_image_path ? (photoUrls[row.composite_image_path] ?? null) : null,
    tags: tagsOf(row),
    items: itemsByOutfit[i],
  }));
}

export function useOutfits() {
  return useQuery({ queryKey: ['outfits'], queryFn: fetchOutfits });
}

async function fetchOutfit(id: string): Promise<Outfit | null> {
  const { data, error } = await supabase.from('outfits').select(OUTFIT_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapOutfitRow(data as unknown as OutfitRow) : null;
}

export function useOutfit(id: string | undefined) {
  return useQuery({
    queryKey: ['outfit', id],
    queryFn: () => fetchOutfit(id!),
    enabled: !!id,
  });
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

// Matches the mock data's manually-uppercased "FRI, 18 MAY 2026" format —
// Text has no textTransform applied, so this must be uppercase already.
export function formatOutfitDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export type OutfitDetail = {
  title: string;
  time: string;
  category: string;
  photos: (ImageSource | null)[];
  items: { image: ImageSource; label: string }[];
};

// Shapes a full Outfit into exactly the props outfit/[id].tsx already
// destructures, so the screen's animation/gesture code needs no changes.
export function useOutfitDetail(id: string | undefined) {
  const { data, isLoading } = useOutfit(id);

  const detail = useMemo<OutfitDetail | null>(() => {
    if (!data) return null;
    return {
      title: data.title ?? '',
      time: formatOutfitDate(data.wornDate),
      category: data.tags[0]?.toUpperCase() ?? '',
      photos: [{ uri: data.photoUrl }, data.compositeImageUrl ? { uri: data.compositeImageUrl } : null],
      items: data.items.map((item) => ({
        image: { uri: item.cutoutImageUrl ?? item.imageUrl },
        label: item.title,
      })),
    };
  }, [data]);

  return { data: detail, isLoading };
}

export function useMostWornItems(outfits: Outfit[] | undefined, limit = 2) {
  return useMemo(() => {
    if (!outfits) return [];
    const counts = new Map<string, { item: ClothingItem; count: number }>();
    for (const outfit of outfits) {
      for (const item of outfit.items) {
        const entry = counts.get(item.id);
        if (entry) entry.count += 1;
        else counts.set(item.id, { item, count: 1 });
      }
    }
    return [...counts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(({ item, count }) => ({
        title: 'Most Worn This Month',
        subtitle: `${item.title} • ${count} Day${count === 1 ? '' : 's'}`,
        image: { uri: item.imageUrl } as ImageSource,
      }));
  }, [outfits, limit]);
}

export type CreateOutfitInput = {
  photoUri: string;
  wornDate: string; // ISO date, YYYY-MM-DD
  title: string;
  tagId: string;
  itemIds: string[];
};

async function createOutfit(input: CreateOutfitInput): Promise<Outfit> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const photoPath = await uploadImage('outfit-photos', randomStoragePath(user.id), input.photoUri);

  const { data: outfitRow, error } = await supabase
    .from('outfits')
    .insert({ user_id: user.id, title: input.title, photo_path: photoPath, worn_date: input.wornDate })
    .select('id')
    .single();
  if (error) throw error;

  const outfitId = outfitRow.id as string;

  if (input.itemIds.length > 0) {
    const { error: itemsError } = await supabase
      .from('outfit_items')
      .insert(input.itemIds.map((itemId) => ({ outfit_id: outfitId, item_id: itemId })));
    if (itemsError) throw itemsError;
  }

  const { error: tagError } = await supabase
    .from('outfit_tags')
    .insert({ outfit_id: outfitId, tag_id: input.tagId });
  if (tagError) throw tagError;

  const outfit = await fetchOutfit(outfitId);
  if (!outfit) throw new Error('Failed to load newly created outfit');
  return outfit;
}

export function useCreateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });
}
