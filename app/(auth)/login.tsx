import { useOAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from "expo-linking";
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';

export default function LoginScreen() {
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const handleGoogleSignIn = async () => {
        try {
            const redirectUrl = Linking.createURL("/oauth-native-callback");

            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl,
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error("OAuth handshake error:", err);
        }
    };

    return (
        <View className="flex-1 bg-slate-50 items-center justify-center p-6">
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 300 }}
                className="w-full max-w-sm items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl"
            >
                <View className="w-14 h-14 bg-[#0B132B] rounded-2xl flex items-center justify-center mb-5 shadow-md">
                    <Text className="text-white font-black text-xl">HX</Text>
                </View>

                <Text className="text-slate-900 font-black text-2xl tracking-tight text-center">Welcome to HouseXpertz</Text>
                <Text className="text-slate-400 text-xs font-semibold text-center mt-2 mb-8 leading-5">
                    Sign in to access premium home maintenance operations, track live technician tasks, and manage service bookings.
                </Text>

                <Pressable
                    onPress={handleGoogleSignIn}
                    className="w-full bg-[#0B132B] py-4 rounded-2xl active:opacity-90 flex-row items-center justify-center shadow-md shadow-slate-900/10"
                >
                    <MaterialCommunityIcons name="google" size={16} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-black text-xs uppercase tracking-widest">Continue with Google</Text>
                </Pressable>
            </MotiView>
        </View>
    );
}