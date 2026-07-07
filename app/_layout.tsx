import { tokenCache } from '@/utils/tokenCache';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications'; // Added for foreground configurations
import { usePushNotifications } from '@/hooks/usePushNotifications'; // Added custom hook
import "./global.css";

// 1. Configure production rules for managing notifications arriving while the app is active
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

// 2. Headless Context consumer component to keep your layout file perfectly clean
function AppInitializer() {
  usePushNotifications(); // Keeps the push registration tracking beautifully isolated
  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          {/* 1. SafeAreaProvider sits at the absolute top */}
          <SafeAreaProvider>
            
            {/* Registers push events securely after context verification */}
            <AppInitializer />

            {/* 2. Stack sets up the Navigation Context for everything inside it */}
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

          </SafeAreaProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
