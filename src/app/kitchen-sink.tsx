import { LinearGradient } from 'expo-linear-gradient';
import { useState, type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { CalendarDayCell } from '@/components/calendar-day-cell';
import { CalendarView } from '@/components/calendar-view';
import { Chip } from '@/components/chip';
import { Fab } from '@/components/fab';
import { Icon, type IconName } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { ItemCard } from '@/components/item-card';
import { MostWornCard } from '@/components/most-worn-card';
import { OutfitDetailsCard } from '@/components/outfit-details-card';
import { OutfitGrid } from '@/components/outfit-grid';
import { OutfitTitleBlock } from '@/components/outfit-title-block';
import { Rule } from '@/components/rule';
import { Text } from '@/components/text';
import { colors, gradients, spacing } from '@/theme';

const CAL_FIT_VIEW = require('@/assets/images/cal-fit-view.png');

const calendarDays = [
  null,
  null,
  null,
  ...Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    image: (i + 1) % 6 === 0 ? CAL_FIT_VIEW : undefined,
  })),
];

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text variant="mono" color="gray">
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Example({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <View style={styles.example}>
      <Text variant="caption">{label}</Text>
      {children}
    </View>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.swatchWrap}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

function GlassSwatch({ label }: { label: string }) {
  return (
    <View style={styles.swatchWrap}>
      <LinearGradient
        colors={gradients.grayGlass.colors}
        start={gradients.grayGlass.start}
        end={gradients.grayGlass.end}
        style={styles.swatch}
      />
      <Text variant="caption">{label}</Text>
    </View>
  );
}

const iconSet: IconName[] = ['grid', 'calendar', 'info', 'link', 'edit', 'close', 'chevron'];

const itemPhotos = [
  { image: require('@/assets/images/items/studded-off-shoulder-top.png'), label: 'Studded Off\nShoulder Top' },
  { image: require('@/assets/images/items/brown-tank-top.png'), label: 'Brown\nTank Top' },
  { image: require('@/assets/images/items/black-mini-skirt.png'), label: 'Black\nMini Skirt' },
  { image: require('@/assets/images/items/brown-boots.png'), label: 'Brown\nBoots' },
];

export default function KitchenSinkScreen() {
  const [view, setView] = useState<'grid' | 'calendar'>('grid');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Padded block: most components read fine inside the screen's margins. */}
        <View style={styles.padded}>
          <Text variant="title">Kitchen Sink</Text>

          <Section title="FOUNDATIONS — COLOR">
            <Example label="TEXT">
              <View style={styles.row}>
                <Swatch label="black" color={colors.text.black} />
                <Swatch label="white" color={colors.text.white} />
                <Swatch label="gray" color={colors.text.gray} />
              </View>
            </Example>
            <Example label="BACKGROUND">
              <View style={styles.row}>
                <Swatch label="white" color={colors.background.white} />
                <Swatch label="black" color={colors.background.black} />
                <Swatch label="black overlay" color={colors.background.blackOverlay} />
                <GlassSwatch label="gray glass" />
              </View>
            </Example>
            <Example label="BUTTON">
              <View style={styles.row}>
                <Swatch label="black" color={colors.button.black} />
                <Swatch label="white 90%" color={colors.button.white90} />
                <Swatch label="white 65%" color={colors.button.white65} />
                <GlassSwatch label="gray glass" />
              </View>
            </Example>
            <Example label="ICONS">
              <View style={styles.row}>
                <Swatch label="black" color={colors.icons.black} />
                <Swatch label="disabled" color={colors.icons.disabled} />
              </View>
            </Example>
            <Example label="STROKE">
              <View style={styles.row}>
                <Swatch label="gray 200" color={colors.stroke.gray200} />
                <Swatch label="gray 100" color={colors.stroke.gray100} />
              </View>
            </Example>
          </Section>

          <Section title="PRIMITIVES">
            <Example label="FAB">
              <Fab />
            </Example>
            <Example label="ICON — normal">
              <View style={styles.row}>
                {iconSet.map((name) => (
                  <Icon key={name} name={name} />
                ))}
              </View>
            </Example>
            <Example label="ICON BUTTON — normal / disabled (only grid + calendar have a disabled state)">
              <View style={styles.row}>
                <IconButton name="grid" />
                <IconButton name="grid" disabled />
                <IconButton name="calendar" />
                <IconButton name="calendar" disabled />
              </View>
            </Example>
            <Example label="ITEM CARD">
              <View style={styles.row}>
                {itemPhotos.map((item) => (
                  <ItemCard key={item.label} image={item.image} label={item.label} />
                ))}
              </View>
            </Example>
            <Example label="CALENDAR DAY CELL">
              <View style={styles.dayCellDemo}>
                <CalendarDayCell date={7} image={require('@/assets/images/cal-fit-view.png')} />
              </View>
            </Example>
            <Example label="OUTFIT TITLE BLOCK">
              <OutfitTitleBlock title="CASUAL 1" time="FRI, 18 MAY 2026" category="NIGHT OUT" />
            </Example>
          </Section>

          <Section title="COMPONENTS">
            <Example label="APP HEADER">
              <View style={styles.stretch}>
                <AppHeader value={view} onChange={setView} />
              </View>
            </Example>
            <Example label="OUTFIT DETAILS CARD">
              <OutfitDetailsCard items={itemPhotos} />
            </Example>
            <Example label="MOST WORN CARD">
              <MostWornCard image={CAL_FIT_VIEW} title="Most Worn This Month" subtitle="Miu Miu Heels • 6 Days" />
            </Example>
            <Example label="OUTFIT GRID">
              <OutfitGrid images={[CAL_FIT_VIEW, CAL_FIT_VIEW, CAL_FIT_VIEW, CAL_FIT_VIEW, CAL_FIT_VIEW, CAL_FIT_VIEW]} />
            </Example>
          </Section>
        </View>

        {/* Unpadded block: CalendarView is full-bleed by design (matches the
            402px Figma screen width) — rendered with no padded ancestor
            instead of faking a breakout with negative margins. */}
        <View style={styles.calendarLabel}>
          <Text variant="caption">CALENDAR VIEW</Text>
        </View>
        <CalendarView month="april 2026" days={calendarDays} />

        <View style={styles.padded}>
          <Section title="COMPONENTS (cont.)">
            <Example label="BOTTOM SHEET">
              <BottomSheet
                preview={{ image: CAL_FIT_VIEW, label: 'Platform Knee High Boots' }}
                outfits={[
                  { image: CAL_FIT_VIEW, title: 'Title', date: 'Sat, Feb 7 2026', tags: ['Tag', 'Tag'] },
                  { image: CAL_FIT_VIEW, title: 'Title', date: 'Sat, Feb 7 2026', tags: ['Tag', 'Tag'] },
                ]}
              />
            </Example>
          </Section>

          <Section title="TEXT">
            <Example label="title (instrument/title)">
              <Text variant="title">The quick brown fox</Text>
            </Example>
            <Example label="body (instrument/body)">
              <Text variant="body">The quick brown fox jumps over the lazy dog</Text>
            </Example>
            <Example label="mono (ibm/body)">
              <Text variant="mono">THE QUICK BROWN FOX JUMPS</Text>
            </Example>
            <Example label="caption (ibm/caption)">
              <Text variant="caption">THE QUICK BROWN FOX JUMPS</Text>
            </Example>
          </Section>

          <Section title="RULE">
            <Example label="gray200 (default)">
              <Rule />
            </Example>
            <Example label="gray100">
              <Rule color="gray100" />
            </Example>
          </Section>

          <Section title="CHIP">
            <View style={styles.row}>
              <Chip label="Tag" />
              <Chip label="Night Out" />
            </View>
          </Section>

          <Section title="BUTTON">
            <Example label="primary">
              <Button label="Primary" variant="primary" />
            </Example>
            <Example label="primary — disabled">
              <Button label="Primary" variant="primary" disabled />
            </Example>
            <Example label="secondary (white 90%)">
              <Button label="Secondary" variant="secondary" />
            </Example>
            <Example label="secondary — disabled">
              <Button label="Secondary" variant="secondary" disabled />
            </Example>
            <Example label="tertiary (white 65%)">
              <Button label="Tertiary" variant="tertiary" />
            </Example>
            <Example label="tertiary — disabled">
              <Button label="Tertiary" variant="tertiary" disabled />
            </Example>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  content: {
    width: '100%',
    paddingVertical: spacing.xl,
    gap: spacing.xxl,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  calendarLabel: {
    paddingHorizontal: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionBody: {
    gap: spacing.lg,
  },
  example: {
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatchWrap: {
    gap: spacing.xs,
    alignItems: 'center',
    width: 72,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: spacing.xs,
    borderWidth: 0.5,
    borderColor: colors.stroke.gray200,
  },
  dayCellDemo: {
    width: 57.19,
  },
});
