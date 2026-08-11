import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/glass-surface';
import { LinkedItemPreview, type LinkedItemPreviewProps } from '@/components/linked-item-preview';
import { LinkedOutfitRow, type LinkedOutfitRowProps } from '@/components/linked-outfit-row';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type BottomSheetProps = {
  preview: LinkedItemPreviewProps;
  outfits: LinkedOutfitRowProps[];
};

// No drop shadow on the sheet itself — confirmed absent in the Figma source.
export function BottomSheet({ preview, outfits }: BottomSheetProps) {
  return (
    <GlassSurface shadow="none" radius={spacing.xl} contentStyle={styles.content}>
      <View style={styles.handle} />
      <Text variant="caption" color="gray" style={styles.title}>
        LINKED OUTFITS
      </Text>
      <LinkedItemPreview {...preview} />
      <View style={styles.list}>
        {outfits.map((outfit, i) => (
          <LinkedOutfitRow key={i} {...outfit} />
        ))}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  // Drag handle color (~#A8A8A8 in Figma) has no exact token match —
  // Icons/Disabled is the closest existing color, used here as a stand-in.
  handle: {
    width: 53,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.icons.disabled,
  },
  title: {
    textAlign: 'center',
  },
  list: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
});
