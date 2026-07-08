// app/oauth-native-callback.tsx

import { ActivityIndicator, Text, View } from "react-native";

export default function OAuthNativeCallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-slate-500 font-semibold">
        Completing sign in...
      </Text>
    </View>
  );
}