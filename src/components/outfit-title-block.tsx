import { StyleSheet, View, type ViewProps } from 'react-native';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { spacing } from '@/theme';

export type OutfitTitleBlockProps = ViewProps & {
  title: string;
  time: string;
  category: string;
};

export function OutfitTitleBlock({ title, time, category, style, ...rest }: OutfitTitleBlockProps) {
  return (
    <View style={[styles.block, style]} {...rest}>
      <Text variant="mono">{title}</Text>
      <View style={styles.row}>
        <Icon name="time" color="gray" />
        <Text variant="caption">{time}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="category" color="gray" />
        <Text variant="caption">{category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
