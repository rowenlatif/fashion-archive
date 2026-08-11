import { StyleSheet, View } from 'react-native';

import { CalendarDayCell, type CalendarDayCellProps } from '@/components/calendar-day-cell';
import { IconButton } from '@/components/icon-button';
import { Text } from '@/components/text';
import { spacing } from '@/theme';

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export type CalendarViewProps = {
  month: string;
  days: (Pick<CalendarDayCellProps, 'date' | 'image'> | null)[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
};

export function CalendarView({ month, days, onPrevMonth, onNextMonth }: CalendarViewProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <IconButton name="chevron" rotation={90} tone="solid" onPress={onPrevMonth} />
        <Text variant="body">{month}</Text>
        <IconButton name="chevron" rotation={270} tone="solid" onPress={onNextMonth} />
      </View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} variant="caption" color="gray" style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((day, i) => (
          <View key={i} style={styles.column}>
            {day && <CalendarDayCell {...day} />}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  weekdays: {
    flexDirection: 'row',
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
