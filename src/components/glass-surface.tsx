import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { colors, gradients, shadows, spacing } from '@/theme';

export type GlassSurfaceProps = ViewProps & {
  shadow?: 'card' | 'panel' | 'none';
  radius?: number;
  contentStyle?: StyleProp<ViewStyle>;
};

// Shared "Gray Glass" surface — used by every card/panel/sheet that sits on
// the frosted gradient background. Shadow lives on the outer view (so it
// isn't clipped by the inner view's overflow:hidden, which is needed to
// clip the gradient fill to the rounded corners).
export function GlassSurface({
  shadow = 'card',
  radius = spacing.lg,
  style,
  contentStyle,
  children,
  ...rest
}: GlassSurfaceProps) {
  return (
    <View style={[shadow !== 'none' && shadows[shadow], { borderRadius: radius }, style]} {...rest}>
      <LinearGradient
        colors={gradients.grayGlass.colors}
        start={gradients.grayGlass.start}
        end={gradients.grayGlass.end}
        style={[styles.fill, { borderRadius: radius }, contentStyle]}>
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    borderWidth: 0.5,
    borderColor: colors.stroke.gray100,
    overflow: 'hidden',
  },
});
