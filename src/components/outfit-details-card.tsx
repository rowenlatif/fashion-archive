import { ScrollView, StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { ItemCard, type ItemCardProps } from '@/components/item-card';
import { Text } from '@/components/text';
import { spacing } from '@/theme';

export type OutfitDetailsCardProps = {
  items: Pick<ItemCardProps, 'image' | 'label'>[];
};

export function OutfitDetailsCard({ items }: OutfitDetailsCardProps) {
  return (
    <GlassSurface shadow="card" contentStyle={styles.content}>
      <Text variant="caption" color="gray" style={styles.label}>
        OUTFIT DETAILS
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map((item) => (
          <ItemCard key={item.label} {...item} />
        ))}
      </ScrollView>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  label: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
