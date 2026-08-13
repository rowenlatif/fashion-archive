import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  type EntryAnimationsValues,
  type ExitAnimationsValues,
  LayoutAnimationConfig,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { IconToolbar } from '@/components/icon-toolbar';
import { OutfitDetailsCard } from '@/components/outfit-details-card';
import { OutfitTitleBlock } from '@/components/outfit-title-block';
import { Text } from '@/components/text';
import { useOutfitDetail } from '@/data/outfits';
import { colors, spacing } from '@/theme';

const PUSH_DURATION = 340;
const PUSH_EASING = Easing.out(Easing.cubic);

export default function OutfitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: outfit, isLoading } = useOutfitDetail(id);
  const [index, setIndex] = useState(0);
  // A shared value, not React state: the entering/exiting worklets below are
  // the SAME function reference on every tap, so each one just reads
  // whatever direction is current at the moment it actually runs on the UI
  // thread. Picking between two different builders (e.g. SlideInLeft vs.
  // SlideInRight) based on React state doesn't work for the *exiting* side —
  // the outgoing view already rendered with the previous tap's direction, so
  // reversing direction mid-swipe would replay the wrong exit.
  const direction = useSharedValue<1 | -1>(1);
  // Only true once a chevron has actually been tapped — the initial photo
  // (arriving from Home/Calendar) must appear instantly, with no push.
  const [hasSwiped, setHasSwiped] = useState(false);
  // True once the close button has been pressed. Drives the skipExiting
  // flag below rather than nulling out the exiting prop directly — a
  // worklet-level check on a flag written right before router.back() looked
  // right on paper (Reanimated reads shared values live) but still let the
  // slide through in practice. LayoutAnimationConfig's skipExiting is read
  // from componentWillUnmount, which is a React lifecycle guarantee rather
  // than a race against when a UI-thread worklet happens to run.
  const [isClosing, setIsClosing] = useState(false);
  // Header and toolbar heights are dynamic (title text wraps, insets vary),
  // so the fixed chevrons — now siblings of the sliding page — measure the
  // photo row's own rect to stay vertically centered on the photo rather
  // than on the full screen.
  const [photoRowRect, setPhotoRowRect] = useState<{ top: number; height: number } | null>(null);
  // Toggled by the toolbar's info icon — shows the outfit details panel and
  // shrinks the photo to make room for it.
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Runs only after the isClosing=true render above has committed, so
  // LayoutAnimationConfig has already re-rendered with skipExiting={true}
  // by the time this view actually leaves the tree.
  useEffect(() => {
    if (isClosing) {
      router.back();
    }
  }, [isClosing, router]);

  const goPrev = () => {
    direction.value = -1;
    setHasSwiped(true);
    setIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    direction.value = 1;
    setHasSwiped(true);
    setIndex((i) => Math.min(outfit!.photos.length - 1, i + 1));
  };

  const pushEntering = (values: EntryAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        originX: values.targetOriginX + direction.value * values.windowWidth,
      },
      animations: {
        originX: withTiming(values.targetOriginX, {
          duration: PUSH_DURATION,
          easing: PUSH_EASING,
        }),
      },
    };
  };
  const pushExiting = (values: ExitAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        originX: values.currentOriginX,
      },
      animations: {
        originX: withTiming(values.currentOriginX - direction.value * values.windowWidth, {
          duration: PUSH_DURATION,
          easing: PUSH_EASING,
        }),
      },
    };
  };

  // Grows the details panel up into place rather than just fading it —
  // starts smaller and lower, scales/slides up to full size, so it reads as
  // popping out of the toolbar area instead of materializing flat.
  const panelEntering = (_values: EntryAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.85 }, { translateY: spacing.lg }],
      },
      animations: {
        opacity: withTiming(1, { duration: PUSH_DURATION, easing: PUSH_EASING }),
        transform: [
          { scale: withTiming(1, { duration: PUSH_DURATION, easing: PUSH_EASING }) },
          { translateY: withTiming(0, { duration: PUSH_DURATION, easing: PUSH_EASING }) },
        ],
      },
    };
  };
  const panelExiting = (_values: ExitAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        opacity: 1,
        transform: [{ scale: 1 }, { translateY: 0 }],
      },
      animations: {
        opacity: withTiming(0, { duration: PUSH_DURATION, easing: PUSH_EASING }),
        transform: [
          { scale: withTiming(0.85, { duration: PUSH_DURATION, easing: PUSH_EASING }) },
          { translateY: withTiming(spacing.lg, { duration: PUSH_DURATION, easing: PUSH_EASING }) },
        ],
      },
    };
  };

  if (!outfit) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {!isLoading && (
          <Text variant="caption" color="gray" style={styles.notFound}>
            OUTFIT NOT FOUND
          </Text>
        )}
      </SafeAreaView>
    );
  }

  const photo = outfit.photos[index];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Everything — details, photo, chevrons, toolbar — lives in one
          Animated.View keyed by photo index, so the whole page pushes as a
          single unit instead of just the photo sliding inside it. Wrapped in
          LayoutAnimationConfig so closing can disable the exit animation
          straight from React's unmount lifecycle instead of racing a
          worklet against the moment router.back() actually tears this view
          down. */}
      <LayoutAnimationConfig skipExiting={isClosing}>
        <Animated.View
          key={index}
          // Skipped entirely until the first swipe, so arriving on this screen
          // never shows the push.
          entering={hasSwiped ? pushEntering : undefined}
          exiting={pushExiting}
          style={styles.page}>
          <View style={styles.header}>
            <OutfitTitleBlock
              title={outfit.title}
              time={outfit.time}
              category={outfit.category}
            />
          </View>
          <View
            style={styles.photoRow}
            onLayout={(e) => {
              // Ignored while the details panel is open — its rect reflects
              // the shrunk photo, and the chevrons should stay put rather
              // than following the photo down to its smaller size.
              if (showDetails) return;
              setPhotoRowRect({ top: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height });
            }}>
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
          {showDetails && (
            <Animated.View
              entering={panelEntering}
              exiting={panelExiting}
              style={styles.detailsWrap}>
              <OutfitDetailsCard items={outfit.items} />
            </Animated.View>
          )}
          <View style={[styles.toolbarWrap, { paddingBottom: insets.bottom + spacing.xxl }]}>
            <IconToolbar
              icons={[
                { name: 'info', onPress: () => setShowDetails((v) => !v) },
                { name: 'link' },
                { name: 'edit' },
              ]}
              style={styles.toolbar}
            />
          </View>
        </Animated.View>
      </LayoutAnimationConfig>
      {/* Siblings of the remounting Animated.View, not descendants — a chevron
          that lived inside it got unmounted and remounted by the very tap
          that pressed it, which is what made presses drop or feel "stuck".
          Held back until photoRowRect is measured so there's never a frame
          where they fall back to spanning the full screen. */}
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
      {/* Its own top-level, high-zIndex container rather than living inside
          the header row — the right chevron's absolutely-positioned hit
          region was overlapping it there and swallowing every tap. */}
      <Pressable
        onPress={() => setIsClosing(true)}
        hitSlop={spacing.sm}
        style={[styles.closeButton, { top: insets.top + spacing.md }]}>
        <Icon name="close" size={12} />
      </Pressable>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.xl,
    zIndex: 10,
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
  notFound: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  detailsWrap: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
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
