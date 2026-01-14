import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./../context/AuthContext";
import { useTheme } from "./../context/ThemeContext";
import DatabaseService from "./../services/DatabaseService";
import { HapticService } from "./../services/HapticService";
import { scheduleShelfLifeNotifications } from "./../services/NotificationService";
import StorageService from "./../services/StorageService";
import TfliteService from "./../services/TfliteService";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setIsScanning(false);
    }, [])
  );

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionView}>
          <MaterialCommunityIcons
            name="camera-off"
            size={64}
            color={colors.primary}
          />
          <Text style={styles.message}>{t("PERMISSION_MSG")}</Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>
              {t("GRANT_PERMISSION_BTN")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    HapticService.selection();
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    HapticService.selection();
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  const handleCapture = async () => {
    console.log("--- CAPTURE BUTTON PRESSED ---");
    if (!cameraRef.current || isScanning) {
      console.log("Capture aborted: camera not ready or already scanning");
      return;
    }

    try {
      setIsScanning(true);
      HapticService.trigger();

      console.log("Taking picture...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (!photo) throw new Error("Could not capture photo");
      console.log("Picture taken. URI:", photo.uri);

      console.log("Saving image to local storage...");
      const permanentImageUri = await StorageService.saveImage(photo.uri);
      console.log("Image saved at:", permanentImageUri);
      console.log("Calling TFLite analysis...");
      const analysisResult = await TfliteService.analyzeImage(photo.uri);
      console.log("Analysis result received:", analysisResult);

      const rawScore = analysisResult.confidence;
      console.log("Raw Score to use (Lower=Fresher):", rawScore);

      const freshnessPercentage = Math.max(
        0,
        Math.min(100, Math.round(95 - 84 * rawScore))
      );

      let status = "Spoiled";
      let shelfLifeDays = 0;

      if (freshnessPercentage >= 85) {
        status = "Fresh";
        shelfLifeDays = 5;
      } else if (freshnessPercentage >= 70) {
        status = "Fresh";
        shelfLifeDays = 4;
      } else if (freshnessPercentage >= 55) {
        status = "Fresh";
        shelfLifeDays = 3;
      } else if (freshnessPercentage > 45) {
        status = "Fresh";
        shelfLifeDays = 2;
      } else if (freshnessPercentage > 20) {
        status = "Fresh";
        shelfLifeDays = 1;
      } else {
        status = "Spoiled";
        shelfLifeDays = 0;
      }

      const result = {
        itemName: "Food Item",
        freshnessScore: `${freshnessPercentage}%`,
        status: status,
        shelfLifeDays: shelfLifeDays,
        farm: "Local Analysis",
        icon: "food",
        imageUri: permanentImageUri,
      };

      console.log("Saving scan to SQLite...");

      if (!user) {
        throw new Error("User not authenticated");
      }

      const scanId = await DatabaseService.addScan({
        userId: user.id,
        itemName: result.itemName,
        freshnessScore: result.freshnessScore,
        status: result.status,
        shelfLifeDays: result.shelfLifeDays,
        icon: result.icon,
        farm: result.farm,
        imageUri: result.imageUri,
        scannedAt: new Date().toISOString(),
      });
      console.log("Scan saved successfully to SQLite");

      await scheduleShelfLifeNotifications(
        scanId,
        result.itemName,
        result.shelfLifeDays
      );

      HapticService.notification();
      Alert.alert(
        t("SCAN_SUCCESS_TITLE"),
        `${result.itemName} has been analyzed: ${result.status} (${result.freshnessScore})`
      );
      router.replace("/(tabs)/list");
    } catch (error: any) {
      console.error("Scan Error:", error);
      Alert.alert(t("SCAN_FAILED_TITLE"), error.message || t("SCAN_ERROR_MSG"));
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash}
        enableTorch={flash === "on"}
        ref={cameraRef}
      >
        <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
          <View style={styles.scanHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="close" size={30} color="white" />
            </TouchableOpacity>

            <Text style={styles.scanTitle}>{t("SCAN_FOOD_TITLE")}</Text>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleCameraFacing}
            >
              <MaterialCommunityIcons
                name="camera-flip"
                size={32}
                color="white"
              />
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

            <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
              <MaterialCommunityIcons
                name={flash === "on" ? "flash" : "flash-outline"}
                size={32}
                color={flash === "on" ? "#FFD700" : "white"}
              />
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
    justifyContent: "center",
    backgroundColor: "#000",
  },
  scanHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  permissionView: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
  },
  message: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    marginTop: 15,
    color: "#000",
  },
  permissionButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    justifyContent: "space-between",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 22,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
