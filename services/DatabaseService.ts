import * as SQLite from 'expo-sqlite';

export interface DatabaseScan {
  id?: number;
  userId: string;
  itemName: string;
  freshnessScore: string;
  status: string;
  shelfLifeDays: number;
  icon: string;
  farm: string;
  imageUri: string;
  scannedAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;
    
    try {
      this.db = await SQLite.openDatabaseAsync('scans.db');
      
      // Drop old table and create new one with userId
      await this.db.execAsync(`
        DROP TABLE IF EXISTS scans;
        CREATE TABLE scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          itemName TEXT,
          freshnessScore TEXT,
          status TEXT,
          shelfLifeDays INTEGER,
          icon TEXT,
          farm TEXT,
          imageUri TEXT,
          scannedAt TEXT
        );
      `);
      console.log('SQLite database initialized with userId field');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async clearAllData() {
    if (!this.db) await this.init();
    
    try {
      await this.db!.runAsync('DELETE FROM scans');
      console.log('All scan data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  async addScan(scan: DatabaseScan) {
    if (!this.db) await this.init();
    
    try {
      const result = await this.db!.runAsync(
        'INSERT INTO scans (userId, itemName, freshnessScore, status, shelfLifeDays, icon, farm, imageUri, scannedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [scan.userId, scan.itemName, scan.freshnessScore, scan.status, scan.shelfLifeDays, scan.icon, scan.farm, scan.imageUri, scan.scannedAt]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding scan:', error);
      throw error;
    }
  }

  async getAllScans(userId: string): Promise<DatabaseScan[]> {
    if (!this.db) await this.init();
    
    try {
      return await this.db!.getAllAsync<DatabaseScan>(
        'SELECT * FROM scans WHERE userId = ? ORDER BY id DESC',
        [userId]
      );
    } catch (error) {
      console.error('Error getting scans:', error);
      return [];
    }
  }

  async deleteScan(id: number, userId: string) {
    if (!this.db) await this.init();
    
    try {
      await this.db!.runAsync('DELETE FROM scans WHERE id = ? AND userId = ?', [id, userId]);
    } catch (error) {
      console.error('Error deleting scan:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
