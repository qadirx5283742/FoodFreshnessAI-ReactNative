import DatabaseService from "@/services/DatabaseService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { deleteAccount } = useAuth();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfileImage = async () => {
        if (user) {
          const savedUri = await DatabaseService.getProfileImage(user.id);
          if (savedUri) setProfileImage(savedUri);
        }
      };
      loadProfileImage();
    }, [user])
  );

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateUser(fullName);
      Alert.alert(t("UPDATE_SUCCESS_TITLE"), t("UPDATE_SUCCESS_MSG"));
      router.back();
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      Alert.alert(t("UPDATE_ERROR_TITLE"), message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("DELETE_ACCOUNT_TITLE"), t("DELETE_ACCOUNT_MSG"), [
      { text: t("CANCEL"), style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAccount();
            Alert.alert(t("ACCOUNT_DELETED_TITLE"), t("ACCOUNT_DELETED_MSG"));
            router.replace("/(auth)/login");
          } catch (err: any) {
            Alert.alert(
              t("UPDATE_ERROR_TITLE"),
              "Please logout and login again to delete your account."
            );
          }
        },
      },
    ]);
  };

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
          {t("EDIT_PROFILE_TITLE")}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: "100%", height: "100%", borderRadius: 50 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account"
                  size={60}
                  color="white"
                />
              )}
            </View>
            <Text
              style={[styles.avatarSubtext, { color: colors.textSecondary }]}
            >
              {t("AVATAR_SUBTEXT")}
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t("FULL_NAME_LABEL")}
            </Text>
            <CustomInput
              placeholder={t("FULL_NAME_PLACEHOLDER_EDIT")}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              icon="account-outline"
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t("EMAIL_LABEL")}
            </Text>
            <CustomInput
              value={user?.email || ""}
              editable={false}
              icon="email-outline"
              style={styles.readOnlyInput}
            />

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
              title={isLoading ? t("SAVING_BTN") : t("SAVE_CHANGES_BTN")}
              onPress={handleSave}
              disabled={isLoading}
              style={styles.saveButton}
            />
            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={[styles.deleteButton, { borderColor: colors.error }]}
            >
              <Text style={[styles.deleteButtonText, { color: colors.error }]}>
                {t("DELETE_ACCOUNT_BTN")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSubtext: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  readOnlyInput: {
    opacity: 0.7,
  },
  saveButton: {
    marginTop: 20,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  errorText: {
    color: "#FF5252",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
