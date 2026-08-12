import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { GlassSurface } from '@/components/glass-surface';
import { Icon } from '@/components/icon';
import { Sheen } from '@/components/sheen';
import { colors, shadows, spacing } from '@/theme';

export type ViewToggleValue = 'grid' | 'calendar';

export type ViewToggleProps = {
  value: ViewToggleValue;
  onChange?: (value: ViewToggleValue) => void;
};

const SEGMENT_SIZE = 44;
const SEGMENT_STEP = SEGMENT_SIZE + spacing.xs;

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const progress = useSharedValue(value === 'calendar' ? 1 : 0);

  useEffect(() => {
    // overshootClamping guarantees the pill never travels past its resting
    // spot — damping alone can't promise that with a spring curve.
    progress.value = withSpring(value === 'calendar' ? 1 : 0, {
      damping: 30,
      stiffness: 160,
      overshootClamping: true,
    });
  }, [value, progress]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * SEGMENT_STEP }],
  }));

  return (
    <GlassSurface shadow="none" contentStyle={styles.row}>
      <Animated.View style={[styles.highlight, highlightStyle]}>
        <View style={styles.highlightClip}>
          <Sheen borderRadius={spacing.md} />
        </View>
      </Animated.View>
      <Pressable onPress={() => onChange?.('grid')} style={styles.segment}>
        <Icon name="grid" />
      </Pressable>
      <Pressable onPress={() => onChange?.('calendar')} style={styles.segment}>
        <Icon name="calendar" />
      </Pressable>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  segment: {
    width: SEGMENT_SIZE,
    height: 24,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: SEGMENT_SIZE,
    height: 24,
    borderRadius: spacing.md,
    backgroundColor: colors.button.white65,
    ...shadows.button,
  },
  // Shadow lives on the pill above; clipping the sheen there too would clip the shadow.
  highlightClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: spacing.md,
    overflow: 'hidden',
  },
});
