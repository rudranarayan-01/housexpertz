import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords fields match error");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Password updated successfully!", [
                { text: "Login", onPress: () => router.replace('/(auth)/login') }
            ]);
        }, 1200);
    };

    return (
        <ScrollView className="flex-1 bg-[#0B132B]" contentContainerClassName="flex-grow justify-center" showsVerticalScrollIndicator={false}>
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="px-6 py-10">
                <Text className="text-white text-3xl font-black tracking-tight">Reset Password</Text>
                <Text className="text-slate-400 text-xs font-semibold mt-1">Establish your strong new account credential profile securely</Text>

                <View className="mt-8 gap-y-4">
                    <View>
                        <Text className="text-slate-300 text-xs font-bold mb-2">New Password</Text>
                        <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
                            <Ionicons name="key-outline" size={18} color="#64748B" />
                            <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="••••••••" placeholderTextColor="#475569" secureTextEntry autoCapitalize="none" className="flex-1 ml-3 font-semibold text-white text-sm" />
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-300 text-xs font-bold mb-2">Confirm New Password</Text>
                        <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
                            <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" />
                            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" placeholderTextColor="#475569" secureTextEntry autoCapitalize="none" className="flex-1 ml-3 font-semibold text-white text-sm" />
                        </View>
                    </View>
                </View>

                <Pressable onPress={handleReset} className="bg-blue-600 h-13 rounded-2xl mt-8 items-center justify-center">
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-black text-sm tracking-wide">Update & Complete</Text>}
                </Pressable>
            </MotiView>
        </ScrollView>
    );
}