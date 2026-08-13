import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Rule } from '@/components/rule';
import { Text } from '@/components/text';
import { colors, spacing, typography } from '@/theme';

export type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...rest }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text variant="caption" color="gray">
        {label}
      </Text>
      <TextInput style={[styles.input, style]} placeholderTextColor={colors.text.gray} {...rest} />
      <Rule />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  input: {
    ...typography.instrumentBody,
    color: colors.text.black,
    paddingBottom: spacing.xs,
  },
});
