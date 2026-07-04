import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        // Simulate instantaneous auth transition payload
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)/explore');
        }, 1200);
    };

    return (
        <ScrollView className="flex-1 bg-[#0B132B]" contentContainerClassName="flex-grow justify-center" showsVerticalScrollIndicator={false}>
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                className="px-6 py-10"
            >
                {/* Branding Title */}
                <Text className="text-white text-3xl font-black tracking-tight">Welcome Back</Text>
                <Text className="text-slate-400 text-xs font-semibold mt-1">Sign in to continue to HouseXpertz</Text>

                {/* Form Container */}
                <View className="mt-8 gap-y-4">
                    <View>
                        <Text className="text-slate-300 text-xs font-bold mb-2">Email Address</Text>
                        <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4 focus:border-blue-500">
                            <Ionicons name="mail-outline" size={18} color="#64748B" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="enter your email"
                                placeholderTextColor="#475569"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 ml-3 font-semibold text-white text-sm"
                            />
                        </View>
                    </View>

                    <View>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-slate-300 text-xs font-bold">Password</Text>
                            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                                <Text className="text-blue-400 text-xs font-bold">Forgot?</Text>
                            </Pressable>
                        </View>
                        <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
                            <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#475569"
                                secureTextEntry={secureText}
                                autoCapitalize="none"
                                className="flex-1 ml-3 font-semibold text-white text-sm"
                            />
                            <Pressable onPress={() => setSecureText(!secureText)}>
                                <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={18} color="#64748B" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Primary Action Call */}
                <Pressable
                    onPress={handleLogin}
                    disabled={loading}
                    className="bg-blue-600 h-13 rounded-2xl mt-8 items-center justify-center active:bg-blue-700 shadow-lg shadow-blue-600/30"
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text className="text-white font-black text-sm tracking-wide">Sign In</Text>
                    )}
                </Pressable>

                {/* Alternative Route Link */}
                <View className="flex-row items-center justify-center mt-6">
                    <Text className="text-slate-400 text-xs font-semibold">Don't have an account? </Text>
                    <Pressable onPress={() => router.push('/(auth)/signup')}>
                        <Text className="text-blue-400 text-xs font-black">Sign Up</Text>
                    </Pressable>
                </View>

            </MotiView>
        </ScrollView>
    );
}