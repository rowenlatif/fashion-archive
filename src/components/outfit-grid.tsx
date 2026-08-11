import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

export type OutfitGridProps = {
  images: (ImageSource | number)[];
};

export function OutfitGrid({ images }: OutfitGridProps) {
  return (
    <View style={styles.grid}>
      {images.map((image, i) => (
        <View key={i} style={styles.tile}>
          <Image source={image} style={styles.image} contentFit="cover" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: '31%',
    aspectRatio: 51.2 / 190,
    borderRadius: spacing.xs,
    backgroundColor: colors.stroke.gray100,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
