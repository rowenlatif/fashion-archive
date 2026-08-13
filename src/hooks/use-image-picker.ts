import * as ImagePicker from 'expo-image-picker';

export type PickedImage = { uri: string };

export function useImagePicker() {
  async function pickFromLibrary(): Promise<PickedImage | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return null;
    return { uri: result.assets[0].uri };
  }

  async function takePhoto(): Promise<PickedImage | null> {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return null;
    return { uri: result.assets[0].uri };
  }

  return { pickFromLibrary, takePhoto };
}
