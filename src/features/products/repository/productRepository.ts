import * as SQLite from 'expo-sqlite';
import { parseAttachments, serializeAttachments } from '@/src/utils/attachments';
import type { ProductRecord } from '@/src/features/products/types';
import { mapRecordToProduct } from '@/src/features/products/types';

// db initilization
export const db = SQLite.openDatabaseSync('products.db');

export type ProductRow = {
    id: number;
    name: string;
    category: string;
    type: 'expiry' | 'warranty';
    start_date: string;
    end_date: string;
    reminder_option: string;
    notes: string;
    attachments: string;
};

export const initDB = () => {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reminder_option TEXT NOT NULL DEFAULT 'automatic',
      notes TEXT,
      attachments TEXT NOT NULL DEFAULT '[]'
    );
  `);

    try {
        db.execSync(
            `ALTER TABLE products ADD COLUMN reminder_option TEXT NOT NULL DEFAULT 'automatic';`,
        );
    } catch {
        // Existing database already has this column.
    }

    try {
        db.execSync(
            `ALTER TABLE products ADD COLUMN attachments TEXT NOT NULL DEFAULT '[]';`,
        );
    } catch {
        // Existing database already has this column.
    }
};

export const insertProduct = (
    name: string,
    category: string,
    type: 'expiry' | 'warranty',
    startDate: string,
    endDate: string,
    reminderOption: string,
    notes: string,
    attachments: string[] = [],
) => {
    const result = db.runSync(
        `INSERT INTO products (name, category, type, start_date, end_date, reminder_option, notes, attachments)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category, type, startDate, endDate, reminderOption, notes, serializeAttachments(attachments)],
    );

    return result.lastInsertRowId;
};

export const fetchAllProducts = (): ProductRow[] => {
    try {
        return db.getAllSync(`SELECT * FROM products ORDER BY end_date ASC`) as ProductRow[];
    } catch (e) {
        console.warn('Table not ready yet', e);
        return [];
    }
};

export const fetchProductById = (id: number): ProductRow | null => {
    const result = db.getFirstSync(`SELECT * FROM products WHERE id = ?`, [id]) as ProductRow | null;
    return result || null;
};

export const updateProduct = (
    id: number,
    name: string,
    category: string,
    type: 'expiry' | 'warranty',
    startDate: string,
    endDate: string,
    reminderOption: string,
    notes: string,
    attachments: string[] = [],
) => {
    db.runSync(
        `UPDATE products SET name = ?, category = ?, type = ?, start_date = ?, end_date = ?, reminder_option = ?, notes = ?, attachments = ? WHERE id = ?`,
        [name, category, type, startDate, endDate, reminderOption, notes, serializeAttachments(attachments), id],
    );
};

export const deleteProductById = async (id: number) => {
    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
};

export { parseAttachments };

export const bootstrapDB = () => {
    try {
        initDB();
    } catch (e) {
        console.error('DB init failed', e);
    }
};

export const productRepository = {
    createProduct: (
        name: string,
        category: string,
        type: 'expiry' | 'warranty',
        startDate: string,
        endDate: string,
        reminderOption: string,
        notes: string,
        attachments: string[] = [],
    ): number => {
        const id = insertProduct(
            name,
            category,
            type,
            startDate,
            endDate,
            reminderOption,
            notes,
            attachments,
        );
        return id as number;
    },

    getAllProducts() {
        const rows = fetchAllProducts();
        return rows.map((r) => mapRecordToProduct(r as ProductRecord));
    },

    getProductById(id: number) {
        const row = fetchProductById(id);
        if (!row) return null;
        return mapRecordToProduct(row as ProductRecord);
    },

    updateProduct(
        id: number,
        name: string,
        category: string,
        type: 'expiry' | 'warranty',
        startDate: string,
        endDate: string,
        reminderOption: string,
        notes: string,
        attachments: string[] = [],
    ): void {
        updateProduct(id, name, category, type, startDate, endDate, reminderOption, notes, attachments);
    },

    async deleteProductById(id: number): Promise<void> {
        await deleteProductById(id);
    },
};

export default productRepository;
