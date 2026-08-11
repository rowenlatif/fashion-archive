import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type ChipProps = ViewProps & {
  label: string;
};

export function Chip({ label, style, ...rest }: ChipProps) {
  return (
    <View style={[styles.chip, style]} {...rest}>
      <Text variant="caption">{label}</Text>
    </View>
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
});
