import { type PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/glass-surface';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type ActionSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
}>;

// Generic modal presentation for a bottom sheet — handles the backdrop and
// slide-up mechanics; content (chip pickers, calendars, option lists) is
// supplied by the caller.
export function ActionSheet({ visible, onClose, title, children }: ActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <GlassSurface shadow="panel" radius={spacing.xl} contentStyle={styles.content}>
            <View style={styles.handle} />
            {title && (
              <Text variant="caption" color="gray" style={styles.title}>
                {title}
              </Text>
            )}
            {children}
          </GlassSurface>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.background.blackOverlay,
  },
  sheetWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  handle: {
    width: 53,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.icons.disabled,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
