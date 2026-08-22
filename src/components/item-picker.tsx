import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { Icon } from '@/components/icon';
import { ItemCard } from '@/components/item-card';
import { Text } from '@/components/text';
import { useItems } from '@/data/items';
import { colors, spacing } from '@/theme';

export type ItemPickerProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onAddNew: () => void;
};

export function ItemPicker({ selectedIds, onToggle, onAddNew }: ItemPickerProps) {
  const { data: items = [], refetch } = useItems();

  // Picks up items cataloged via the "+ ADD NEW" escape hatch when the user
  // navigates back here from catalog-item.tsx.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <GlassSurface shadow="card" contentStyle={styles.content}>
      <Text variant="caption" color="gray" style={styles.label}>
        ITEMS
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <Pressable key={item.id} onPress={() => onToggle(item.id)}>
            <ItemCard
              image={{ uri: item.imageUrl }}
              label={item.title}
              selected={selectedIds.includes(item.id)}
            />
          </Pressable>
        ))}
        <Pressable style={styles.addNew} onPress={onAddNew}>
          <Icon name="plus" size={20} />
          <Text variant="mono" style={styles.addNewLabel}>
            Add New
          </Text>
        </Pressable>
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
  addNew: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.button.white90,
    borderWidth: 0.5,
    borderColor: colors.stroke.gray200,
    borderRadius: spacing.xs,
  },
  addNewLabel: {
    textAlign: 'center',
  },
});
