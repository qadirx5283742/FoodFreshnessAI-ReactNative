import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import DatabaseService, {
  DatabaseNotification,
} from "../../services/DatabaseService";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<DatabaseNotification[]>(
    []
  );

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (user) {
          await DatabaseService.checkAndCreateExpiryNotifications(user.id);
          const data = await DatabaseService.getNotifications(user.id);
          setNotifications(data);
        }
      };
      loadData();
    }, [user])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          padding: 20,
          color: colors.text,
        }}
      >
        {t("NOTIFICATIONS_TITLE")}
      </Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {item.imageUri ? (
              <Image
                source={{ uri: item.imageUri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  marginRight: 15,
                }}
              />
            ) : null}

            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
              >
                {item.title}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                {item.body}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 8,
                }}
              >
                {new Date(item.date).toLocaleDateString()} at{" "}
                {new Date(item.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: colors.textSecondary,
            }}
          >
            {t("NO_NOTIFICATIONS_TEXT")}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
