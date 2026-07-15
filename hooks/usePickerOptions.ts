import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PickerOption = {
  label: string;
  value: string;
};

const DEFAULT_CATEGORIES = [
  "Groceries",
  "Makeup",
  "Skincare",
  "Medicines",
  "Electronics",
  "Appliances",
];

const DEFAULT_REMINDERS: PickerOption[] = [
  { label: "Automatic (7 days before)", value: "automatic" },
  { label: "1 day before", value: "1day" },
  { label: "1 week before", value: "1week" },
  { label: "1 month before", value: "1month" },
];

export function useCategoryOptions() {
  const [options, setOptions] = useState<PickerOption[]>([]);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("USER_CATEGORIES");
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      setOptions([
        ...DEFAULT_CATEGORIES.map((item) => ({ label: item, value: item })),
        ...parsed.map((item) => ({ label: item, value: item })),
      ]);
    };

    load();
  }, []);

  const addCategory = useCallback(async (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;

    const saved = await AsyncStorage.getItem("USER_CATEGORIES");
    const parsed: string[] = saved ? JSON.parse(saved) : [];

    if (!parsed.includes(trimmed)) {
      const updated = [...parsed, trimmed];
      await AsyncStorage.setItem("USER_CATEGORIES", JSON.stringify(updated));
      setOptions((current) => [
        ...current,
        { label: trimmed, value: trimmed },
      ]);
    }
  }, []);

  return { options, addCategory };
}

export function useReminderOptions() {
  const [options, setOptions] = useState<PickerOption[]>([]);

  const getCustomLabel = (days: number) =>
    `Custom (${days} day${days === 1 ? "" : "s"} before)`;

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("USER_REMINDER_OPTIONS");
      const parsed = saved ? JSON.parse(saved) : [];
      const customOptions = Array.isArray(parsed)
        ? parsed
            .filter((item: unknown): item is number =>
              typeof item === "number" && item > 0,
            )
            .map((days: number) => ({
              label: getCustomLabel(days),
              value: `custom:${days}`,
            }))
        : [];

      setOptions([...DEFAULT_REMINDERS, ...customOptions]);
    };

    load();
  }, []);

  const addReminder = useCallback(async (days: number) => {
    if (!Number.isFinite(days) || days <= 0) return;

    const saved = await AsyncStorage.getItem("USER_REMINDER_OPTIONS");
    const parsed = saved ? JSON.parse(saved) : [];
    const existing = Array.isArray(parsed) ? parsed : [];

    if (!existing.includes(days)) {
      const updated = [...existing, days];
      await AsyncStorage.setItem("USER_REMINDER_OPTIONS", JSON.stringify(updated));
      setOptions((current) => [
        ...current,
        { label: getCustomLabel(days), value: `custom:${days}` },
      ]);
    }
  }, []);

  return { options, addReminder };
}
