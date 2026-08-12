import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

export type OutfitGridProps = {
  images: (ImageSource | number)[];
};

const COLUMNS = 3;

export function OutfitGrid({ images }: OutfitGridProps) {
  const rows: OutfitGridProps['images'][] = [];
  for (let i = 0; i < images.length; i += COLUMNS) {
    rows.push(images.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((image, c) => (
            <View key={c} style={styles.tile}>
              <Image source={image} style={styles.image} contentFit="cover" />
            </View>
          ))}
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
