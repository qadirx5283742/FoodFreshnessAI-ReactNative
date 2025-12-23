import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <View style={styles.permissionView}>
            <MaterialCommunityIcons name="camera-off" size={64} color={Colors.primary} />
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
           {/* Top Controls */}
           <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
           >
             <MaterialCommunityIcons name="close" size={30} color="white" />
           </TouchableOpacity>

           {/* Bottom Controls */}
           <View style={styles.bottomControls}>
             <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                <MaterialCommunityIcons name="camera-flip" size={32} color="white" />
             </TouchableOpacity>

             <TouchableOpacity style={styles.captureButton}>
                <View style={styles.captureInner} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="flash-outline" size={32} color="white" />
             </TouchableOpacity>
           </View>
        </View>
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
    backgroundColor: Colors.primary,
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
    marginTop: 40,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
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
