import * as SQLite from "expo-sqlite";
import { scheduleLocalNotification } from "./NotificationService";

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

export interface DatabaseNotification {
  id: number;
  userId: string;
  title: string;
  body: string;
  date: string;
  isRead: number;
  scanId?: number;
  imageUri?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;

    try {
      this.db = await SQLite.openDatabaseAsync("scans.db");

      // Remove 'DROP TABLE' and use 'IF NOT EXISTS'
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS scans (
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

      // Table 2: User Profile
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          userId TEXT PRIMARY KEY,
          profileImageUri TEXT
        );
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          title TEXT,
          body TEXT,
          date TEXT,
          isRead INTEGER DEFAULT 0,
          scanId INTEGER,
          imageUri TEXT
        );
      `);

      // Migration: Try to add new columns if they don't exist
      try {
        await this.db.execAsync(
          "ALTER TABLE notifications ADD COLUMN scanId INTEGER;"
        );
        await this.db.execAsync(
          "ALTER TABLE notifications ADD COLUMN imageUri TEXT;"
        );
      } catch (e) {
        // Classically, this errors if columns exist, so we ignore it.
        // This is a simple migration strategy for this dev stage.
      }

      console.log("SQLite database initialized");
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  async clearAllData() {
    if (!this.db) await this.init();

    try {
      await this.db!.runAsync("DELETE FROM scans");
      console.log("All scan data cleared");
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }

  async addScan(scan: DatabaseScan) {
    if (!this.db) await this.init();

    try {
      const result = await this.db!.runAsync(
        "INSERT INTO scans (userId, itemName, freshnessScore, status, shelfLifeDays, icon, farm, imageUri, scannedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          scan.userId,
          scan.itemName,
          scan.freshnessScore,
          scan.status,
          scan.shelfLifeDays,
          scan.icon,
          scan.farm,
          scan.imageUri,
          scan.scannedAt,
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error adding scan:", error);
      throw error;
    }
  }

  async getAllScans(userId: string): Promise<DatabaseScan[]> {
    if (!this.db) await this.init();

    try {
      return await this.db!.getAllAsync<DatabaseScan>(
        "SELECT * FROM scans WHERE userId = ? ORDER BY id DESC",
        [userId]
      );
    } catch (error) {
      console.error("Error getting scans:", error);
      return [];
    }
  }

  async deleteScan(id: number, userId: string) {
    if (!this.db) await this.init();

    try {
      await this.db!.runAsync("DELETE FROM scans WHERE id = ? AND userId = ?", [
        id,
        userId,
      ]);
    } catch (error) {
      console.error("Error deleting scan:", error);
      throw error;
    }
  }

  async updateScanName(id: number, userId: string, newName: string) {
    if (!this.db) await this.init();

    try {
      // 1. Fetch old name first to update notification messages
      const oldItem = await this.db!.getFirstAsync<{ itemName: string }>(
        "SELECT itemName FROM scans WHERE id = ? AND userId = ?",
        [id, userId]
      );

      if (oldItem) {
        // Update history text: replace old name with new name in notification body
        await this.db!.runAsync(
          "UPDATE notifications SET body = REPLACE(body, ?, ?) WHERE scanId = ?",
          [oldItem.itemName, newName, id]
        );
      }

      // 2. Update the main scan record
      await this.db!.runAsync(
        "UPDATE scans SET itemName = ? WHERE id = ? AND userId = ?",
        [newName, id, userId]
      );
    } catch (error) {
      console.error("Error updating scan name:", error);
      throw error;
    }
  }

  async saveProfileImage(userId: string, imageUri: string) {
    if (!this.db) await this.init();
    try {
      await this.db!.runAsync(
        "INSERT OR REPLACE INTO users (userId, profileImageUri) VALUES (?, ?)",
        [userId, imageUri]
      );
    } catch (error) {
      console.error("Error saving profile image:", error);
    }
  }
  async getProfileImage(userId: string): Promise<string | null> {
    if (!this.db) await this.init();
    try {
      const result = await this.db!.getFirstAsync<{ profileImageUri: string }>(
        "SELECT profileImageUri FROM users WHERE userId = ?",
        [userId]
      );
      return result?.profileImageUri || null;
    } catch (error) {
      console.error("Error getting profile image:", error);
      return null;
    }
  }

  async addNotification(
    userId: string,
    title: string,
    body: string,
    scanId?: number,
    imageUri?: string
  ) {
    if (!this.db) await this.init();
    try {
      await this.db!.runAsync(
        "INSERT INTO notifications (userId, title, body, date, scanId, imageUri) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userId,
          title,
          body,
          new Date().toISOString(),
          scanId || null,
          imageUri || null,
        ]
      );
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  }
  async getNotifications(userId: string): Promise<DatabaseNotification[]> {
    if (!userId) return [];
    if (!this.db) await this.init();
    try {
      return await this.db!.getAllAsync<DatabaseNotification>(
        "SELECT * FROM notifications WHERE userId = ? ORDER BY id DESC",
        [userId]
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async checkAndCreateExpiryNotifications(userId: string) {
    if (!this.db) await this.init();
    try {
      // 1. Saare active scans lein
      const scans = await this.getAllScans(userId);

      const today = new Date();
      for (const scan of scans) {
        if (!scan.id) continue; // Ensure ID exists
        if (!scan.imageUri) continue;

        // Expiry Date Calculate karein
        const scannedDate = new Date(scan.scannedAt);
        const expiryDate = new Date(scannedDate);
        expiryDate.setDate(scannedDate.getDate() + scan.shelfLifeDays);
        // Din calculate karein
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Logic: Agar 1 din ya us se kam bacha hai (aur item expired nahi hai ya just expired hai)
        if (diffDays <= 1) {
          // Check karein ke kya is item ki notification pehle se hai?
          const existing = await this.db!.getFirstAsync(
            "SELECT * FROM notifications WHERE userId = ? AND scanId = ?",
            [userId, scan.id]
          );
          if (!existing) {
            const title =
              diffDays < 0 ? "Item Expired!" : "Item Expiring Soon!";
            const body = `${scan.itemName} is ${
              diffDays < 0 ? "expired" : "expiring in 1 day"
            }. Use it now!`;

            await this.db!.runAsync(
              "INSERT INTO notifications (userId, title, body, date, isRead, scanId, imageUri) VALUES (?, ?, ?, ?, 0, ?, ?)",
              [
                userId,
                title,
                body,
                new Date().toISOString(),
                scan.id,
                scan.imageUri || null, // Ensure not undefined
              ]
            );

            // [NEW] Trigger Push Notification
            await scheduleLocalNotification(title, body);
          }
        }
      }
    } catch (error) {
      console.error("Error checking expiry:", error);
    }
  }
}

export default new DatabaseService();
