
import {
    insertProduct,
    fetchAllProducts,
    fetchProductById,
    updateProduct,
    deleteProductById,
    parseAttachments,
    ProductRow,
} from '../utils/db';

import { AttachmentService } from './AttachmentService';

function isEqual(oldItem: ProductRow, newInput:CreateProductInput, newAttachments:string[]|undefined) {
    return (
        oldItem.name === newInput.name &&
        oldItem.category === newInput.category &&
        oldItem.type === newInput.type &&
        oldItem.start_date === newInput.startDate &&
        oldItem.end_date === newInput.endDate &&
        oldItem.reminder_option === newInput.reminderOption &&
        oldItem.notes === newInput.notes &&
        JSON.stringify(parseAttachments(oldItem.attachments)) ===
        JSON.stringify(newAttachments || [])
    );
}

export type CreateProductInput = {
    name: string;
    category: string;
    type: 'expiry' | 'warranty';
    startDate: string;
    endDate: string;
    reminderOption: string;
    notes: string;
    tempAttachments?: string[]; // from picker/camera
};

export const ProductService = {
    // ✅ CREATE
    async createProduct(input: CreateProductInput): Promise<number> {
        const { tempAttachments = [] } = input;

        // Save images → permanent storage
        const savedUris: string[] = [];
        for (const uri of tempAttachments) {
            const saved = await AttachmentService.saveImage(uri);
            savedUris.push(saved);
        }

        const id = insertProduct(
            input.name,
            input.category,
            input.type,
            input.startDate,
            input.endDate,
            input.reminderOption,
            input.notes,
            savedUris
        );

        return id as number;
    },

    // ✅ FETCH ALL (parsed)
    getAllProducts() {
        const rows = fetchAllProducts();

        return rows.map((row) => ({
            ...row,
            attachments: parseAttachments(row.attachments),
        }));
    },

    // ✅ FETCH ONE (parsed)
    getProductById(id: number) {
        const row = fetchProductById(id);

        if (!row) return null;

        return {
            ...row,
            attachments: parseAttachments(row.attachments),
        };
    },

    // ✅ UPDATE (with attachment handling)
    async updateProduct(
        id: number,
        input: CreateProductInput
    ): Promise<void> {
        const existing = fetchProductById(id);
        if (!existing) return;

        if (isEqual(existing, input, input.tempAttachments)) {
            console.log("No changes, skipping update");
            return;
        }

        const oldUris: string[] = parseAttachments(existing.attachments);
        const newTempUris = input.tempAttachments || [];

        // 🚨 Strategy: full replace (simplest + safe)
        // 1. delete old files
        await Promise.all(
            oldUris.map((uri) => AttachmentService.deleteImage(uri))
        );

        // 2. save new files
        const newSavedUris: string[] = [];
        for (const uri of newTempUris) {
            const saved = await AttachmentService.saveImage(uri);
            newSavedUris.push(saved);
        }

        // 3. update DB
        updateProduct(
            id,
            input.name,
            input.category,
            input.type,
            input.startDate,
            input.endDate,
            input.reminderOption,
            input.notes,
            newSavedUris
        );
    },

    // ✅ DELETE (with cleanup)
    async deleteProduct(id: number): Promise<void> {
        const existing = fetchProductById(id);
        if (!existing) return;

        const attachments: string[] = parseAttachments(existing.attachments);

        // 1. delete files
        await Promise.all(
            attachments.map((uri) => AttachmentService.deleteImage(uri))
        );

        // 2. delete DB row
        await deleteProductById(id);
    },

};