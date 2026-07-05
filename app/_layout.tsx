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

export default function RootLayout() {
  return (
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
  );
}