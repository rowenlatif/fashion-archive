import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type LinkedItemPreviewProps = {
  image?: ImageSource | number;
  label: string;
};

// The hero image placeholder has no bound Figma color token (confirmed
// "just a placeholder"); reusing stroke.gray100 as the closest existing
// neutral rather than inlining a one-off hex value.
export function LinkedItemPreview({ image, label }: LinkedItemPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        {image && <Image source={image} style={styles.image} contentFit="cover" />}
      </View>
      <Text variant="mono" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: spacing.sm,
    backgroundColor: colors.stroke.gray100,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    textAlign: 'center',
  },
});
