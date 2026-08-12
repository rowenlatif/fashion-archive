import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export type SheenProps = {
  borderRadius?: number;
};

// Glassy highlight in the top-left corner — used on the toggle's icon
// segments and the FAB. Render inside a sibling of whatever draws the
// shadow, clipped by an ancestor with matching borderRadius + overflow
// hidden (shadow and clipping can't live on the same layer on iOS).
export function Sheen({ borderRadius = 0 }: SheenProps) {
  return (
    <LinearGradient
      colors={COLORS}
      start={START}
      end={END}
      style={[styles.fill, { borderRadius }]}
      pointerEvents="none"
    />
  );
}

const COLORS = ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0)'] as const;
const START = { x: 0, y: 0 };
const END = { x: 0.75, y: 0.75 };

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
