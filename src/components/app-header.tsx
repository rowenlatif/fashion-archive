import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { ViewToggle, type ViewToggleProps } from '@/components/view-toggle';
import { spacing } from '@/theme';

export type AppHeaderProps = ViewToggleProps;

// Note: no in-app status bar is rendered here — that's OS chrome in the Figma
// mockup, drawn by the system on a real device, not something the app owns.
export function AppHeader({ value, onChange }: AppHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="title">ROWEN ARCHIVE</Text>
      <ViewToggle value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
});
