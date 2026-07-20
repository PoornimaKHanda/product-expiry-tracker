import { Directory, File, Paths } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { fetchAllProducts, parseAttachments } from '@/src/utils/db';

// 📁 /documents/attachments
const baseDir = new Directory(Paths.document, 'attachments');

const MAX_STORAGE_BYTES = 100 * 1024 * 1024; // 100MB

async function ensureDir() {
    if (!baseDir.exists) {
        await baseDir.create({ intermediates: true });
    }
}

function generateFileName(ext = 'jpg') {
    return `att_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
}

function getFileNameFromUri(uri: string) {
    return uri.split('/').pop() || '';
}

async function getUsedFiles(): Promise<Set<string>> {
    const products = fetchAllProducts();
    const used = new Set<string>();

    products.forEach((p) => {
        const attachments = parseAttachments(p.attachments);
        attachments.forEach((uri) => {
            const name = getFileNameFromUri(uri);
            if (name) used.add(name);
        });
    });

    return used;
}

async function getTotalStorageSize(): Promise<number> {
    const entries = await baseDir.list();
    let total = 0;

    for (const entry of entries) {
        if (entry instanceof File) {
            const info = await entry.info();
            total += info.size || 0;
        }
    }

    return total;
}

export const AttachmentService = {
    // ✅ Compress image before saving
    async compressImage(uri: string): Promise<string> {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1280 } }],
            {
                compress: 0.6,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        return result.uri;
    },

    // ✅ Save image from temp URI → app storage (with compression)
    async saveImage(uri: string): Promise<string> {
        await ensureDir();

        // Already saved → skip
        if (uri.includes('/attachments/')) {
            return uri;
        }

        // ✅ Step 1: compress
        const compressedUri = await this.compressImage(uri);

        // ✅ Step 2: generate file
        const fileName = generateFileName('jpg');
        const destinationFile = new File(baseDir, fileName);

        // ✅ Step 3: copy
        const sourceFile = new File(compressedUri);
        await sourceFile.copy(destinationFile);

        // ✅ Step 4: storage warning (non-blocking)
        const totalSize = await getTotalStorageSize();
        if (totalSize > MAX_STORAGE_BYTES) {
            console.warn('⚠️ Storage exceeds 100MB');
            // later → trigger UI alert via callback/event
        }

        return destinationFile.uri;
    },

    // ✅ Delete single file
    async deleteImage(uri: string): Promise<void> {
        try {
            const file = new File(uri);
            if (file.exists) {
                await file.delete();
            }
        } catch (e) {
            console.warn('Delete failed', uri);
        }
    },

    // ✅ List all stored files
    async listAllFiles(): Promise<File[]> {
        await ensureDir();
        const entries = await baseDir.list();
        return entries.filter((entry): entry is File => entry instanceof File);
    },

    // ✅ Cleanup orphaned files
    async cleanupOrphanedFiles() {
        try {
            await ensureDir();
            const usedFiles = await getUsedFiles();
            const entries = await baseDir.list();

            for (const entry of entries) {
                if (entry instanceof File) {
                    if (!usedFiles.has(entry.name)) {
                        await entry.delete();
                    }
                }
            }

            console.log('🧹 Cleanup complete');
        } catch (e) {
            console.warn('Cleanup failed', e);
        }
    },
};