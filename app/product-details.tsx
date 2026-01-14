import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import DatabaseService from "../services/DatabaseService";
import { scheduleShelfLifeNotifications } from "../services/NotificationService";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState((params.name as string) || "");

  const scannedDate = params.scannedAt
    ? new Date(params.scannedAt as string)
    : new Date();
  const expiryDate = new Date(scannedDate);

  const freshnessStr = (params.freshness as string) || "0%";
  const freshnessPercentage = parseInt(freshnessStr.replace("%", "")) / 100;

  let originalShelfLife = 0;
  if (freshnessPercentage >= 0.85) originalShelfLife = 5;
  else if (freshnessPercentage >= 0.7) originalShelfLife = 4;
  else if (freshnessPercentage >= 0.55) originalShelfLife = 3;
  else if (freshnessPercentage > 0.45) originalShelfLife = 2;
  else if (freshnessPercentage > 0.2) originalShelfLife = 1;
  else originalShelfLife = 0;

  expiryDate.setDate(scannedDate.getDate() + originalShelfLife);
  const formattedScanned = scannedDate.toISOString().split("T")[0];
  const formattedExpiry = expiryDate.toISOString().split("T")[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryMidnight = new Date(expiryDate);
  expiryMidnight.setHours(0, 0, 0, 0);

  const diffTime = expiryMidnight.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isExpired = daysRemaining < 0;

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      Alert.alert(t("PRODUCT_NAME_ERROR_TITLE"), t("PRODUCT_NAME_ERROR_MSG"));
      return;
    }

    try {
      if (user && params.id) {
        await DatabaseService.updateScanName(
          Number(params.id),
          user.id,
          editedName
        );

        await scheduleShelfLifeNotifications(
          Number(params.id),
          editedName,
          originalShelfLife
        );

        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert(t("UPDATE_ERROR_TITLE"), t("UPDATE_ERROR_MSG"));
    }
  };

  const product = {
    name: editedName || (params.name as string) || "Apple",
    farm: (params.farm as string) || "Fresh Farm",
    freshness: (params.freshness as string) || "95%",
    expiryDate: formattedExpiry,
    scannedDate: formattedScanned,
    description: isExpired ? t("SPOILED_DESC") : t("FRESH_DESC"),
    imageId: params.imageId as string,
    icon: (params.icon as string) || "food-apple",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("PRODUCT_DETAILS_TITLE")}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: isDark ? colors.surface : "#F9F9F9" },
          ]}
        >
          <RNImage
            source={{ uri: params.imageUri as string }}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameContainer}>
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[
                    styles.nameInput,
                    {
                      color: colors.text,
                      borderColor: colors.primary,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  value={editedName}
                  onChangeText={setEditedName}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleSaveName}
                  style={styles.saveIconButton}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={32}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    setEditedName(params.name as string);
                  }}
                  style={styles.cancelIconButton}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={32}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text
                  style={[
                    styles.productName,
                    { color: isDark ? colors.primary : "#2E7D32" },
                  ]}
                >
                  {product.name}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={[styles.farmName, { color: colors.textSecondary }]}>
            {product.farm}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                styles.freshnessBadge,
                { backgroundColor: colors.primary },
              ]}
            >
              <MaterialCommunityIcons name="leaf" size={16} color="white" />
              <Text style={styles.badgeText}>
                {product.freshness} {t("STATUS_FRESH")}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                isExpired ? styles.expiredBadge : { borderRadius: 20 },
                {
                  backgroundColor: isExpired ? colors.error : colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={isExpired ? "alert-circle" : "calendar-clock"}
                size={16}
                color={isExpired ? "white" : colors.primary}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: isExpired ? "white" : colors.primary },
                ]}
              >
                {isExpired
                  ? t("EXPIRED_LABEL")
                  : `${daysRemaining} ${
                      daysRemaining > 1 ? t("DAYS_LEFT") : t("DAY_LEFT")
                    }`}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.expiryCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-month"
              size={24}
              color={colors.primary}
            />
            <View style={styles.dateBlock}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                {t("SCANNED_LABEL_DATE")}
              </Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {product.scannedDate}
              </Text>
            </View>
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
            <View style={styles.dateBlock}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                {t("EXPIRES_LABEL_DATE")}
              </Text>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {product.expiryDate}
              </Text>
            </View>
          </View>

          <View style={styles.detailsGroup}>
            <Text
              style={[
                styles.groupTitle,
                { color: isDark ? colors.primary : "#2E7D32" },
              ]}
            >
              {t("DESCRIPTION_TITLE")}
            </Text>
            <Text
              style={[styles.groupContent, { color: colors.textSecondary }]}
            >
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    padding: 24,
  },
  productName: {
    fontSize: 28,
    fontWeight: "800",
  },
  nameContainer: {
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saveIconButton: {
    padding: 2,
  },
  cancelIconButton: {
    padding: 2,
  },
  editButton: {
    padding: 4,
  },
  farmName: {
    fontSize: 16,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  freshnessBadge: {},
  expiredBadge: {
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  expiryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dateBlock: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  separator: {
    width: 1,
    height: "100%",
    marginHorizontal: 4,
  },
  detailsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  groupContent: {
    fontSize: 16,
    lineHeight: 22,
  },
});
