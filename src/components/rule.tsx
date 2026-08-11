import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/theme';

export type RuleProps = ViewProps & {
  color?: keyof typeof colors.stroke;
};

export function Rule({ color = 'gray200', style, ...rest }: RuleProps) {
  return <View style={[styles.rule, { backgroundColor: colors.stroke[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  rule: {
    height: 0.5,
  },
});
