import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
} from "../services/NotificationService";

import { HapticService } from "../services/HapticService";

const SETTINGS_KEY = "@app_settings";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setHapticFeedback(parsed.hapticFeedback ?? true);
        if (parsed.language) {
          i18n.changeLanguage(parsed.language);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    if (key === "notificationsEnabled") {
      setNotificationsEnabled(value);
      if (value) {
        await registerForPushNotificationsAsync();
      }
    }
    if (key === "hapticFeedback") setHapticFeedback(value);

    HapticService.selection();

    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const currentSettings = savedSettings ? JSON.parse(savedSettings) : {};
      const newSettings = { ...currentSettings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving setting:", error);
    }
  };

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    saveSetting("language", lang);
    setLanguageModalVisible(false);
  };

  const handleTestNotification = async () => {
    HapticService.notification();
    await scheduleLocalNotification(
      "Test Notification 🍎",
      "FoodFreshnessAI notification system is working perfectly!"
    );
  };

  const SettingRow = ({
    icon,
    label,
    subLabel,
    value,
    onToggle,
    type = "switch",
    onPress,
  }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.iconBackground },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={colors.primary}
          />
        </View>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            {label}
          </Text>
          {subLabel && (
            <Text
              style={[styles.settingSubLabel, { color: colors.textSecondary }]}
            >
              {subLabel}
            </Text>
          )}
        </View>
      </View>
      {type === "switch" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#D1D1D1", true: colors.primary + "80" }}
          thumbColor={value ? colors.primary : "#F4F3F4"}
          ios_backgroundColor="#3e3e3e"
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
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
          {t("SETTING_BTN")}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("PREFERENCES")}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="theme-light-dark"
              label={t("THEME")}
              subLabel={`${t("LIGHT")} / ${t("DARK")}`}
              value={isDark}
              onToggle={(val: boolean) => setTheme(val ? "dark" : "light")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("NOTIFICATIONS")}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="bell-outline"
              label={t("NOTIFICATIONS")}
              subLabel="Get alerts about food freshness"
              value={notificationsEnabled}
              onToggle={(val: boolean) =>
                saveSetting("notificationsEnabled", val)
              }
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={[
                styles.testButton,
                { backgroundColor: colors.primary + "10" },
              ]}
              onPress={handleTestNotification}
              disabled={!notificationsEnabled}
            >
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.testButtonText, { color: colors.primary }]}>
                Send Test Notification
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("PREFERENCES")}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="vibrate"
              label={t("HAPTIC_FEEDBACK")}
              subLabel="Subtle vibrations for interactions"
              value={hapticFeedback}
              onToggle={(val: boolean) => saveSetting("hapticFeedback", val)}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingRow
              icon="earth"
              label={t("LANGUAGE")}
              subLabel={i18n.language === "fr" ? t("FRENCH") : t("ENGLISH_US")}
              type="chevron"
              onPress={() => setLanguageModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t("ACCOUNT")}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="help-circle-outline"
              label={t("HELP_TITLE")}
              subLabel="FAQs and contact info"
              type="chevron"
              onPress={() => router.push("/help-support")}
            />
          </View>
        </View>

        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Version 1.0.0 (Build 124)
        </Text>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t("SELECT_LANGUAGE")}
              </Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.languageOption,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text style={styles.flag}>🇺🇸</Text>
              <Text style={[styles.languageText, { color: colors.text }]}>
                {t("ENGLISH_US")}
              </Text>
              {i18n.language === "en" && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage("fr")}
            >
              <Text style={styles.flag}>🇫🇷</Text>
              <Text style={[styles.languageText, { color: colors.text }]}>
                {t("FRENCH")}
              </Text>
              {i18n.language === "fr" && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});
