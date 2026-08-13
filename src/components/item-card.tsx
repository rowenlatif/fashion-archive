import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type ItemCardProps = ViewProps & {
  image: ImageSource | number;
  label: string;
  selected?: boolean;
};

export function ItemCard({ image, label, selected, style, ...rest }: ItemCardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      <View style={[styles.imageWrap, selected && styles.imageWrapSelected]}>
        <Image source={image} style={styles.image} contentFit="contain" />
      </View>
      <Text variant="mono" numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80,
    gap: spacing.xs,
    alignItems: 'center',
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  imageWrapSelected: {
    borderColor: colors.background.black,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    textAlign: 'center',
  },
});
