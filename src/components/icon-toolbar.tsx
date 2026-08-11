import { StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { IconButton, type IconButtonProps } from '@/components/icon-button';
import { spacing } from '@/theme';

export type IconToolbarProps = {
  icons: Pick<IconButtonProps, 'name' | 'disabled' | 'onPress'>[];
};

export function IconToolbar({ icons }: IconToolbarProps) {
  return (
    <GlassSurface shadow="panel" contentStyle={styles.row}>
      {icons.map((icon) => (
        <IconButton key={icon.name} {...icon} />
      ))}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
