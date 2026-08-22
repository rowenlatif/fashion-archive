import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionSheet } from '@/components/action-sheet';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { DatePickerSheet } from '@/components/date-picker-sheet';
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

function formatDisplayDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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

  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [eventSheetVisible, setEventSheetVisible] = useState(false);
  const [dateSheetVisible, setDateSheetVisible] = useState(false);

  const selectedTag = tags.find((t) => t.id === tagId);
  const canSave = Boolean(photoUri && tagId && title.trim());

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const onSave = async () => {
    if (!canSave || !photoUri || !tagId) return;
    setError(null);
    try {
      const outfit = await createOutfit.mutateAsync({
        photoUri,
        wornDate: toISODate(date),
        title: title.trim(),
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
        <Pressable style={styles.previewWrap} onPress={() => setPhotoSheetVisible(true)}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Icon name="plus" size={20} />
              <Text variant="caption" color="black">
                Add Outfit Photo
              </Text>
            </View>
          )}
        </Pressable>

        <ItemPicker
          selectedIds={selectedItemIds}
          onToggle={toggleItem}
          onAddNew={() => router.push('/catalog-item')}
        />

        <View style={styles.field}>
          <View style={styles.fieldRow}>
            <Text variant="caption" color="gray">
              EVENT TYPE
            </Text>
            <View style={styles.fieldControl}>
              {selectedTag && (
                <View style={styles.selectedChipWrap}>
                  <Chip label={selectedTag.label} selected />
                  <Pressable onPress={() => setTagId(null)} hitSlop={spacing.sm}>
                    <Icon name="close" size={8} color="gray" />
                  </Pressable>
                </View>
              )}
              <Pressable onPress={() => setEventSheetVisible(true)} hitSlop={spacing.sm}>
                <Icon name="chevron" color="gray" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldRow}>
            <Text variant="caption" color="gray">
              DATE
            </Text>
            <View style={styles.fieldControl}>
              <Text variant="mono">{formatDisplayDate(date)}</Text>
              <Pressable onPress={() => setDateSheetVisible(true)} hitSlop={spacing.sm}>
                <Icon name="chevron" color="gray" />
              </Pressable>
            </View>
          </View>
        </View>

        <FormField label="TITLE" value={title} onChangeText={setTitle} placeholder="Name this outfit" />

        {error && (
          <Text variant="caption" color="gray">
            {error}
          </Text>
        )}

        <Button
          label={createOutfit.isPending ? 'Saving…' : 'Save Outfit'}
          onPress={onSave}
          disabled={!canSave || createOutfit.isPending}
        />
      </ScrollView>

      <ActionSheet visible={photoSheetVisible} onClose={() => setPhotoSheetVisible(false)} title="ADD PHOTO">
        <Pressable
          style={styles.sheetOption}
          onPress={async () => {
            setPhotoSheetVisible(false);
            const result = await pickFromLibrary();
            if (result) setPhotoUri(result.uri);
          }}>
          <Text variant="body">Photo Library</Text>
        </Pressable>
        <Pressable
          style={styles.sheetOption}
          onPress={async () => {
            setPhotoSheetVisible(false);
            const result = await takePhoto();
            if (result) setPhotoUri(result.uri);
          }}>
          <Text variant="body">Take Photo</Text>
        </Pressable>
      </ActionSheet>

      <ActionSheet visible={eventSheetVisible} onClose={() => setEventSheetVisible(false)} title="EVENT TYPE">
        <View style={styles.sheetChipRow}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.label}
              selected={tagId === tag.id}
              onPress={() => {
                setTagId(tag.id);
                setEventSheetVisible(false);
              }}
            />
          ))}
        </View>
      </ActionSheet>

      <DatePickerSheet
        visible={dateSheetVisible}
        value={date}
        onClose={() => setDateSheetVisible(false)}
        onChange={setDate}
      />
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
    gap: spacing.xxl,
  },
  previewWrap: {
    alignSelf: 'center',
    width: 160,
    height: 200,
    backgroundColor: colors.stroke.gray100,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  field: {
    gap: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  selectedChipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sheetOption: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  sheetChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
