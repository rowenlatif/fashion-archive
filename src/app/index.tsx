import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomBlur } from '@/components/bottom-blur';
import { CalendarView } from '@/components/calendar-view';
import { Fab } from '@/components/fab';
import { MostWornCard } from '@/components/most-worn-card';
import { OutfitGrid } from '@/components/outfit-grid';
import type { ViewToggleValue } from '@/components/view-toggle';
import { colors, spacing } from '@/theme';

const OUTFIT_PHOTO = require('@/assets/images/cal-fit-view.png');
const outfitPhotos = Array.from({ length: 30 }, () => OUTFIT_PHOTO);

// Mock: April 2026 — 1st falls on Wednesday, so 3 leading blanks; 2 trailing
// blanks fill out the last week. A few days are left without a logged
// outfit so the grid doesn't look mechanically filled in.
const NO_OUTFIT_DAYS = new Set([3, 7, 8, 12, 16, 20, 21, 25, 29]);

const APRIL_DAYS = [
  null,
  null,
  null,
  ...Array.from({ length: 30 }, (_, i) => {
    const date = i + 1;
    return { date, image: NO_OUTFIT_DAYS.has(date) ? undefined : OUTFIT_PHOTO };
  }),
  null,
  null,
];

const MOST_WORN = [
  { title: 'Most Worn This Month', subtitle: 'Miu Miu Heels • 6 Days' },
  { title: 'Most Worn This Month', subtitle: 'Miu Miu Heels • 6 Days' },
];

export default function HomeScreen() {
  const [view, setView] = useState<ViewToggleValue>('grid');
  // No bottom tab bar is rendered yet, so this only needs to clear the
  // home-indicator safe area — revisit once <AppTabs /> is back.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // Demo-only: every tile/day opens the same mock outfit for now — see
  // src/app/outfit/[id].tsx. Replace once tiles/days carry a real outfit id.
  const openOutfit = () => router.push('/outfit/1');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}>
        <AppHeader value={view} onChange={setView} />
        {view === 'grid' ? (
          <View style={styles.gridWrap}>
            <OutfitGrid images={outfitPhotos} onPressImage={openOutfit} />
          </View>
        ) : (
          <View style={styles.calendarWrap}>
            <CalendarView month="april 2026" days={APRIL_DAYS} onPressDay={openOutfit} />
            <View>
              {MOST_WORN.map((item, i) => (
                <MostWornCard key={i} title={item.title} subtitle={item.subtitle} showRule={i > 0} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <BottomBlur />
      <View style={[styles.fabWrap, { bottom: insets.bottom + spacing.lg }]}>
        <Fab />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  content: {
    paddingTop: spacing.md,
  },
  gridWrap: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.xxl,
  },
  calendarWrap: {
    marginTop: spacing.tight,
    gap: spacing.tight,
  },
  fabWrap: {
    position: 'absolute',
    right: spacing.xxl,
  },
});
