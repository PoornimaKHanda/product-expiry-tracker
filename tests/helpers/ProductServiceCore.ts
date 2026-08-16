import type { Product as CanonicalProduct, ProductDraft } from '../../src/features/products/types';

export type RepoLike = {
  createProduct(name: string, category: string, type: 'expiry'|'warranty', startDate: string, endDate: string, reminderOption: string, notes: string, attachments: string[]): number;
  getProductById(id: number): CanonicalProduct | null;
  getAllProducts(): CanonicalProduct[];
  updateProduct(id: number, name: string, category: string, type: 'expiry'|'warranty', startDate: string, endDate: string, reminderOption: string, notes: string, attachments: string[]): void;
  deleteProductById(id: number): Promise<void>;
};

export type AttachmentLike = {
  saveImage(uri: string): Promise<string>;
  deleteImage(uri: string): Promise<void>;
};

export type NotificationLike = {
  scheduleForProduct(p: CanonicalProduct): Promise<any>;
  cancelForProductId(id: number): Promise<any>;
};

export function createProductService(deps: {
  repo: RepoLike;
  attachmentService: AttachmentLike;
  notificationService?: NotificationLike;
}) {
  const { repo, attachmentService, notificationService } = deps;

  return {
    async createProduct(input: ProductDraft): Promise<CanonicalProduct | null> {
      const { tempAttachments = [] } = input;
      const savedUris: string[] = [];
      try {
        for (const uri of tempAttachments) {
          const saved = await attachmentService.saveImage(uri);
          savedUris.push(saved);
        }

        const id = repo.createProduct(
          input.name,
          input.category,
          input.type,
          input.startDate,
          input.endDate,
          input.reminderOption,
          input.notes,
          savedUris,
        );

        const product = repo.getProductById(id);
        if (product && notificationService) {
          try { await notificationService.scheduleForProduct(product); } catch (e) { console.warn('Notification scheduling failed', e); }
        }
        return product;
      } catch (err) {
        await Promise.all(savedUris.map((u) => attachmentService.deleteImage(u)));
        throw err;
      }
    },

    getAllProducts() { return repo.getAllProducts(); },
    getProductById(id: number) { return repo.getProductById(id); },

    async updateProduct(id: number, input: ProductDraft): Promise<CanonicalProduct | null> {
      const existing = repo.getProductById(id);
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

      const oldUris = existing.attachments || [];
      const newSavedUris: string[] = [];
      try {
        for (const uri of newTempUris) {
          const saved = await attachmentService.saveImage(uri);
          newSavedUris.push(saved);
        }

        repo.updateProduct(
          id,
          input.name,
          input.category,
          input.type,
          input.startDate,
          input.endDate,
          input.reminderOption,
          input.notes,
          newSavedUris,
        );

        await Promise.all(oldUris.map((u) => attachmentService.deleteImage(u)));

        const updated = repo.getProductById(id);
        if (updated && notificationService) {
          try { await notificationService.scheduleForProduct(updated); } catch (e) { console.warn('Notification scheduling failed', e); }
        }

        return updated;
      } catch (err) {
        await Promise.all(newSavedUris.map((u) => attachmentService.deleteImage(u)));
        throw err;
      }
    },

    async deleteProduct(id: number): Promise<void> {
      const existing = repo.getProductById(id);
      if (!existing) return;
      const attachments = existing.attachments || [];

      if (notificationService) {
        try { await notificationService.cancelForProductId(id); } catch (e) { console.warn('Cancel notifications failed', e); }
      }

      await Promise.all(attachments.map((u) => attachmentService.deleteImage(u)));
      await repo.deleteProductById(id);
    }
  };
}

export default createProductService;
