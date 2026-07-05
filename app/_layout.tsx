import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The main tab interface */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      
      {/* The modal pops up over the tabs screen smoothly */}
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