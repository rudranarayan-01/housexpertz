import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

// Warms up the native mobile browser for incredibly fast OAuth handshakes
WebBrowser.maybeCompleteAuthSession();

export default function AuthGateScreen() {
    // Configures native Google Social Federation matching your web dashboard strategy
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error('OAuth operational handshake error:', err);
        }
    };

    return (
        <View className="flex-1 bg-[#0B132B] items-center justify-center p-6">
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm items-center bg-slate-900/40 p-8 rounded-[32px] border border-white/5"
            >
                <View className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                    <Text className="text-white font-black text-xl">HS</Text>
                </View>

                <Text className="text-white font-black text-xl tracking-tight text-center">Welcome to HouseXpertz</Text>
                <Text className="text-slate-400 text-xs font-semibold text-center mt-1 mb-8">
                    Sign in to view your dynamic service logs and synchronize historical platform profiles.
                </Text>

                <Pressable
                    onPress={handleGoogleSignIn}
                    className="w-full flex-row items-center justify-center bg-white py-4 rounded-2xl active:opacity-90 shadow-sm"
                >
                    <Text className="text-slate-900 font-black text-xs uppercase tracking-wider">Continue with Google</Text>
                </Pressable>
            </MotiView>
        </View>
    );
}