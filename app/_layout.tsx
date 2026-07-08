import { tokenCache } from "@/utils/tokenCache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { usePushNotifications } from "@/hooks/usePushNotifications";
import "./global.css";

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
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment."
  );
}

function AppInitializer() {
  usePushNotifications();
  return null;
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="oauth-native-callback" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="services" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Service Details",
        }}
      />
    </Stack>
  );
}

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  if (!isLoaded) return null;

  const currentGroup = segments[0];
  const inAuthGroup = currentGroup === "(auth)";
  const inOAuthCallback = currentGroup === "oauth-native-callback";

  if (isSignedIn && (inAuthGroup || inOAuthCallback)) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isSignedIn && !inAuthGroup && !inOAuthCallback) {
    return <Redirect href="/(auth)/login" />;
  }

  return <AppStack />;
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AppInitializer />
            <AuthGate />
          </SafeAreaProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}