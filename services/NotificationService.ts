import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return null;
}

export async function scheduleLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: null,
  });
}

export async function scheduleShelfLifeNotifications(
  scanId: number,
  itemName: string,
  shelfLifeDays: number
) {
  if (shelfLifeDays <= 0) return;

  console.log(`Scheduling ${shelfLifeDays} notifications for ${itemName}`);

  for (let i = 1; i <= shelfLifeDays; i++) {
    const daysLeft = shelfLifeDays - i;
    const body =
      daysLeft === 0
        ? `Your ${itemName} expires today! 🍎`
        : `Your ${itemName} has ${daysLeft} day${
            daysLeft > 1 ? "s" : ""
          } left. 🍏`;

    const seconds = i * 24 * 60 * 60;

    await Notifications.scheduleNotificationAsync({
      identifier: `shelf-life-${scanId}-${i}`,
      content: {
        title: "Food Freshness Update",
        body: body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
      },
    });
  }
}
