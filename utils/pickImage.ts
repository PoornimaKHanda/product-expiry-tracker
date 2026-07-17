import { ensurePermission } from "@/hooks/usePermission";
import { strings } from "@/i18n";
import { Alert } from "react-native";

async function launchPicker(
  mode: "camera" | "library",
): Promise<string | null> {
  const ImagePicker = await import("expo-image-picker");

  const result =
    mode === "camera"
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.8,
        });

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  return result.assets[0].uri;
}

export async function pickImageFromCamera(): Promise<string | null> {
  const granted = await ensurePermission("camera", {
    rationale: {
      title: strings.cameraPermissionTitle,
      message: strings.cameraPermissionMessage,
    },
  });

  if (!granted) {
    return null;
  }

  return launchPicker("camera");
}

export async function pickImageFromLibrary(): Promise<string | null> {
  const ImagePicker = await import("expo-image-picker");

  // 👇 Your custom rationale (good UX)
  await new Promise<void>((resolve) => {
    Alert.alert(
      strings.photosPermissionTitle,
      strings.photosPermissionMessage,
      [{ text: "Continue", onPress: () => resolve() }]
    );
  });

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  return launchPicker("library");
}
