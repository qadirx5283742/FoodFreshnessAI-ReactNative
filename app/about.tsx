import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function AboutScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const FeatureItem = ({ icon, title, description }: any) => (
    <View style={styles.featureItem}>
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}
      >
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("ABOUT_TITLE")}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.brandingSection}>
          <View
            style={[styles.logoContainer, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="leaf" size={60} color="white" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>
            Smart Food Freshness AI
          </Text>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            {t("VERSION")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            {t("MISSION_TITLE")}
          </Text>
          <Text
            style={[styles.descriptionText, { color: colors.textSecondary }]}
          >
            {t("MISSION_TEXT")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            {t("KEY_FEATURES_TITLE")}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <FeatureItem
              icon="camera-iris"
              title={t("FEATURE_SCAN_TITLE")}
              description={t("FEATURE_SCAN_DESC")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <FeatureItem
              icon="bell-ring-outline"
              title={t("FEATURE_NOTIF_TITLE")}
              description={t("FEATURE_NOTIF_DESC")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <FeatureItem
              icon="theme-light-dark"
              title={t("FEATURE_THEME_TITLE")}
              description={t("FEATURE_THEME_DESC")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            {t("TECH_STACK_TITLE")}
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, padding: 20 },
            ]}
          >
            <Text style={[styles.techText, { color: colors.textSecondary }]}>
              {t("TECH_STACK_DESC")}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
            {t("COPYRIGHT_1")}
          </Text>
          <Text
            style={[
              styles.copyrightText,
              { color: colors.textSecondary, marginTop: 4 },
            ]}
          >
            {t("COPYRIGHT_2")}
          </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  brandingSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  featureItem: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  techText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
