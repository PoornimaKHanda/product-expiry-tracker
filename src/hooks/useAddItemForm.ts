import { strings } from "@/src/i18n";
import { ProductService } from "@/src/services/ProductService";
import { scheduleDevTestNotification, scheduleItemNotifications } from "@/src/utils/notifications";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { addYears } from "../utils/date";

const MAX_NOTES_LENGTH = 1000;

type FormInput = {
    name: string;
    startDate: string;
    endDate: string;
    notes: string;
};

function validate(input: FormInput): string | null {
    if (!input.name) {
        return strings.productNameCannotBeEmpty;
    }

    if (!input.startDate || !input.endDate) {
        return strings.fillRequiredFields;
    }

    if (input.endDate <= input.startDate) {
        return strings.endDateMustBeAfterStartDate;
    }

    if (input.notes.length > MAX_NOTES_LENGTH) {
        return strings.notesTooLong(MAX_NOTES_LENGTH);
    }

    return null;
}

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

    // 👉 Now holds TEMP URIs (not persisted yet)
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isAttachmentBusy, setIsAttachmentBusy] = useState(false);

    const onWarrantyDurationSelect = (years: number) => {
        setSelectedDuration(years);
        setEndDate(addYears(startDate, years));
    };

    const handleEndDateChange = (date: string) => {
        setSelectedDuration(null);
        setEndDate(date);
    };

    useEffect(() => {
        if (!isExpiry && selectedDuration !== null) {
            setEndDate(addYears(startDate, selectedDuration));
        }
    }, [isExpiry, selectedDuration, startDate]);

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
        const trimmedName = name.trim();
        const trimmedCategory = category.trim();
        const trimmedNotes = notes.trim();
        const input = {
            name: trimmedName,
            startDate,
            endDate: endDate ?? "",
            notes: trimmedNotes,
        };
        const error = validate(input);

        if (error) {
            setFormError(error);
            return;
        }

        try {
            const type = isExpiry ? "expiry" : "warranty";

            let productId: number;

            if (isEdit && id) {
                await ProductService.updateProduct(Number(id), {
                    name: trimmedName,
                    category: trimmedCategory,
                    type,
                    startDate,
                    endDate: input.endDate,
                    reminderOption,
                    notes: trimmedNotes,
                    tempAttachments: attachments,
                });

                productId = Number(id);
            } else {
                productId = await ProductService.createProduct({
                    name: trimmedName,
                    category: trimmedCategory,
                    type,
                    startDate,
                    endDate: input.endDate,
                    reminderOption,
                    notes: trimmedNotes,
                    tempAttachments: attachments,
                });
            }

            // ✅ Notifications still triggered here (UI concern)
            await scheduleItemNotifications({
                id: productId,
                name: trimmedName,
                endDate: input.endDate,
                type,
                reminderOption,
            });

            router.back();
        } catch (error) {
            console.error("SAVE ERROR:", error);
            setFormError(strings.errorSavingItem);
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
