import { Buffer } from 'buffer';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'jpeg-js';
import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';

export interface AnalysisResult {
  status: string;
  freshnessScore: string;
  confidence: number;
  itemName: string;
}

class TfliteService {
  private static interpreter: TensorflowModel | null = null;
  private static modelLoaded = false;

  /**
   * Loads the TFLite model from assets.
   */
  static async initModel() {
    if (this.modelLoaded) return;

    try {
      console.log('Loading TFLite model...');
      const modelAsset = Asset.fromModule(require('../assets/models/model.tflite'));
      await modelAsset.downloadAsync();
      
      if (!modelAsset.localUri) {
        throw new Error('Failed to get local URI for model asset');
      }

      this.interpreter = await loadTensorflowModel(require('../assets/models/model.tflite'));
      this.modelLoaded = true;
      console.log('TFLite model loaded successfully!');
    } catch (error) {
      console.error('Failed to load TFLite model:', error);
      throw error;
    }
  }

  /**
   * Analyzes an image using the loaded TFLite model.
   * @param imageUri URI of the image to analyze.
   */
  static async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    try {
      console.log('--- STARTING IMAGE ANALYSIS ---');
      console.log('Image URI:', imageUri);

      if (!this.modelLoaded) {
        await this.initModel();
      }

      if (!this.interpreter) {
        throw new Error('Interpreter not initialized');
      }

      // 1. Resize image
      console.log('Resizing image to 100x100...');
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 100, height: 100 } }],
        { base64: true, format: ImageManipulator.SaveFormat.JPEG }
      );

      if (!manipulatedImage.base64) {
        throw new Error('Failed to get base64 from manipulated image');
      }
      console.log('Image resized. Base64 length:', manipulatedImage.base64.length);

      // 2. Decode JPEG
      console.log('Decoding JPEG and extracting pixels...');
      const buffer = Buffer.from(manipulatedImage.base64, 'base64');
      const rawData = decode(buffer, { useTArray: true });
      
      const { width, height, data } = rawData; 
      console.log(`Pixels extracted: ${width}x${height}, data length: ${data.length}`);

      const input = new Float32Array(width * height * 3);

      for (let i = 0; i < width * height; i++) {
        // Red
        input[i * 3 + 0] = data[i * 4 + 0] / 255.0;
        // Green
        input[i * 3 + 1] = data[i * 4 + 1] / 255.0;
        // Blue
        input[i * 3 + 2] = data[i * 4 + 2] / 255.0;
      }
      console.log('Pixel normalization complete.');

      // 3. Run Inference
      console.log('Running TFLite inference...');
      const outputs = await this.interpreter.run([input]);
      console.log('--- RAW TFLITE MODEL OUTPUT ---');
      console.log((JSON.stringify(outputs, null, 2)));
      console.log('-------------------------------');

      const prediction = outputs[0][0]; 
      const score = typeof prediction === 'number' ? prediction : parseFloat(String(prediction));

      return {
        status: '', 
        freshnessScore: '', 
        confidence: score,
        itemName: '',
      };
    } catch (error) {
      console.error('TfliteService error:', error);
      throw error;
    }
  }
}

// Helper to ensure float type conversion if needed
const float = (val: any) => parseFloat(String(val));

export default TfliteService;
