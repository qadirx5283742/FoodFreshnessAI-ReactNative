import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ID } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APPWRITE_CONFIG, databases, storage } from '../../config/appwriteConfig';
import { auth } from '../../config/firebaseConfig';
import { useTheme } from '../../context/ThemeContext';
import { HapticService } from '../../services/HapticService';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { colors } = useTheme();

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <View style={styles.permissionView}>
            <MaterialCommunityIcons name="camera-off" size={64} color={colors.primary} />
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <TouchableOpacity style={[styles.permissionButton, { backgroundColor: colors.primary }]} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    HapticService.selection();
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      setIsScanning(true);
      HapticService.trigger();

      // 1. Take Picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (!photo) throw new Error("Could not capture photo");

      // 2. Get accurate file info for Appwrite
      const fileName = `scan_${Date.now()}.jpg`;
      
      // Get real file size using fetch (avoids installing extra packages like expo-file-system)
      const fileResponse = await fetch(photo.uri);
      const fileBlob = await fileResponse.blob();
      
      const file = {
        name: fileName,
        type: 'image/jpeg',
        uri: photo.uri,
        size: fileBlob.size, // Accurate size in bytes
      };

      // 3. Upload to Appwrite Storage
      const uploadedFile = await storage.createFile(
        APPWRITE_CONFIG.bucketId,
        ID.unique(),
        file as any
      );

      // 4. Mock AI Analysis (Since we don't have a real AI backend yet)
      const mockResult = {
        itemName: 'Red Apple',
        freshnessScore: '92%',
        status: 'Fresh',
        farm: 'Local Orchard',
      };

      // 5. Save Scan to Appwrite Database
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.scansCollectionId,
        ID.unique(),
        {
          userId: auth.currentUser?.uid,
          itemName: mockResult.itemName,
          freshnessScore: mockResult.freshnessScore,
          status: mockResult.status,
          imageId: uploadedFile.$id,
          farm: mockResult.farm,
          scannedAt: new Date().toISOString(),
        }
      );

      HapticService.notification();
      Alert.alert("Scan Success!", `${mockResult.itemName} has been analyzed and saved.`);
      router.replace('/(tabs)/list');

    } catch (error: any) {
      console.error("Scan Error:", error);
      Alert.alert("Scan Failed", error.message || "An error occurred while scanning.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
           <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
           >
             <MaterialCommunityIcons name="close" size={30} color="white" />
           </TouchableOpacity>

           <View style={styles.bottomControls}>
             <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                <MaterialCommunityIcons name="camera-flip" size={32} color="white" />
             </TouchableOpacity>

             <TouchableOpacity 
              style={[styles.captureButton, isScanning && { opacity: 0.5 }]} 
              onPress={handleCapture}
              disabled={isScanning}
             >
                {isScanning ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <View style={styles.captureInner} />
                )}
             </TouchableOpacity>

             <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="flash-outline" size={32} color="white" />
             </TouchableOpacity>
           </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  permissionView: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    marginTop: 15,
    color: '#000',
  },
  permissionButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
