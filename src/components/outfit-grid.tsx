import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

export type OutfitGridProps = {
  images: (ImageSource | number)[];
  // Demo-only wiring: every tile opens the same mock outfit for now — see
  // src/app/outfit/[id].tsx. Replace once tiles carry a real outfit id.
  onPressImage?: (index: number) => void;
};

const COLUMNS = 3;

export function OutfitGrid({ images, onPressImage }: OutfitGridProps) {
  const rows: OutfitGridProps['images'][] = [];
  for (let i = 0; i < images.length; i += COLUMNS) {
    rows.push(images.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((image, c) => {
            const index = r * COLUMNS + c;
            return (
              <Pressable
                key={c}
                style={styles.tile}
                onPress={onPressImage && (() => onPressImage(index))}>
                <Image source={image} style={styles.image} contentFit="cover" />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    // Figma: a 51.229px tile inside a 338px content row (402px frame minus
    // 32px padding either side) — thin cropped strips with generous gaps
    // between them, not a filled grid.
    width: '15.16%',
    aspectRatio: 51.229 / 190,
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
