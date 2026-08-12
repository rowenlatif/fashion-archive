import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { colors, typography } from '@/theme';

export type TextVariant = 'title' | 'body' | 'bodyLarge' | 'mono' | 'caption' | 'micro';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: keyof typeof colors.text;
};

export function Text({ variant = 'body', color, style, ...rest }: AppTextProps) {
  return <RNText style={[styles[variant], color && { color: colors.text[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: typography.instrumentTitle,
  body: typography.instrumentBody,
  bodyLarge: typography.instrumentBodyLarge,
  mono: typography.ibmBody,
  caption: typography.ibmCaption,
  micro: typography.ibmMicro,
});
