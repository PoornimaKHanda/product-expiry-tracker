import { Alert, Linking } from "react-native";

import * as Notifications from "expo-notifications";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export type PermissionType =
    | "notifications"
    | "camera"
    | "location"
    | "mediaLibrary"
    | "contacts";

type CheckResult = { status: string; granted: boolean };

export async function checkPermission(type: PermissionType): Promise<CheckResult> {
    try {
        if (type === "notifications") {
            const cur = await Notifications.getPermissionsAsync();
            return {
                status: cur.status ?? "unknown",
                granted: !!(cur.granted || cur.status === "granted"),
            };
        }

        if (type === "camera") {
            const cur = await Camera.getCameraPermissionsAsync();
            return {
                status: cur.status ?? "unknown",
                granted: !!(cur.granted || cur.status === "granted"),
            };
        }

        if (type === "mediaLibrary") {
            const cur = await MediaLibrary.getPermissionsAsync();
            return {
                status: cur.status ?? "unknown",
                granted: !!(cur.granted || cur.status === "granted"),
            };
        }

        return { status: "unknown", granted: false };
    } catch {
        return { status: "error", granted: false };
    }
}

export async function ensurePermission(
    type: PermissionType,
    options?: {
        rationale?: {
            title: string;
            message: string;
        };
    }
): Promise<boolean> {
    const current = await checkPermission(type);

    // ✅ Already granted
    if (current.granted) return true;

    // ⚠️ Show rationale before asking
    if (options?.rationale) {
        await new Promise<void>((resolve) => {
            Alert.alert(
                options.rationale!.title,
                options.rationale!.message,
                [{ text: "Continue", onPress: () => resolve() }]
            );
        });
    }

    // 🔐 Request permission
    let result: { status?: string; granted?: boolean } = {};

    try {
        if (type === "notifications") {
            result = await Notifications.requestPermissionsAsync();
        } else if (type === "camera") {
            result = await Camera.requestCameraPermissionsAsync();
        } else if (type === "mediaLibrary") {
            result = await MediaLibrary.requestPermissionsAsync();
        }
    } catch (e) {
        console.error("Permission request failed", e);
        return false;
    }

    const granted = !!(result.granted || result.status === "granted");

    // ❌ If denied → guide to settings
    if (!granted) {
        Alert.alert(
            "Permission Required",
            "Please enable permission from settings to continue.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                },
            ]
        );
    }

    return granted;
}