import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/glass-surface';
import { Icon, type IconName } from '@/components/icon';
import { Rule } from '@/components/rule';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type FabMenuProps = {
  visible: boolean;
  onClose: () => void;
  onLogOutfit: () => void;
  onCatalogItem: () => void;
};

const SPRING = { damping: 30, stiffness: 160, overshootClamping: true };

export function FabMenu({ visible, onClose, onLogOutfit, onCatalogItem }: FabMenuProps) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const insets = useSafeAreaInsets();

  // Mount immediately on opening — a render-phase update (React's "adjusting
  // state when a prop changes" pattern) rather than a setState inside the
  // effect below, which only needs to own the animation itself.
  if (visible && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    progress.value = withSpring(visible ? 1 : 0, SPRING, (finished) => {
      if (finished && !visible) runOnJS(setMounted)(false);
    });
  }, [visible, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  if (!mounted) return null;

  const select = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <Modal transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[styles.sheetWrap, { paddingBottom: insets.bottom + spacing.lg }, sheetStyle]}
        pointerEvents="box-none">
        <GlassSurface shadow="panel" radius={spacing.xl} contentStyle={styles.content}>
          <View style={styles.handle} />
          <FabMenuOption icon="calendar" label="Log an Outfit" onPress={() => select(onLogOutfit)} />
          <Rule style={styles.divider} />
          <FabMenuOption icon="category" label="Catalog an Item" onPress={() => select(onCatalogItem)} />
        </GlassSurface>
      </Animated.View>
    </Modal>
  );
}

type FabMenuOptionProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
};

function FabMenuOption({ icon, label, onPress }: FabMenuOptionProps) {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <Icon name={icon} color="black" />
      <Text variant="body">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.background.blackOverlay,
  },
  sheetWrap: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: 0,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  handle: {
    width: 53,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.icons.disabled,
  },
  divider: {
    alignSelf: 'stretch',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'stretch',
    paddingVertical: spacing.sm,
  },
});
