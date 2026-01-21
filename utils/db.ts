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
      notes TEXT
    );
  `);
};

export const insertProduct = (
    name: string,
    category: string,
    type: 'expiry' | 'warranty',
    startDate: string,
    endDate: string,
    notes: string
) => {
    db.runSync(
        `INSERT INTO products (name, category, type, start_date, end_date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [name, category, type, startDate, endDate, notes]
    );
};

export const fetchAllProducts = (): Array<{
    id: number;
    name: string;
    category: string;
    type: 'expiry' | 'warranty';
    start_date: string;
    end_date: string;
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
        notes: string;
    }>;
};
