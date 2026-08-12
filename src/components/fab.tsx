import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { Icon } from '@/components/icon';
import { Sheen } from '@/components/sheen';
import { colors, shadows } from '@/theme';

export type FabProps = Omit<PressableProps, 'style'>;

const RADIUS = 26.5;

export function Fab(props: FabProps) {
  return (
    <Pressable style={styles.base} {...props}>
      {/* Shadow lives on this Pressable; clipping the sheen here too would clip the shadow. */}
      <View style={styles.clip}>
        <Sheen borderRadius={RADIUS} />
        <Icon name="plus" color="black" size={24} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 58,
    height: 53,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.white90,
    ...shadows.panel,
  },
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
