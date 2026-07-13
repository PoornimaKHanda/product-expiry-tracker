import { isRunningInExpoGo } from "expo";
import type { NotificationPermissionsStatus } from "expo-notifications";
import { Platform } from "react-native";

export const REMINDER_NOTIFICATION_CHANNEL_ID = "expiry-reminders";

const hasNotificationPermission = (settings: NotificationPermissionsStatus) => {
  const iosStatus = settings.ios?.status;

  return (
    settings.granted ||
    iosStatus === 2 ||
    iosStatus === 3 ||
    iosStatus === 4
  );
};

export async function setupNotificationPermissions() {
  // Actual notification behavior should be tested in a development build.
  // Expo Go on Android logs SDK 53+ remote notification warnings even though
  // this app only needs local reminders.
  if (__DEV__ && isRunningInExpoGo()) {
    return false;
  }

  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      REMINDER_NOTIFICATION_CHANNEL_ID,
      {
        name: "Expiry reminders",
        description: "Expiry and warranty reminder alerts",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563eb",
      },
    );
  }

  const currentSettings = await Notifications.getPermissionsAsync();

  if (hasNotificationPermission(currentSettings)) {
    return true;
  }

  const requestedSettings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return hasNotificationPermission(requestedSettings);
}
