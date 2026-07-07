import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const notificationService = {
  /**
   * Requests device permissions and retrieves the native Expo Push Token
   * Returns null if permission is denied or running on a simulator/emulator without setup.
   */
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    // 1. Android Specific Channel Configuration
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB', // Aligned to your theme primary blue
      });
    }

    // 2. Prevent Simulators from breaking the flow
    if (!Device.isDevice) {
      console.warn('Physical device required for official Push Notifications');
      return null;
    }

    // 3. Check existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 4. Ask for permission if not granted yet
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 5. Intercept if user explicitly declines
    if (finalStatus !== 'granted') {
      console.warn('Failed to obtain push token: Permission denied');
      return null;
    }

    try {
      // 6. Retrieve the Expo push token
      // projectId must be linked to your EAS configuration in app.json
      const projectId = 
        Constants.expoConfig?.extra?.eas?.projectId ?? 
        Constants.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found in app.json configurations.');
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return tokenData.data; // This is the actual string token (Ex: ExponentPushToken[xxx])
    } catch (error) {
      console.error('Error fetching push token:', error);
      return null;
    }
  },
};