export type Product = {
    id: number;
    name: string;
    category: string;
    type: "expiry" | "warranty";
    startDate: string;
    endDate: string;
    reminderOption: string;
    notes: string;
    attachments: string[];
};

export type ProductRecord = {
    id: number;
    name: string;
    category: string;
    type: "expiry" | "warranty";
    start_date: string;
    end_date: string;
    reminder_option: string;
    notes: string;
    attachments: string; // JSON string or pipe-separated list
};

export type ProductDraft = {
    name: string;
    category: string;
    type: "expiry" | "warranty";
    startDate: string;
    endDate: string;
    reminderOption: string;
    notes: string;
    tempAttachments?: string[];
};

export type ProductSummary = {
    id: number;
    name: string;
    category: string;
    endDate: string;
    type: "expiry" | "warranty";
    attachmentsCount: number;
};

/**
 * Convert a raw DB row (`ProductRecord`) into the canonical `Product` shape.
 * Handles legacy attachment formats gracefully.
 */
export const mapRecordToProduct = (r: ProductRecord): Product => {
    let attachments: string[] = [];
    if (r.attachments) {
        try {
            const parsed = JSON.parse(r.attachments);
            if (Array.isArray(parsed)) attachments = parsed;
        } catch {
            // fallback: try pipe-separated list
            attachments = r.attachments.split("|").map((s) => s.trim()).filter(Boolean);
        }
    }

    return {
        id: r.id,
        name: r.name,
        category: r.category,
        type: r.type,
        startDate: r.start_date,
        endDate: r.end_date,
        reminderOption: r.reminder_option,
        notes: r.notes,
        attachments,
    };
};

export const serializeAttachments = (attachments: string[] = []): string => JSON.stringify(attachments);

/**
 * Convert a `ProductDraft` into a DB-friendly `ProductRecord`-like object
 * (does not include `id` for creates).
 */
export const draftToRecord = (d: ProductDraft) => ({
    name: d.name,
    category: d.category,
    type: d.type,
    start_date: d.startDate,
    end_date: d.endDate,
    reminder_option: d.reminderOption,
    notes: d.notes,
    attachments: serializeAttachments(d.tempAttachments || []),
});
