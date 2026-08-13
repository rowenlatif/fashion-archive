import type { ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomBlur } from '@/components/bottom-blur';
import { CalendarView } from '@/components/calendar-view';
import { Fab } from '@/components/fab';
import { FabMenu } from '@/components/fab-menu';
import { MostWornCard } from '@/components/most-worn-card';
import { OutfitGrid } from '@/components/outfit-grid';
import type { ViewToggleValue } from '@/components/view-toggle';
import { useMostWornItems, useOutfits } from '@/data/outfits';
import { colors, spacing } from '@/theme';

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

type MonthDay = { date: number; image?: ImageSource; outfitId?: string } | null;

export default function HomeScreen() {
  const [view, setView] = useState<ViewToggleValue>('grid');
  const [menuOpen, setMenuOpen] = useState(false);
  // No bottom tab bar is rendered yet, so this only needs to clear the
  // home-indicator safe area — revisit once <AppTabs /> is back.
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: outfits = [] } = useOutfits();

  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const monthLabel = `${MONTH_NAMES[monthIndex]} ${year}`;
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

  const outfitsByDate = new Map(outfits.map((outfit) => [outfit.wornDate, outfit]));
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = new Date(year, monthIndex, 1).getDay();

  const monthDays: MonthDay[] = Array.from({ length: leadingBlanks }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${monthPrefix}-${String(d).padStart(2, '0')}`;
    const outfit = outfitsByDate.get(iso);
    monthDays.push({ date: d, image: outfit ? { uri: outfit.photoUrl } : undefined, outfitId: outfit?.id });
  }
  const trailingBlanks = (7 - (monthDays.length % 7)) % 7;
  for (let i = 0; i < trailingBlanks; i++) monthDays.push(null);

  const currentMonthOutfits = outfits.filter((outfit) => outfit.wornDate.startsWith(monthPrefix));
  const mostWorn = useMostWornItems(currentMonthOutfits);

  const outfitPhotos: ImageSource[] = outfits.map((outfit) => ({ uri: outfit.photoUrl }));
  const openGridOutfit = (index: number) => {
    const outfit = outfits[index];
    if (outfit) router.push(`/outfit/${outfit.id}`);
  };
  const openCalendarDay = (index: number) => {
    const outfitId = monthDays[index]?.outfitId;
    if (outfitId) router.push(`/outfit/${outfitId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}>
        <AppHeader value={view} onChange={setView} />
        {view === 'grid' ? (
          <View style={styles.gridWrap}>
            <OutfitGrid images={outfitPhotos} onPressImage={openGridOutfit} />
          </View>
        ) : (
          <View style={styles.calendarWrap}>
            <CalendarView month={monthLabel} days={monthDays} onPressDay={openCalendarDay} />
            <View>
              {mostWorn.map((item, i) => (
                <MostWornCard
                  key={i}
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  showRule={i > 0}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <BottomBlur />
      <View style={[styles.fabWrap, { bottom: insets.bottom + spacing.lg }]}>
        <Fab onPress={() => setMenuOpen(true)} />
      </View>
      <FabMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogOutfit={() => router.push('/log-outfit')}
        onCatalogItem={() => router.push('/catalog-item')}
      />
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
