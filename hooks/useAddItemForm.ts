import { strings } from "@/i18n";
import { fetchProductById, insertProduct, parseAttachments, updateProduct } from "@/utils/db";
import {
    deleteAttachmentFile,
    finalizePendingAttachments,
    saveAttachmentFromUri,
    syncRemovedAttachments,
} from "@/utils/attachments";
import { scheduleDevTestNotification, scheduleItemNotifications } from "@/utils/notifications";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export function useAddItemForm(id?: string) {
    const isEdit = Boolean(id);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [isExpiry, setIsExpiry] = useState(true);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [reminderOption, setReminderOption] = useState("automatic");
    const [notes, setNotes] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isAttachmentBusy, setIsAttachmentBusy] = useState(false);
    const originalAttachments = useRef<string[]>([]);

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

        const savedAttachments = parseAttachments(product.attachments);

        setName(product.name);
        setCategory(product.category || "");
        setIsExpiry(product.type === "expiry");
        setStartDate(product.start_date);
        setEndDate(product.end_date);
        setReminderOption(product.reminder_option || "automatic");
        setNotes(product.notes || "");
        setAttachments(savedAttachments);
        originalAttachments.current = savedAttachments;
    }, [id, isEdit]);

    const addAttachment = useCallback(
        async (sourceUri: string) => {
            setIsAttachmentBusy(true);
            try {
                const productId = isEdit && id ? Number(id) : undefined;
                const savedUri = await saveAttachmentFromUri(sourceUri, productId);
                setAttachments((current) => [...current, savedUri]);
            } catch {
                Alert.alert(strings.errorSavingAttachment);
            } finally {
                setIsAttachmentBusy(false);
            }
        },
        [id, isEdit],
    );

    const removeAttachment = useCallback((uri: string) => {
        setAttachments((current) => current.filter((item) => item !== uri));
        void deleteAttachmentFile(uri);
    }, []);

    const onSave = useCallback(async () => {
        if (!name || !startDate || !endDate) {
            Alert.alert(strings.fillRequiredFields);
            return;
        }

        try {
            const type = isExpiry ? "expiry" : "warranty";
            let productId = isEdit && id ? Number(id) : 0;
            let savedAttachments = attachments;

            if (isEdit && id) {
                await syncRemovedAttachments(originalAttachments.current, attachments);
                updateProduct(
                    Number(id),
                    name,
                    category,
                    type,
                    startDate,
                    endDate,
                    reminderOption,
                    notes,
                    attachments,
                );
            } else {
                productId = Number(
                    insertProduct(
                        name,
                        category,
                        type,
                        startDate,
                        endDate,
                        reminderOption,
                        notes,
                        [],
                    ),
                );
                savedAttachments = await finalizePendingAttachments(attachments, productId);
                updateProduct(
                    productId,
                    name,
                    category,
                    type,
                    startDate,
                    endDate,
                    reminderOption,
                    notes,
                    savedAttachments,
                );
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

