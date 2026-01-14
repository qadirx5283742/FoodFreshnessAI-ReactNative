import { Directory, File, Paths } from "expo-file-system";

class StorageService {
  private readonly IMAGES_DIR = new Directory(Paths.document, "scanned_images");

  async init() {
    try {
      if (!this.IMAGES_DIR.exists) {
        this.IMAGES_DIR.create();
        console.log("Images directory created");
      }
    } catch (error) {
      console.error("Storage initialization error:", error);
    }
  }

  async saveImage(tempUri: string): Promise<string> {
    await this.init();

    try {
      const filename = `scan_${Date.now()}.jpg`;
      const sourceFile = new File(tempUri);
      const destinationFile = new File(this.IMAGES_DIR.uri, filename);

      await sourceFile.copy(destinationFile);

      return destinationFile.uri;
    } catch (error) {
      console.error("Error saving image:", error);
      return tempUri;
    }
  }

  async deleteImage(uri: string) {
    try {
      const file = new File(uri);
      if (file.exists) {
        file.delete();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
}

export default new StorageService();
