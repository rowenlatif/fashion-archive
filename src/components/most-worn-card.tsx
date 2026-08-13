import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Rule } from '@/components/rule';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type MostWornCardProps = {
  image?: ImageSource | number;
  title: string;
  subtitle: string;
  // False for the first card in a list — the divider above it is redundant
  // right under the calendar, but still wanted between subsequent cards.
  showRule?: boolean;
};

export function MostWornCard({ image, title, subtitle, showRule = true }: MostWornCardProps) {
  return (
    <View style={styles.card}>
      {showRule && <Rule />}
      <View style={styles.row}>
        <View style={styles.thumb}>
          {image && <Image source={image} style={styles.image} contentFit="cover" />}
        </View>
        <View style={styles.info}>
          <Text variant="bodyLarge">{title}</Text>
          <Text variant="caption" color="gray">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  thumb: {
    width: 74,
    height: 74,
    borderRadius: spacing.sm,
    backgroundColor: colors.background.blackOverlay,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    gap: spacing.xs,
  },
});
