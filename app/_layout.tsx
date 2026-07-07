import { notificationService } from '@/services/notificationService';
import { tokenCache } from '@/utils/tokenCache';
import { ClerkLoaded, ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment.");
}

// 1. INNER CONTENT CONTAINER (Safe to consume contexts here)
function InitialLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const initializePushNotifications = async () => {
      const pushToken = await notificationService.registerForPushNotificationsAsync();

      if (pushToken) {
        console.log('Successfully registered Expo Push Token:', pushToken);

        if (isSignedIn && user) {
          await saveTokenToBackend(user.id, pushToken);
        }
      }
    };

    initializePushNotifications();
  }, [isSignedIn, user?.id]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Service Details"
        }}
      />
    </Stack>
  );
}

// 2. MASTER ROOT HOOK PLATFORM (Mounts Top Level Global Context Providers)
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>

            {/* InitialLayout now sits completely inside ClerkProvider */}
            <InitialLayout />

          </SafeAreaProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

async function saveTokenToBackend(userId: string, token: string) {
  try {
    // Replace this with your actual database or API endpoint hook
    console.log(`Linking device token to user database context account [ID: ${userId}]`);
  } catch (err) {
    console.error('Failed to sync push token matrix with database server:', err);
  }
}