import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { spacing } from '@/theme';

export type ItemCardProps = ViewProps & {
  image: ImageSource | number;
  label: string;
};

export function ItemCard({ image, label, style, ...rest }: ItemCardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      <Image source={image} style={styles.image} contentFit="contain" />
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
  image: {
    width: 80,
    height: 80,
  },
  label: {
    textAlign: 'center',
  },
});
