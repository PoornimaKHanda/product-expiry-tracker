import type { ProductDraft } from '@/src/features/products/types';
import { strings } from "@/src/i18n";
import { ProductService } from "@/src/features/products/services/ProductService";
import { scheduleDevTestNotification } from "@/src/features/products/notifications/notificationScheduler";
import { validateProductDraft } from "@/src/features/products/validation/productValidation";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { addYears } from "../utils/date";

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
    const [formError, setFormError] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isAttachmentBusy, setIsAttachmentBusy] = useState(false);

    const onWarrantyDurationSelect = useCallback((years: number) => {
        setSelectedDuration(years);
        setEndDate(addYears(startDate, years));
    }, [startDate]);

    const handleEndDateChange = useCallback((date: string) => {
        setSelectedDuration(null);
        setEndDate(date);
    }, []);

    useEffect(() => {
        if (!isExpiry && selectedDuration !== null) {
            setEndDate(addYears(startDate, selectedDuration));
        }
    }, [isExpiry, selectedDuration, startDate]);

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
        setStartDate(product.startDate);
        setEndDate(product.endDate);
        setReminderOption(product.reminderOption || "automatic");
        setNotes(product.notes || "");
        setAttachments(product.attachments || []);
    }, [id, isEdit]);

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

    const removeAttachment = useCallback((uri: string) => {
        setAttachments((current) => current.filter((item) => item !== uri));
    }, []);

    const onSave = useCallback(async () => {
        const trimmedName = name.trim();
        const trimmedCategory = category.trim();
        const trimmedNotes = notes.trim();
        const input = {
            name: trimmedName,
            startDate,
            endDate: endDate ?? "",
            notes: trimmedNotes,
        };
        const error = validateProductDraft(input, strings);

        if (error) {
            setFormError(error);
            return;
        }

        try {
            const type = isExpiry ? "expiry" : "warranty";
            const draft: ProductDraft = {
                name: trimmedName,
                category: trimmedCategory,
                type,
                startDate,
                endDate: input.endDate,
                reminderOption,
                notes: trimmedNotes,
                tempAttachments: attachments,
            };

            const saved = isEdit && id
                ? await ProductService.updateProduct(Number(id), draft)
                : await ProductService.createProduct(draft);

            if (!saved) throw new Error('Save failed');
            router.back();
        } catch (error) {
            console.error("SAVE ERROR:", error);
            setFormError(strings.errorSavingItem);
        }
    }, [attachments, category, endDate, id, isEdit, isExpiry, name, notes, reminderOption, startDate]);

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
        setEndDate: handleEndDateChange,
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
        formError,
        dismissFormError: () => setFormError(null),
        onTestNotification,
        selectedDuration,
        onWarrantyDurationSelect,
    };
}
