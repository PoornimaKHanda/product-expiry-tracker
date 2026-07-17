import { Alert, Linking } from "react-native";

export type PermissionType =
    | "notifications"
    | "camera"
    | "location"
    | "mediaLibrary"
    | "contacts";

type CheckResult = { status: string; granted: boolean };

async function safeImport(moduleName: string) {
    try {
        // dynamic import so bundlers/tree-shakers don't force native modules in Expo Go
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return await import(moduleName as any);
    } catch (e) {
        return null;
    }
}

export async function checkPermission(type: PermissionType): Promise<CheckResult> {
    try {
        if (type === "notifications") {
            const Notifications = await safeImport("expo-notifications");
            if (!Notifications) return { status: "unavailable", granted: false };
            const cur = await Notifications.getPermissionsAsync();
            const granted = !!(cur.granted || cur.status === "granted");
            return { status: cur.status ?? "unknown", granted };
        }

        if (type === "camera") {
            const Camera = await safeImport("expo-camera");
            if (!Camera) return { status: "unavailable", granted: false };
            const cur = await (Camera.getCameraPermissionsAsync?.() ?? Camera.getPermissionsAsync?.());
            const granted = !!(cur?.granted || cur?.status === "granted");
            return { status: cur?.status ?? "unknown", granted };
        }

        if (type === "location") {
            const Location = await safeImport("expo-location");
            if (!Location) return { status: "unavailable", granted: false };
            const cur = await (Location.getForegroundPermissionsAsync?.() ?? Location.getPermissionsAsync?.());
            const granted = !!(cur?.granted || cur?.status === "granted");
            return { status: cur?.status ?? "unknown", granted };
        }

        if (type === "mediaLibrary") {
            const Media = await safeImport("expo-media-library");
            if (!Media) return { status: "unavailable", granted: false };
            const cur = await (Media.getPermissionsAsync?.() ?? Media.getMediaLibraryPermissionsAsync?.());
            const granted = !!(cur?.granted || cur?.status === "granted");
            return { status: cur?.status ?? "unknown", granted };
        }

        if (type === "contacts") {
            const Contacts = await safeImport("expo-contacts");
            if (!Contacts) return { status: "unavailable", granted: false };
            const cur = await Contacts.getPermissionsAsync?.();
            const granted = !!(cur?.granted || cur?.status === "granted");
            return { status: cur?.status ?? "unknown", granted };
        }

        return { status: "unknown", granted: false };
    } catch (e) {
        return { status: "error", granted: false };
    }
}

export async function requestPermission(type: PermissionType): Promise<CheckResult> {
    try {
        if (type === "notifications") {
            const Notifications = await safeImport("expo-notifications");
            if (!Notifications) return { status: "unavailable", granted: false };
            const req = await Notifications.requestPermissionsAsync();
            const granted = !!(req.granted || req.status === "granted");
            return { status: req.status ?? "unknown", granted };
        }

        if (type === "camera") {
            const Camera = await safeImport("expo-camera");
            if (!Camera) return { status: "unavailable", granted: false };
            const req = await (Camera.requestCameraPermissionsAsync?.() ?? Camera.requestPermissionsAsync?.());
            const granted = !!(req?.granted || req?.status === "granted");
            return { status: req?.status ?? "unknown", granted };
        }

        if (type === "location") {
            const Location = await safeImport("expo-location");
            if (!Location) return { status: "unavailable", granted: false };
            const req = await (Location.requestForegroundPermissionsAsync?.() ?? Location.requestPermissionsAsync?.());
            const granted = !!(req?.granted || req?.status === "granted");
            return { status: req?.status ?? "unknown", granted };
        }

        if (type === "mediaLibrary") {
            const Media = await safeImport("expo-media-library");
            if (!Media) return { status: "unavailable", granted: false };
            const req = await (Media.requestPermissionsAsync?.() ?? Media.requestMediaLibraryPermissionsAsync?.());
            const granted = !!(req?.granted || req?.status === "granted");
            return { status: req?.status ?? "unknown", granted };
        }

        if (type === "contacts") {
            const Contacts = await safeImport("expo-contacts");
            if (!Contacts) return { status: "unavailable", granted: false };
            const req = await Contacts.requestPermissionsAsync?.();
            const granted = !!(req?.granted || req?.status === "granted");
            return { status: req?.status ?? "unknown", granted };
        }

        return { status: "unknown", granted: false };
    } catch (e) {
        return { status: "error", granted: false };
    }
}

export async function ensurePermission(
    type: PermissionType,
    options?: { rationale?: { title: string; message: string } }
): Promise<boolean> {
    const cur = await checkPermission(type);
    if (cur.granted) return true;

    const requested = await requestPermission(type);
    if (requested.granted) return true;

    // If still denied, show rationale and offer to open settings
    const rationale = options?.rationale;
    return new Promise((resolve) => {
        const title = rationale?.title ?? "Permission required";
        const message = rationale?.message ??
            "This feature requires additional permissions. Open settings to enable it.";
        Alert.alert(title, message, [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            {
                text: "Open Settings",
                onPress: async () => {
                    try {
                        await Linking.openSettings();
                    } catch (e) {
                        // noop
                    }
                    resolve(false);
                },
            },
        ]);
    });
}

export default {
    checkPermission,
    requestPermission,
    ensurePermission,
};
