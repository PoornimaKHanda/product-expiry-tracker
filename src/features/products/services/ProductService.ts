import productNotificationService from '@/src/features/products/notifications/productNotificationService';
import productRepository from '@/src/features/products/repository/productRepository';
import type { Product as CanonicalProduct, ProductDraft } from '@/src/features/products/types';
import { AttachmentService } from '@/src/features/attachments/services/AttachmentService';

async function persistNewAttachments(tempAttachments: string[]): Promise<string[]> {
    const savedUris: string[] = [];
    for (const uri of tempAttachments) {
        const saved = await AttachmentService.saveImage(uri);
        savedUris.push(saved);
    }
    return savedUris;
}

export const ProductService = {
    async createProduct(input: ProductDraft): Promise<CanonicalProduct | null> {
        const { tempAttachments = [] } = input;
        const savedUris: string[] = [];

        try {
            const stagedUris = await persistNewAttachments(tempAttachments);
            savedUris.push(...stagedUris);

            const id = productRepository.createProduct(
                input.name,
                input.category,
                input.type,
                input.startDate,
                input.endDate,
                input.reminderOption,
                input.notes,
                stagedUris,
            );

            const product = productRepository.getProductById(id);
            if (product) {
                try {
                    await productNotificationService.scheduleForProduct(product);
                } catch (e) {
                    console.warn('Notification scheduling failed', e);
                }
            }

            return product;
        } catch (err) {
            await Promise.all(savedUris.map((u) => AttachmentService.deleteImage(u)));
            throw err;
        }
    },

    getAllProducts() {
        return productRepository.getAllProducts();
    },

    getProductById(id: number) {
        return productRepository.getProductById(id);
    },

    async updateProduct(id: number, input: ProductDraft): Promise<CanonicalProduct | null> {
        const existing = productRepository.getProductById(id);
        if (!existing) return null;

        const sameFields =
            existing.name === input.name &&
            existing.category === input.category &&
            existing.type === input.type &&
            existing.startDate === input.startDate &&
            existing.endDate === input.endDate &&
            existing.reminderOption === input.reminderOption &&
            existing.notes === input.notes;

        const existingAttachments = existing.attachments || [];
        const newTempUris = input.tempAttachments || [];
        const sameAttachments =
            newTempUris.length === existingAttachments.length &&
            newTempUris.every((uri, index) => uri === existingAttachments[index]);

        if (sameFields && sameAttachments) {
            return existing;
        }

        const oldUris: string[] = existing.attachments || [];
        const stagedUris: string[] = [];

        try {
            const savedUris = await persistNewAttachments(newTempUris);
            stagedUris.push(...savedUris);

            productRepository.updateProduct(
                id,
                input.name,
                input.category,
                input.type,
                input.startDate,
                input.endDate,
                input.reminderOption,
                input.notes,
                stagedUris,
            );

            const updated = productRepository.getProductById(id);
            if (!updated) {
                throw new Error('Product update failed after persistence');
            }

            await Promise.all(oldUris.map((u) => AttachmentService.deleteImage(u)));

            try {
                await productNotificationService.scheduleForProduct(updated);
            } catch (e) {
                console.warn('Notification scheduling failed', e);
            }

            return updated;
        } catch (err) {
            await Promise.all(stagedUris.map((u) => AttachmentService.deleteImage(u)));
            throw err;
        }
    },

    async deleteProduct(id: number): Promise<void> {
        const existing = productRepository.getProductById(id);
        if (!existing) return;

        const attachments: string[] = existing.attachments || [];

        try {
            await productNotificationService.cancelForProductId(id);
        } catch (e) {
            console.warn('Cancel notifications failed', e);
        }

        try {
            await productRepository.deleteProductById(id);
        } finally {
            await Promise.all(attachments.map((uri) => AttachmentService.deleteImage(uri)));
        }
    },
};

export default ProductService;
