import { ensurePermission } from "@/hooks/usePermission";
import { strings } from "@/i18n";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

export const REMINDER_NOTIFICATION_CHANNEL_ID = "expiry-reminders";
export const REMINDER_OFFSETS_DAYS = [30, 7, 0] as const;

export type TrackableType = "expiry" | "warranty";
export type ReminderOptionValue = string;
export type ReminderOffsetDays = number;

type NotificationSetupOptions = {
  allowExpoGo?: boolean;
};

type ScheduleItemNotificationInput = {
  id: number;
  name: string;
  endDate: string;
  type: TrackableType;
  reminderOption?: ReminderOptionValue;
  allowExpoGo?: boolean;
};

const hasNotificationPermission = (settings: {
  granted: boolean;
  ios?: {
    status?: number;
  };
}) => {
  const iosStatus = settings.ios?.status;

  return (
    settings.granted ||
    iosStatus === 2 ||
    iosStatus === 3 ||
    iosStatus === 4
  );
};

export async function setupNotificationPermissions(
  options: NotificationSetupOptions = {},
) {
  // Actual notification behavior should be tested in a development build.
  // Expo Go on Android logs SDK 53+ remote notification warnings even though
  // this app only needs local reminders.
  if (__DEV__ && isRunningInExpoGo() && !options.allowExpoGo) {
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
        name: strings.notificationChannelName,
        description: strings.notificationChannelDescription,
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

const getItemNotificationIdentifier = (
  productId: number,
  type: TrackableType,
  offsetDays: ReminderOffsetDays,
) => `product-${productId}-${type}-${offsetDays}-days`;

const getReminderDate = (endDate: string, offsetDays: ReminderOffsetDays) => {
  const [year, month, day] = endDate.split("-").map(Number);
  const reminderDate = new Date(year, month - 1, day, 9, 0, 0, 0);

  reminderDate.setDate(reminderDate.getDate() - offsetDays);

  return reminderDate;
};

const getReminderOffsets = (reminderOption: ReminderOptionValue | undefined) => {
  if (!reminderOption || reminderOption === "automatic") {
    return [7, 0];
  }

  if (reminderOption === "1day") {
    return [1];
  }

  if (reminderOption === "1week") {
    return [7];
  }

  if (reminderOption === "1month") {
    return [30];
  }

  if (reminderOption.startsWith("custom:")) {
    const parsedDays = Number(reminderOption.split(":")[1]);

    if (Number.isFinite(parsedDays) && parsedDays > 0) {
      return [parsedDays];
    }
  }

  return [7, 0];
};

const getNotificationCopy = (
  name: string,
  type: TrackableType,
  offsetDays: ReminderOffsetDays,
) => {
  if (type === "expiry") {
    return {
      title: offsetDays === 0 ? strings.productExpiresToday : strings.productExpiringSoon,
      body: offsetDays === 0
        ? strings.productExpiresTodayBody(name)
        : strings.productExpiringSoonBody(name, offsetDays),
    };
  }

  return {
    title:
      offsetDays === 0 ? strings.warrantyEndsToday : strings.warrantyEndingSoon,
    body: offsetDays === 0
      ? strings.warrantyEndsTodayBody(name)
      : strings.warrantyEndingSoonBody(name, offsetDays),
  };
};

export async function cancelItemNotifications(productId: number) {
  const Notifications = await import("expo-notifications");

  await Promise.all(
    (["expiry", "warranty"] as const).flatMap((type) =>
      [1, 7, 30, 0].map((offsetDays) =>
        Notifications.cancelScheduledNotificationAsync(
          getItemNotificationIdentifier(productId, type, offsetDays as ReminderOffsetDays),
        ),
      ),
    ),
  );
}

export async function scheduleItemNotifications({
  id,
  name,
  endDate,
  type,
  reminderOption,
  allowExpoGo = true,
}: ScheduleItemNotificationInput) {
  const ensured = await ensurePermission("notifications", {
    rationale: {
      title: "Allow notifications",
      message: strings.testNotificationPermissionInstructions,
    },
  });

  if (!ensured) return [];

  const canSendNotifications = await setupNotificationPermissions({
    allowExpoGo,
  });

  if (!canSendNotifications) return [];

  await cancelItemNotifications(id);

  const Notifications = await import("expo-notifications");
  const now = new Date();
  const scheduledIds: string[] = [];
  const reminderOffsets = getReminderOffsets(reminderOption);

  for (const offsetDays of reminderOffsets) {
    const reminderDate = getReminderDate(endDate, offsetDays);

    if (reminderDate <= now) {
      continue;
    }

    const { title, body } = getNotificationCopy(name, type, offsetDays);
    const identifier = getItemNotificationIdentifier(id, type, offsetDays);

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        data: {
          productId: id,
          type,
          offsetDays,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
        channelId: REMINDER_NOTIFICATION_CHANNEL_ID,
      },
    });

    scheduledIds.push(identifier);
  }

  return scheduledIds;
}

export async function scheduleDevTestNotification() {
  const Notifications = await import("expo-notifications");
  const ensured = await ensurePermission("notifications", {
    rationale: {
      title: "Allow notifications",
      message: strings.testNotificationPermissionInstructions,
    },
  });

  const permissionSettings = await Notifications.getPermissionsAsync();

  if (!ensured) {
    return {
      scheduled: false,
      permissionGranted: permissionSettings.granted,
      scheduledCount: 0,
    };
  }

  const identifier = `dev-test-${Date.now()}`;

  const scheduledIdentifier = await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: strings.testReminderTitle,
      body: strings.testReminderBody,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      channelId: REMINDER_NOTIFICATION_CHANNEL_ID,
    },
  });
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  return {
    scheduled: true,
    identifier: scheduledIdentifier,
    permissionGranted: permissionSettings.granted,
    scheduledCount: scheduledNotifications.length,
  };
}
