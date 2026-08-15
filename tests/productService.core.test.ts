import { describe, expect, it, vi } from 'vitest';
import { getReminderOffsets } from '@/src/features/products/notifications/reminderConfig';
import { createProductService } from './helpers/ProductServiceCore';

describe('ProductServiceCore - transactional attachments', () => {
    it('normalizes default and custom reminder offsets through a single config source', () => {
        expect(getReminderOffsets()).toEqual([7, 0]);
        expect(getReminderOffsets('automatic')).toEqual([7, 0]);
        expect(getReminderOffsets('1day')).toEqual([1]);
        expect(getReminderOffsets('1week')).toEqual([7]);
        expect(getReminderOffsets('1month')).toEqual([30]);
        expect(getReminderOffsets('custom:14')).toEqual([14]);
    });

    it('deletes saved attachments when create fails during persistence', async () => {
        const savedUris: string[] = [];

        const mockAttachment = {
            saveImage: vi.fn(async (uri: string) => {
                const dest = `/tmp/${uri.split('/').pop()}`;
                savedUris.push(dest);
                return dest;
            }),
            deleteImage: vi.fn(async (uri: string) => {
                const idx = savedUris.indexOf(uri);
                if (idx >= 0) savedUris.splice(idx, 1);
            }),
        };

        const mockRepo = {
            createProduct: vi.fn(() => { throw new Error('db failure'); }),
            getProductById: vi.fn(() => null),
            getAllProducts: vi.fn(() => []),
            updateProduct: vi.fn(),
            deleteProductById: vi.fn(async () => { }),
        };

        const svc = createProductService({ repo: mockRepo as any, attachmentService: mockAttachment as any });

        const draft: any = {
            name: 'X',
            category: 'c',
            type: 'expiry',
            startDate: '2026-01-01',
            endDate: '2026-02-02',
            reminderOption: 'automatic',
            notes: '',
            tempAttachments: ['file1.jpg', 'file2.jpg'],
        };

        await expect(svc.createProduct(draft)).rejects.toThrow('db failure');

        expect(mockAttachment.deleteImage).toHaveBeenCalled();
        expect(savedUris.length).toBe(0);
    });

    it('preserves old attachments when an update fails before the repository write succeeds', async () => {
        const existing = {
            id: 42,
            name: 'Old product',
            category: 'Groceries',
            type: 'expiry',
            startDate: '2026-01-01',
            endDate: '2026-02-02',
            reminderOption: 'automatic',
            notes: 'Old notes',
            attachments: ['/old/old-1.jpg'],
        };

        const saveImage = vi.fn(async (uri: string) => `/tmp/${uri.split('/').pop()}`);
        const deleteImage = vi.fn(async () => undefined);

        const mockRepo = {
            createProduct: vi.fn(),
            getProductById: vi.fn((id: number) => (id === 42 ? existing : null)),
            getAllProducts: vi.fn(() => []),
            updateProduct: vi.fn(() => { throw new Error('update failed'); }),
            deleteProductById: vi.fn(async () => { }),
        };

        const svc = createProductService({
            repo: mockRepo as any,
            attachmentService: { saveImage, deleteImage } as any,
        });

        await expect(svc.updateProduct(42, {
            name: 'Updated product',
            category: 'Groceries',
            type: 'expiry',
            startDate: '2026-01-01',
            endDate: '2026-03-03',
            reminderOption: 'custom:14',
            notes: 'Updated notes',
            tempAttachments: ['/new/new-1.jpg'],
        })).rejects.toThrow('update failed');

        expect(saveImage).toHaveBeenCalledWith('/new/new-1.jpg');
        expect(deleteImage).not.toHaveBeenCalledWith('/old/old-1.jpg');
    });

    it('cleans up the previous attachment files only after a successful update', async () => {
        const existing = {
            id: 7,
            name: 'Existing',
            category: 'Household',
            type: 'warranty',
            startDate: '2026-01-01',
            endDate: '2028-01-01',
            reminderOption: 'automatic',
            notes: 'Keep me',
            attachments: ['/old/legacy.jpg'],
        };

        const saveImage = vi.fn(async (uri: string) => `/tmp/${uri.split('/').pop()}`);
        const deleteImage = vi.fn(async () => undefined);

        const mockRepo = {
            createProduct: vi.fn(),
            getProductById: vi.fn((id: number) => (id === 7 ? existing : null)),
            getAllProducts: vi.fn(() => []),
            updateProduct: vi.fn(),
            deleteProductById: vi.fn(async () => { }),
        };

        const svc = createProductService({
            repo: mockRepo as any,
            attachmentService: { saveImage, deleteImage } as any,
        });

        const result = await svc.updateProduct(7, {
            name: 'Existing',
            category: 'Household',
            type: 'warranty',
            startDate: '2026-01-01',
            endDate: '2028-01-01',
            reminderOption: 'automatic',
            notes: 'Keep me',
            tempAttachments: ['/new/replacement.jpg'],
        });

        expect(result).toEqual(expect.objectContaining({ id: 7 }));
        expect(saveImage).toHaveBeenCalledWith('/new/replacement.jpg');
        expect(deleteImage).toHaveBeenCalledWith('/old/legacy.jpg');
        expect(mockRepo.updateProduct).toHaveBeenCalledWith(
            7,
            'Existing',
            'Household',
            'warranty',
            '2026-01-01',
            '2028-01-01',
            'automatic',
            'Keep me',
            [expect.stringMatching(/replacement/)],
        );
    });
});
