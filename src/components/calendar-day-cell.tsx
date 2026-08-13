import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type CalendarDayCellProps = ViewProps & {
  // Omitted for the leading/trailing blanks outside the month — the bordered
  // cell still renders, just without a date number or photo.
  date?: number;
  image?: ImageSource | number;
  // Only meaningful when there's a logged outfit photo to open.
  onPress?: () => void;
};

export function CalendarDayCell({ date, image, onPress, style, ...rest }: CalendarDayCellProps) {
  return (
    <Pressable style={[styles.cell, style]} onPress={image ? onPress : undefined} {...rest}>
      {date != null && (
        <Text variant="mono" style={styles.date}>
          {date}
        </Text>
      )}
      {image && <Image source={image} style={styles.image} contentFit="contain" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Figma's cell is a fixed 57.19 x 96.78, but a hardcoded pixel width breaks
  // in any container narrower than ~400px (i.e. most real phone screens) —
  // fills whatever width its parent grid column gives it and keeps the same
  // aspect ratio instead. Border only on the trailing (right/bottom) edges
  // so adjacent cells in a grid don't double up borders.
  cell: {
    width: '100%',
    aspectRatio: 57.19 / 96.78,
    paddingHorizontal: spacing.sm,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.stroke.gray200,
  },
  date: {
    height: 16,
  },
  image: {
    flex: 1,
  },
});
