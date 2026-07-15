import { strings } from "@/i18n";
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
            Alert.alert(strings.itemNotFound);
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
            Alert.alert(strings.fillRequiredFields);
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
            Alert.alert(strings.errorSavingItem);
        }
    }, [category, endDate, id, isEdit, isExpiry, name, notes, reminderOption, startDate]);

    const onTestNotification = useCallback(async () => {
        try {
            const result = await scheduleDevTestNotification();

            Alert.alert(
                result.scheduled
                    ? strings.testNotificationScheduled
                    : strings.notificationsUnavailable,
                result.scheduled
                    ? `${strings.testNotificationPermissionInstructions}\n\n${strings.notificationPermissionStatus(result.permissionGranted)}\nScheduled count: ${result.scheduledCount}`
                    : `${strings.notificationPermissionStatus(result.permissionGranted)}\n\n${strings.testNotificationPermissionInstructions}`,
            );
        } catch (error) {
            Alert.alert(strings.errorSchedulingTestNotification);
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
