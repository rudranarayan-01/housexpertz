import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-white">
      {/* Light status bar icons so they are visible over the dark #0B132B header */}
      <StatusBar style="light" backgroundColor="#0B132B" translucent />

      <Tabs
        screenOptions={{
          // Electric Blue for active states, muted Slate for inactive
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#94A3B8",

          // Premium bottom tab styling
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#F1F5F9",
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
            elevation: 10,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: -0.1,
          },
          headerShown: false, // Hidden because our premium screens implement custom status/headers
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}