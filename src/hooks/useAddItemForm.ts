import { strings } from "@/src/i18n";
import { ProductService } from "@/src/services/ProductService";
import { scheduleDevTestNotification, scheduleItemNotifications } from "@/src/utils/notifications";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAddItemForm(id?: string) {
    const isEdit = Boolean(id);
    const today = new Date().toISOString().split("T")[0];

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [isExpiry, setIsExpiry] = useState(true);
    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [reminderOption, setReminderOption] = useState("automatic");
    const [notes, setNotes] = useState("");

    // 👉 Now holds TEMP URIs (not persisted yet)
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isAttachmentBusy, setIsAttachmentBusy] = useState(false);

    // ✅ Load existing product (EDIT mode)
    useEffect(() => {
        if (!isEdit || !id) return;

        const product = ProductService.getProductById(Number(id));

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

        // already parsed by service
        setAttachments(product.attachments);
    }, [id]);

    // ✅ Add attachment (TEMP only)
    const addAttachment = useCallback(async (sourceUri: string) => {
        setIsAttachmentBusy(true);
        try {
            setAttachments((current) => [...current, sourceUri]);
        } catch {
            Alert.alert(strings.errorSavingAttachment);
        } finally {
            setIsAttachmentBusy(false);
        }
    }, []);

    // ✅ Remove attachment (TEMP only)
    const removeAttachment = useCallback((uri: string) => {
        setAttachments((current) => current.filter((item) => item !== uri));
    }, []);

    // ✅ Save (ALL logic delegated to ProductService)
    const onSave = useCallback(async () => {
        console.log("clicked")
        if (!name || !startDate || !endDate) {
            Alert.alert(strings.fillRequiredFields);
            return;
        }

        try {
            const type = isExpiry ? "expiry" : "warranty";

            let productId: number;

            if (isEdit && id) {
                await ProductService.updateProduct(Number(id), {
                    name,
                    category,
                    type,
                    startDate,
                    endDate,
                    reminderOption,
                    notes,
                    tempAttachments: attachments,
                });

                productId = Number(id);
            } else {
                productId = await ProductService.createProduct({
                    name,
                    category,
                    type,
                    startDate,
                    endDate,
                    reminderOption,
                    notes,
                    tempAttachments: attachments,
                });
            }

            // ✅ Notifications still triggered here (UI concern)
            await scheduleItemNotifications({
                id: productId,
                name,
                endDate,
                type,
                reminderOption,
            });

            router.back();
        } catch (error) {
            console.error("SAVE ERROR:", error);
            Alert.alert(strings.errorSavingItem);
        }
    }, [
        attachments,
        category,
        endDate,
        id,
        isEdit,
        isExpiry,
        name,
        notes,
        reminderOption,
        startDate,
    ]);

    // ✅ Dev testing helper (unchanged)
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
        attachments,
        addAttachment,
        removeAttachment,
        isAttachmentBusy,
        isEdit,
        onSave,
        onTestNotification,
    };

}