import { tokenCache } from '@/utils/tokenCache';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,                  // Automatically retry failing requests twice
      staleTime: 1000 * 60 * 5,  // Consider data fresh for 5 minutes
    },
  },
});

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment.");
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>

          <Stack screenOptions={{ headerShown: false }}>
            {/* The main tab interface */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="services" options={{ headerShown: false }} />

            {/* The modal pops up over the tabs screen smoothly */}
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Service Details"
              }}
            />
          </Stack>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}