import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/text';
import { colors, shadows, spacing } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const backgroundByVariant: Record<ButtonVariant, string> = {
  primary: colors.button.black,
  secondary: colors.button.white90,
  tertiary: colors.button.white65,
};

const textColorByVariant: Record<ButtonVariant, keyof typeof colors.text> = {
  primary: 'white',
  secondary: 'black',
  tertiary: 'black',
};

export function Button({ label, variant = 'primary', disabled, style, ...rest }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgroundByVariant[variant] },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}>
      <Text variant="body" color={disabled ? 'gray' : textColorByVariant[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadows.button,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
