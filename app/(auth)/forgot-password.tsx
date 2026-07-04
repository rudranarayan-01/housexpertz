import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Route over straight to your parameter validation update token block
      router.push('/(auth)/reset-password');
    }, 1200);
  };

  return (
    <ScrollView className="flex-1 bg-[#0B132B]" contentContainerClassName="flex-grow justify-center" showsVerticalScrollIndicator={false}>
      <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-10">
        <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl items-center justify-center mb-6">
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </Pressable>

        <Text className="text-white text-3xl font-black tracking-tight">Recover Key</Text>
        <Text className="text-slate-400 text-xs font-semibold mt-1">We will send a validation block link to update account details</Text>

        <View className="mt-8">
          <Text className="text-slate-300 text-xs font-bold mb-2">Account Email</Text>
          <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
            <Ionicons name="mail-outline" size={18} color="#64748B" />
            <TextInput value={email} onChangeText={setEmail} placeholder="enter verified email" placeholderTextColor="#475569" autoCapitalize="none" className="flex-1 ml-3 font-semibold text-white text-sm" />
          </View>
        </View>

        <Pressable onPress={handleVerification} className="bg-blue-600 h-13 rounded-2xl mt-8 items-center justify-center">
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-black text-sm tracking-wide">Send Reset Link</Text>}
        </Pressable>
      </MotiView>
    </ScrollView>
  );
}