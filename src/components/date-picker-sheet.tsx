import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ActionSheet } from '@/components/action-sheet';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type DatePickerSheetProps = {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onChange: (date: Date) => void;
};

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DatePickerSheet({ visible, value, onClose, onChange }: DatePickerSheetProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  // Resync the visible month to the current value each time the sheet opens
  // (adjusting state during render, per https://react.dev/learn/you-might-not-need-an-effect).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setViewMonth(startOfMonth(value));
  }

  const leadingBlanks = startOfMonth(viewMonth).getDay();
  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth(viewMonth) }, (_, i) => i + 1),
  ];

  return (
    <ActionSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Pressable onPress={() => setViewMonth((m) => addMonths(m, -1))} hitSlop={spacing.sm}>
          <Icon name="chevron" rotation={90} color="gray" />
        </Pressable>
        <Text variant="body">
          {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </Text>
        <Pressable onPress={() => setViewMonth((m) => addMonths(m, 1))} hitSlop={spacing.sm}>
          <Icon name="chevron" rotation={270} color="gray" />
        </Pressable>
      </View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} variant="micro" color="gray" style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, i) => {
          const cellDate = day ? new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day) : null;
          const selected = Boolean(cellDate && isSameDay(cellDate, value));
          return (
            <View key={i} style={styles.column}>
              {cellDate && (
                <Pressable
                  style={[styles.day, selected && styles.daySelected]}
                  onPress={() => {
                    onChange(cellDate);
                    onClose();
                  }}>
                  <Text variant="mono" color={selected ? 'white' : undefined}>
                    {day}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
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
  column: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: colors.background.black,
  },
});
