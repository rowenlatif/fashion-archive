import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { FormField } from '@/components/form-field';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { useCreateItem } from '@/data/items';
import { useImagePicker } from '@/hooks/use-image-picker';
import { colors, spacing } from '@/theme';
import { ITEM_CATEGORIES, type ImageSourceKind, type ItemCategory } from '@/types/domain';

function categoryLabel(category: ItemCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function CatalogItemScreen() {
  const router = useRouter();
  const { pickFromLibrary, takePhoto } = useImagePicker();
  const createItem = useCreateItem();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [color, setColor] = useState('');
  const [imageKind, setImageKind] = useState<ImageSourceKind | null>(null);
  const [imageUri, setImageUri] = useState('');
  const [error, setError] = useState<string | null>(null);

  const previewUri = imageUri.trim();

  const onPickLibrary = async () => {
    const result = await pickFromLibrary();
    if (!result) return;
    setImageKind('upload');
    setImageUri(result.uri);
  };

  const onTakePhoto = async () => {
    const result = await takePhoto();
    if (!result) return;
    setImageKind('camera');
    setImageUri(result.uri);
  };

  const onSave = async () => {
    setError(null);
    if (!title.trim() || !category || !color.trim() || !imageKind || !previewUri) {
      setError('Title, category, color, and an image are all required.');
      return;
    }
    try {
      await createItem.mutateAsync({
        title: title.trim(),
        category,
        color: color.trim(),
        image: { kind: imageKind, uri: previewUri },
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong saving this item.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={spacing.sm}>
          <Icon name="close" size={12} />
        </Pressable>
        <Text variant="body">Catalog an Item</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewWrap}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.preview} contentFit="contain" />
          ) : null}
        </View>
        <View style={styles.imageSources}>
          <Pressable style={styles.imageSourceOption} onPress={onPickLibrary}>
            <Text variant="caption">Photo Library</Text>
          </Pressable>
          <Pressable style={styles.imageSourceOption} onPress={onTakePhoto}>
            <Text variant="caption">Take Photo</Text>
          </Pressable>
          <Pressable style={styles.imageSourceOption} onPress={() => setImageKind('link')}>
            <Text variant="caption">Paste a Link</Text>
          </Pressable>
        </View>
        {imageKind === 'link' && (
          <FormField
            label="IMAGE URL"
            value={imageUri}
            onChangeText={setImageUri}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://…"
          />
        )}

        <FormField label="TITLE" value={title} onChangeText={setTitle} />
        <FormField label="COLOR" value={color} onChangeText={setColor} />

        <View style={styles.field}>
          <Text variant="caption" color="gray">
            CATEGORY
          </Text>
          <View style={styles.chipRow}>
            {ITEM_CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={categoryLabel(c)}
                selected={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
        </View>

        {error && (
          <Text variant="caption" color="gray">
            {error}
          </Text>
        )}

        <Button
          label={createItem.isPending ? 'Saving…' : 'Save Item'}
          onPress={onSave}
          disabled={createItem.isPending}
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
    height: 160,
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
});
