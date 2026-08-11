import { Pressable, StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { Icon } from '@/components/icon';
import { colors, shadows, spacing } from '@/theme';

export type ViewToggleValue = 'grid' | 'calendar';

export type ViewToggleProps = {
  value: ViewToggleValue;
  onChange?: (value: ViewToggleValue) => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <GlassSurface shadow="none" contentStyle={styles.row}>
      <Pressable
        onPress={() => onChange?.('grid')}
        style={[styles.segment, value === 'grid' && styles.active]}>
        <Icon name="grid" />
      </Pressable>
      <Pressable
        onPress={() => onChange?.('calendar')}
        style={[styles.segment, value === 'calendar' && styles.active]}>
        <Icon name="calendar" />
      </Pressable>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  segment: {
    width: 44,
    height: 24,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: colors.button.white65,
    ...shadows.button,
  },
});
