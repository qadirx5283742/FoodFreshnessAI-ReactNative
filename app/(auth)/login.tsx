import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getAuthErrorMessage } from "../../utils/authErrors";

export default function Login() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email or Password is incorrect.");
      return;
    }

    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      Alert.alert(t("LOGIN_ERROR_TITLE"), message);
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("@app_settings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language) {
            i18n.changeLanguage(parsed.language);
          }
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      const savedSettings = await AsyncStorage.getItem("@app_settings");
      const currentSettings = savedSettings ? JSON.parse(savedSettings) : {};
      const newSettings = { ...currentSettings, language: lang };
      await AsyncStorage.setItem("@app_settings", JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving language:", error);
    }
    setLanguageModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Text style={styles.languageFlag}>
          {i18n.language === "fr" ? "🇫🇷" : "🇺🇸"}
        </Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
              {t("WELCOME_BACK")}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t("LOGIN_SUBTITLE")}
            </Text>

            <View style={styles.form}>
              <CustomInput
                placeholder={t("EMAIL_PLACEHOLDER")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email-outline"
              />

              <CustomInput
                placeholder={t("PASSWORD_PLACEHOLDER")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                icon="lock-outline"
                rightIcon={showPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text
                  style={[styles.forgotPasswordText, { color: colors.primary }]}
                >
                  {t("FORGOT_PASSWORD_BTN")}
                </Text>
              </TouchableOpacity>

              {error && (
                <View
                  style={[
                    styles.errorContainer,
                    {
                      backgroundColor: isDark ? "#3D1C1C" : "#FFEBEE",
                      borderColor: isDark ? "#A94442" : "#FFCDD2",
                    },
                  ]}
                >
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <CustomButton
                title={t("LOGIN_BTN")}
                onPress={handleLogin}
                style={styles.button}
              />

              <View style={styles.footer}>
                <Text
                  style={[styles.footerText, { color: colors.textSecondary }]}
                >
                  {t("NO_ACCOUNT_TEXT")}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text style={[styles.signupLink, { color: colors.primary }]}>
                    {t("SIGNUP_LINK")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  signupLink: {
    fontWeight: "bold",
    fontSize: 15,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  errorText: {
    color: "#FF5252",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  languageButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageFlag: {
    fontSize: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
