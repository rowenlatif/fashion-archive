import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { colors, spacing } from '@/theme';

export type LinkedOutfitRowProps = {
  image?: ImageSource | number;
  title: string;
  date: string;
  tags: string[];
};

export function LinkedOutfitRow({ image, title, date, tags }: LinkedOutfitRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.thumb}>
        {image && <Image source={image} style={styles.image} contentFit="cover" />}
      </View>
      <View style={styles.info}>
        <Text variant="mono">{title}</Text>
        <Text variant="caption">{date}</Text>
        <View style={styles.tags}>
          {tags.map((tag, i) => (
            <Chip key={`${tag}-${i}`} label={tag} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.white,
    borderRadius: spacing.sm,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: spacing.sm,
    backgroundColor: colors.stroke.gray100,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
