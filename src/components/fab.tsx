import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Icon } from '@/components/icon';
import { colors, shadows } from '@/theme';

export type FabProps = Omit<PressableProps, 'style'>;

export function Fab(props: FabProps) {
  return (
    <Pressable style={styles.base} {...props}>
      <Icon name="plus" color="black" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 58,
    height: 53,
    borderRadius: 26.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.white90,
    ...shadows.button,
  },
});
