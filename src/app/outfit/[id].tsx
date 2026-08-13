import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { IconToolbar } from '@/components/icon-toolbar';
import { OutfitTitleBlock } from '@/components/outfit-title-block';
import { colors, spacing } from '@/theme';

const OUTFIT_PHOTO = require('@/assets/images/cal-fit-view.png');

// Mock outfits keyed by id — replace once outfits have a real backing store.
// Only the first photo has a real placeholder image; the next one renders
// as a plain gray rectangle so the swipe transition is easy to see.
const OUTFITS: Record<
  string,
  { title: string; time: string; category: string; photos: (number | null)[] }
> = {
  '1': {
    title: 'CASUAL 1',
    time: 'FRI, 18 MAY 2026',
    category: 'NIGHT OUT',
    photos: [OUTFIT_PHOTO, null],
  },
};

// overshootClamping keeps this a clean directional push rather than a
// spring bounce-back — the previous version still had a small overshoot.
// The layout-animation builder's overshootClamping takes a number (1/0),
// unlike withSpring's boolean option.
const SPRING = { damping: 26, stiffness: 200, overshootClamping: 1 };

export default function OutfitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const outfit = OUTFITS[id ?? '1'] ?? OUTFITS['1'];
  const [nav, setNav] = useState<{ index: number; direction: 'prev' | 'next' }>({
    index: 0,
    direction: 'next',
  });
  // Only true once a chevron has actually been tapped — the initial photo
  // (arriving from Home/Calendar) must appear instantly, with no push.
  const [hasSwiped, setHasSwiped] = useState(false);
  // Header and toolbar heights are dynamic (title text wraps, insets vary),
  // so the fixed chevrons — now siblings of the sliding page — measure the
  // photo row's own rect to stay vertically centered on the photo rather
  // than on the full screen.
  const [photoRowRect, setPhotoRowRect] = useState<{ top: number; height: number } | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goPrev = () => {
    setHasSwiped(true);
    setNav((n) => ({ index: Math.max(0, n.index - 1), direction: 'prev' }));
  };
  const goNext = () => {
    setHasSwiped(true);
    setNav((n) => ({ index: Math.min(outfit.photos.length - 1, n.index + 1), direction: 'next' }));
  };

  const photo = outfit.photos[nav.index];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Everything — details, photo, chevrons, toolbar — lives in one
          Animated.View keyed by photo index, so the whole page pushes as a
          single unit instead of just the photo sliding inside it. */}
      <Animated.View
        key={nav.index}
        // Exiting is deliberately skipped: its direction would be fixed at
        // this view's own mount time, so reversing direction on the next
        // tap would replay the wrong exit. Entering is always recomputed
        // fresh for the current tap, so it's always correct. Skipped
        // entirely until the first swipe, so arriving on this screen never
        // shows the push.
        entering={
          hasSwiped
            ? (nav.direction === 'next' ? SlideInRight : SlideInLeft)
                .springify()
                .damping(SPRING.damping)
                .stiffness(SPRING.stiffness)
                .overshootClamping(SPRING.overshootClamping)
            : undefined
        }
        style={styles.page}>
        <View style={styles.header}>
          <OutfitTitleBlock title={outfit.title} time={outfit.time} category={outfit.category} />
          <Pressable onPress={() => router.back()} hitSlop={spacing.sm}>
            <Icon name="close" size={12} />
          </Pressable>
        </View>
        <View
          style={styles.photoRow}
          onLayout={(e) =>
            setPhotoRowRect({ top: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height })
          }>
          <View style={styles.photoStage}>
            <View style={styles.photoWrap}>
              {photo ? (
                <Image source={photo} style={styles.photo} contentFit="cover" />
              ) : (
                <View style={[styles.photo, styles.photoPlaceholder]} />
              )}
            </View>
          </View>
        </View>
        <View style={[styles.toolbarWrap, { paddingBottom: insets.bottom + spacing.xxl }]}>
          <IconToolbar
            icons={[{ name: 'info' }, { name: 'link' }, { name: 'edit' }]}
            style={styles.toolbar}
          />
        </View>
      </Animated.View>
      {/* Siblings of the remounting Animated.View, not descendants — a chevron
          that lived inside it got unmounted and remounted by the very tap
          that pressed it, which is what made presses drop or feel "stuck".
          Held back until photoRowRect is measured so there's never a frame
          where they fall back to spanning the full screen and sit on top of
          the header's close button. */}
      {photoRowRect && (
        <>
          <Pressable
            onPress={goPrev}
            hitSlop={spacing.sm}
            style={[styles.nav, styles.navLeft, photoRowRect]}>
            <Icon name="chevron" rotation={90} />
          </Pressable>
          <Pressable
            onPress={goNext}
            hitSlop={spacing.sm}
            style={[styles.nav, styles.navRight, photoRowRect]}>
            <Icon name="chevron" rotation={270} />
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.white,
    // Clips the page while it's mid-push so it never visibly spills past
    // the screen edge.
    overflow: 'hidden',
  },
  page: {
    flex: 1,
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
    marginTop: spacing.md,
  },
  // Floating overlay controls — not part of the sliding stage, so they
  // stay put while the whole page pushes behind them.
  nav: {
    position: 'absolute',
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLeft: {
    left: spacing.sm,
  },
  navRight: {
    right: spacing.sm,
  },
  photoStage: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
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
  photoPlaceholder: {
    backgroundColor: colors.background.blackOverlay,
  },
  toolbarWrap: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  toolbar: {
    width: '100%',
    // A bit darker than the standard panel shadow so it reads clearly
    // against a plain white background.
    shadowOpacity: 0.4,
  },
});
