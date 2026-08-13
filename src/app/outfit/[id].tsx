import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { IconToolbar } from '@/components/icon-toolbar';
import { OutfitTitleBlock } from '@/components/outfit-title-block';
import { colors, spacing } from '@/theme';

const OUTFIT_PHOTO = require('@/assets/images/cal-fit-view.png');

// Mock outfits keyed by id — replace once outfits have a real backing store.
const OUTFITS: Record<
  string,
  { title: string; time: string; category: string; photos: number[] }
> = {
  '1': {
    title: 'CASUAL 1',
    time: 'FRI, 18 MAY 2026',
    category: 'NIGHT OUT',
    photos: [OUTFIT_PHOTO, OUTFIT_PHOTO, OUTFIT_PHOTO],
  },
};

export default function OutfitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const outfit = OUTFITS[id ?? '1'] ?? OUTFITS['1'];
  const [photoIndex, setPhotoIndex] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <OutfitTitleBlock title={outfit.title} time={outfit.time} category={outfit.category} />
        <Pressable onPress={() => router.back()} hitSlop={spacing.sm}>
          <Icon name="close" />
        </Pressable>
      </View>
      <View style={styles.photoRow}>
        <Pressable
          onPress={() => setPhotoIndex((i) => Math.max(0, i - 1))}
          hitSlop={spacing.sm}
          style={styles.nav}>
          <Icon name="chevron" rotation={90} />
        </Pressable>
        <View style={styles.photoWrap}>
          <Image source={outfit.photos[photoIndex]} style={styles.photo} contentFit="cover" />
        </View>
        <Pressable
          onPress={() => setPhotoIndex((i) => Math.min(outfit.photos.length - 1, i + 1))}
          hitSlop={spacing.sm}
          style={styles.nav}>
          <Icon name="chevron" rotation={270} />
        </Pressable>
      </View>
      <View style={[styles.toolbarWrap, { paddingBottom: insets.bottom + spacing.lg }]}>
        <IconToolbar
          icons={[{ name: 'info' }, { name: 'link' }, { name: 'edit' }]}
          style={styles.toolbar}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  photoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  nav: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoWrap: {
    height: '100%',
    aspectRatio: 161 / 595,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  toolbarWrap: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  toolbar: {
    width: '100%',
  },
});
