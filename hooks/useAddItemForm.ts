import { fetchProductById, insertProduct, updateProduct } from "@/utils/db";
import { scheduleDevTestNotification, scheduleItemNotifications } from "@/utils/notifications";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

type FormState = {
    name: string;
    category: string;
    isExpiry: boolean;
    startDate?: string;
    endDate?: string;
    reminderOption: string;
    notes: string;
    isEdit: boolean;
};

export function useAddItemForm(id?: string) {
    const isEdit = Boolean(id);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [isExpiry, setIsExpiry] = useState(true);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [reminderOption, setReminderOption] = useState("automatic");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (!isEdit || !id) {
            return;
        }

        const product = fetchProductById(Number(id));
        if (!product) {
            Alert.alert("Item not found");
            router.back();
            return;
        }

        setName(product.name);
        setCategory(product.category || "");
        setIsExpiry(product.type === "expiry");
        setStartDate(product.start_date);
        setEndDate(product.end_date);
        setReminderOption(product.reminder_option || "automatic");
        setNotes(product.notes || "");
    }, [id, isEdit]);

    const onSave = useCallback(async () => {
        if (!name || !startDate || !endDate) {
            Alert.alert("Please fill required fields");
            return;
        }

        try {
            const type = isExpiry ? "expiry" : "warranty";
            const productId = isEdit && id ? Number(id) : insertProduct(name, category, type, startDate, endDate, reminderOption, notes);

            if (isEdit && id) {
                updateProduct(Number(id), name, category, type, startDate, endDate, reminderOption, notes);
            }

            await scheduleItemNotifications({
                id: productId,
                name,
                endDate,
                type,
                reminderOption,
            });

            router.back();
        } catch (error) {
            Alert.alert("Error saving item");
        }
    }, [category, endDate, id, isEdit, isExpiry, name, notes, reminderOption, startDate]);

    const onTestNotification = useCallback(async () => {
        try {
            const result = await scheduleDevTestNotification();

            Alert.alert(
                result.scheduled ? "Test notification scheduled" : "Notifications unavailable",
                result.scheduled
                    ? `You should receive a local notification in about 10 seconds.\n\nPermission: ${result.permissionGranted ? "granted" : "not granted"}\nScheduled count: ${result.scheduledCount}`
                    : `Permission: ${result.permissionGranted ? "granted" : "not granted"}\n\nCheck notification permissions for Expo Go, or use a development build if Expo Go cannot schedule notifications on this device.`,
            );
        } catch (error) {
            Alert.alert("Error scheduling test notification");
        }
    }, []);

    return {
        name,
        setName,
        category,
        setCategory,
        isExpiry,
        setIsExpiry,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        reminderOption,
        setReminderOption,
        notes,
        setNotes,
        isEdit,
        onSave,
        onTestNotification,
    };
}
