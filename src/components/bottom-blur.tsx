import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

import { spacing } from '@/theme';

// Pinned over the bottom of the screen (a sibling of the scroll view, not
// inside it) so it stays put while content scrolls underneath and blurs.
export function BottomBlur() {
  return <BlurView intensity={12} tint="light" style={styles.fade} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: spacing.huge + spacing.xxl,
  },
});
