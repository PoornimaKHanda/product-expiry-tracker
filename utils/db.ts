import * as SQLite from 'expo-sqlite';
import { parseAttachments, serializeAttachments } from './attachments';

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
      type TEXT NOT NULL,        -- 'expiry' | 'warranty'
      start_date TEXT NOT NULL,  -- YYYY-MM-DD
      end_date TEXT NOT NULL,    -- YYYY-MM-DD
      reminder_option TEXT NOT NULL DEFAULT 'automatic',
      notes TEXT,
      attachments TEXT NOT NULL DEFAULT '[]'
    );
  `);

    try {
        db.execSync(
            `ALTER TABLE products ADD COLUMN reminder_option TEXT NOT NULL DEFAULT 'automatic';`
        );
    } catch (e) {
        // Existing databases already have this column after the first migration.
    }

    try {
        db.execSync(
            `ALTER TABLE products ADD COLUMN attachments TEXT NOT NULL DEFAULT '[]';`
        );
    } catch (e) {
        // Existing databases already have this column after the first migration.
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
        [name, category, type, startDate, endDate, reminderOption, notes, serializeAttachments(attachments)]
    );

    return result.lastInsertRowId;
};

export const fetchAllProducts = (): ProductRow[] => {
    return db.getAllSync(
        `SELECT * FROM products ORDER BY end_date ASC`
    ) as ProductRow[];
};

export const fetchProductById = (id: number): ProductRow | null => {
    const result = db.getFirstSync(
        `SELECT * FROM products WHERE id = ?`,
        [id]
    ) as ProductRow | null;
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
        [name, category, type, startDate, endDate, reminderOption, notes, serializeAttachments(attachments), id]
    );
};

export const deleteProductById = async (id: number) => {
    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
};

export { parseAttachments };
