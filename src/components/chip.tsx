import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type ChipProps = ViewProps & {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress, style, ...rest }: ChipProps) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
      {...rest}>
      <Text variant="caption" color={selected ? 'white' : undefined}>
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: colors.stroke.gray200,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.background.black,
    borderColor: colors.background.black,
  },
});
