import { Pressable, StyleSheet, View } from 'react-native';

import { CalendarDayCell, type CalendarDayCellProps } from '@/components/calendar-day-cell';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { spacing } from '@/theme';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export type CalendarViewProps = {
  month: string;
  days: (Pick<CalendarDayCellProps, 'date' | 'image'> | null)[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  // Demo-only wiring: every day opens the same mock outfit for now — see
  // src/app/outfit/[id].tsx. Replace once days carry a real outfit id.
  onPressDay?: (index: number) => void;
};

export function CalendarView({ month, days, onPrevMonth, onNextMonth, onPressDay }: CalendarViewProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={spacing.sm}>
          <Icon name="chevron" rotation={90} />
        </Pressable>
        <Text variant="title">{month}</Text>
        <Pressable onPress={onNextMonth} hitSlop={spacing.sm}>
          <Icon name="chevron" rotation={270} />
        </Pressable>
      </View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} variant="micro" style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((day, i) => (
          <View key={i} style={styles.column}>
            <CalendarDayCell
              date={day?.date}
              image={day?.image}
              onPress={onPressDay && (() => onPressDay(i))}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Root needs an explicit full width — without it, the view has no definite
  // width to stretch to and the flex/percentage children below can't reliably
  // divide the row into 7 equal columns.
  root: {
    width: '100%',
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
  },
  weekdays: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // 7 columns as a percentage of the grid width, not a fixed pixel size —
  // see calendar-day-cell.tsx for why fixed widths broke on real screens.
  column: {
    width: `${100 / 7}%`,
  },
});
