import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { FormField } from '@/components/form-field';
import { Icon } from '@/components/icon';
import { ItemPicker } from '@/components/item-picker';
import { Text } from '@/components/text';
import { useCreateOutfit } from '@/data/outfits';
import { useEventTypeTags } from '@/data/tags';
import { useImagePicker } from '@/hooks/use-image-picker';
import { colors, spacing } from '@/theme';

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function LogOutfitScreen() {
  const router = useRouter();
  const { pickFromLibrary, takePhoto } = useImagePicker();
  const { data: tags = [] } = useEventTypeTags();
  const createOutfit = useCreateOutfit();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [tagId, setTagId] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date());
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedTag = tags.find((t) => t.id === tagId);

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSave = async () => {
    setError(null);
    if (!photoUri) {
      setError('Add a photo of the outfit.');
      return;
    }
    if (!tagId) {
      setError('Pick an event type.');
      return;
    }
    const finalTitle =
      title.trim() ||
      (selectedTag ? `${selectedTag.label.toUpperCase()} — ${MONTHS[date.getMonth()]} ${date.getDate()}` : '');
    try {
      const outfit = await createOutfit.mutateAsync({
        photoUri,
        wornDate: toISODate(date),
        title: finalTitle,
        tagId,
        itemIds: selectedItemIds,
      });
      router.replace(`/outfit/${outfit.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong saving this outfit.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={spacing.sm}>
          <Icon name="close" size={12} />
        </Pressable>
        <Text variant="body">Log an Outfit</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewWrap}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" /> : null}
        </View>
        <View style={styles.imageSources}>
          <Pressable
            style={styles.imageSourceOption}
            onPress={async () => {
              const result = await pickFromLibrary();
              if (result) setPhotoUri(result.uri);
            }}>
            <Text variant="caption">Photo Library</Text>
          </Pressable>
          <Pressable
            style={styles.imageSourceOption}
            onPress={async () => {
              const result = await takePhoto();
              if (result) setPhotoUri(result.uri);
            }}>
            <Text variant="caption">Take Photo</Text>
          </Pressable>
        </View>

        <ItemPicker
          selectedIds={selectedItemIds}
          onToggle={toggleItem}
          onAddNew={() => router.push('/catalog-item')}
        />

        <View style={styles.field}>
          <Text variant="caption" color="gray">
            EVENT TYPE
          </Text>
          <View style={styles.chipRow}>
            {tags.map((tag) => (
              <Chip key={tag.id} label={tag.label} selected={tagId === tag.id} onPress={() => setTagId(tag.id)} />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="gray">
            DATE
          </Text>
          <View style={styles.dateRow}>
            <Pressable onPress={() => setDate((d) => addDays(d, -1))} hitSlop={spacing.sm}>
              <Icon name="chevron" rotation={90} />
            </Pressable>
            <Text variant="mono">{toISODate(date)}</Text>
            <Pressable onPress={() => setDate((d) => addDays(d, 1))} hitSlop={spacing.sm}>
              <Icon name="chevron" rotation={270} />
            </Pressable>
          </View>
        </View>

        <FormField
          label="TITLE (OPTIONAL)"
          value={title}
          onChangeText={setTitle}
          placeholder={selectedTag ? `${selectedTag.label.toUpperCase()} — …` : undefined}
        />

        {error && (
          <Text variant="caption" color="gray">
            {error}
          </Text>
        )}

        <Button
          label={createOutfit.isPending ? 'Saving…' : 'Save Outfit'}
          onPress={onSave}
          disabled={createOutfit.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerSpacer: {
    width: 12,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  previewWrap: {
    alignSelf: 'center',
    width: 160,
    height: 200,
    backgroundColor: colors.stroke.gray100,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  imageSources: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageSourceOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  field: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
