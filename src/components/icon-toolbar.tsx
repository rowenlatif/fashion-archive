import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { IconButton, type IconButtonProps } from '@/components/icon-button';
import { spacing } from '@/theme';

export type IconToolbarProps = {
  icons: Pick<IconButtonProps, 'name' | 'disabled' | 'onPress'>[];
  // Pass { width: '100%' } to stretch the pill edge-to-edge within a padded
  // wrapper — icons stay centered as a group either way.
  style?: StyleProp<ViewStyle>;
};

export function IconToolbar({ icons, style }: IconToolbarProps) {
  return (
    <GlassSurface shadow="panel" contentStyle={styles.row} style={style}>
      {icons.map((icon) => (
        <IconButton key={icon.name} {...icon} />
      ))}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
