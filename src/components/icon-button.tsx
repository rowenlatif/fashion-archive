import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { colors, shadows, spacing } from '@/theme';

export type IconButtonProps = Omit<PressableProps, 'style' | 'disabled'> & {
  name: IconName;
  disabled?: boolean;
  rotation?: 0 | 90 | 180 | 270;
  // 'muted' = Button/White 65% (toolbar icons). 'solid' = Background/White,
  // fully opaque (e.g. calendar month-nav chevrons).
  tone?: 'muted' | 'solid';
};

export function IconButton({ name, disabled, rotation = 0, tone = 'muted', ...rest }: IconButtonProps) {
  const glyph = <Icon name={name} color={disabled ? 'disabled' : 'black'} rotation={rotation} />;

  if (disabled) {
    return <View style={styles.base}>{glyph}</View>;
  }

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        tone === 'solid' ? styles.solid : styles.muted,
        pressed && styles.pressed,
      ]}
      {...rest}>
      {glyph}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 24,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  muted: {
    backgroundColor: colors.button.white65,
  },
  solid: {
    backgroundColor: colors.background.white,
  },
  pressed: {
    opacity: 0.6,
  },
});
