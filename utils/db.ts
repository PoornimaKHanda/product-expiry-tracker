import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('products.db');

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
      notes TEXT
    );
  `);

    try {
        db.execSync(
            `ALTER TABLE products ADD COLUMN reminder_option TEXT NOT NULL DEFAULT 'automatic';`
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
    notes: string
) => {
    const result = db.runSync(
        `INSERT INTO products (name, category, type, start_date, end_date, reminder_option, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, category, type, startDate, endDate, reminderOption, notes]
    );

    return result.lastInsertRowId;
};

export const fetchAllProducts = (): Array<{
    id: number;
    name: string;
    category: string;
    type: 'expiry' | 'warranty';
    start_date: string;
    end_date: string;
    reminder_option: string;
    notes: string;
}> => {
    return db.getAllSync(
        `SELECT * FROM products ORDER BY end_date ASC`
    ) as Array<{
        id: number;
        name: string;
        category: string;
        type: 'expiry' | 'warranty';
        start_date: string;
        end_date: string;
        reminder_option: string;
        notes: string;
    }>;
};

export const fetchProductById = (id: number): {
    id: number;
    name: string;
    category: string;
    type: 'expiry' | 'warranty';
    start_date: string;
    end_date: string;
    reminder_option: string;
    notes: string;
} | null => {
    const result = db.getFirstSync(
        `SELECT * FROM products WHERE id = ?`,
        [id]
    ) as {
        id: number;
        name: string;
        category: string;
        type: 'expiry' | 'warranty';
        start_date: string;
        end_date: string;
        reminder_option: string;
        notes: string;
    } | null;
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
    notes: string
) => {
    db.runSync(
        `UPDATE products SET name = ?, category = ?, type = ?, start_date = ?, end_date = ?, reminder_option = ?, notes = ? WHERE id = ?`,
        [name, category, type, startDate, endDate, reminderOption, notes, id]
    );
};

export const deleteProductById = async (id: number) => {
    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
};
