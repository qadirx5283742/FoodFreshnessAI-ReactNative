import * as FileSystem from 'expo-file-system';

class StorageService {
  // Use a type assertion to handle cases where the type definition might be missing documentDirectory
  private readonly IMAGES_DIR = `${(FileSystem as any).documentDirectory || ''}scanned_images/`;

  async init() {
    try {
      if (!(FileSystem as any).documentDirectory) {
        console.error('FileSystem.documentDirectory is not available');
        return;
      }
      const info = await FileSystem.getInfoAsync(this.IMAGES_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(this.IMAGES_DIR, { intermediates: true });
        console.log('Images directory created');
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
    }
  }

  async saveImage(tempUri: string): Promise<string> {
    await this.init();
    
    try {
      if (!(FileSystem as any).documentDirectory) return tempUri;

      const filename = `scan_${Date.now()}.jpg`;
      const permanentUri = `${this.IMAGES_DIR}${filename}`;
      
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri
      });
      
      return permanentUri;
    } catch (error) {
      console.error('Error saving image:', error);
      return tempUri; // Fallback to temp URI if copy fails
    }
  }

  async deleteImage(uri: string) {
    try {
      if (uri.startsWith(this.IMAGES_DIR)) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}

export default new StorageService();
