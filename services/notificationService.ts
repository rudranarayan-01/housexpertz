import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const notificationService = {
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }

    // 2. Prevent Simulators from breaking the flow
    if (!Device.isDevice) {
      console.warn("Physical device required for official Push Notifications");
      return null;
    }

    // 3. Check existing permission status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 4. Ask for permission if not granted yet
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 5. Intercept if user explicitly declines
    if (finalStatus !== "granted") {
      console.warn("Failed to obtain push token: Permission denied");
      return null;
    }

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found in app.json configurations.");
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log('Push token retrieved:', tokenData.data);
      return tokenData.data;
    } catch (error) {
      console.error("Error fetching push token:", error);
      return null;
    }
  },
};
