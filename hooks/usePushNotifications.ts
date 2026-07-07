import { useAuth } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePushNotifications() {
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        const registerAndSyncToken = async () => {
            // 1. Structural Interceptor: Only proceed if authenticated
            if (!isSignedIn) return;

            // 2. Hardware Verification Interceptor
            if (!Device.isDevice) {
                console.log('[Push] Execution halted: Hardware emulator environment detected.');
                return;
            }

            try {
                // 3. Android Push Channel Registration
                if (Platform.OS === 'android') {
                    await Notifications.setNotificationChannelAsync('default', {
                        name: 'Default Operations',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#2563EB',
                    });
                }

                // 4. Request Permissions Defensively
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    console.warn('[Push] Permission denied by the device user.');
                    return;
                }

                // 5. SDK 54 Compliant Project ID Resolution
                const projectId =
                    Constants.expoConfig?.extra?.eas?.projectId ??
                    Constants.easConfig?.projectId;

                if (!projectId) {
                    console.error('[Push] Setup aborted: Missing EAS Project ID in app.json.');
                    return;
                }

                // 6. Fetch Token from Expo Infrastructure
                const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
                const pushToken = tokenResponse.data;

                if (pushToken) {
                    // 🚀 CLEAN DEVELOPMENT CONSOLE LOG
                    console.log('============= EXPO PUSH TOKEN =============');
                    console.log(pushToken);
                    console.log('===========================================');

                    const jwt = await getToken();
                    if (!jwt) return;

                    // 7. Execute Handshake using perfectly matched request keys
                    const response = await fetch('https://api.housexpertz.in/api/v1/notifications/register-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwt}`,
                        },
                        body: JSON.stringify({ 
                            token: pushToken,          // Matched with backend destructor
                            platform: Platform.OS      // Sends 'ios' or 'android' to backend
                        }),
                    });

                    if (response.ok) {
                        console.log('[Push] Device token successfully bound to user cloud profile.');
                    } else {
                        console.error('[Push] Remote enrollment failed with status:', response.status);
                    }
                }
            } catch (error) {
                console.error('[Push] Production setup pipeline encountered an error:', error);
            }
        };

        registerAndSyncToken();
    }, [isSignedIn]);
}