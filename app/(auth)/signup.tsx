import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/explore');
    }, 1200);
  };

  return (
    <ScrollView className="flex-1 bg-[#0B132B]" contentContainerClassName="py-12" showsVerticalScrollIndicator={false}>
      <MotiView 
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="px-6"
      >
        <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl items-center justify-center mb-6">
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </Pressable>

        <Text className="text-white text-3xl font-black tracking-tight">Create Account</Text>
        <Text className="text-slate-400 text-xs font-semibold mt-1">Join HouseXpertz professional network</Text>

        <View className="mt-8 gap-y-4">
          <View>
            <Text className="text-slate-300 text-xs font-bold mb-2">Full Name</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
              <Ionicons name="person-outline" size={18} color="#64748B" />
              <TextInput value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor="#475569" className="flex-1 ml-3 font-semibold text-white text-sm" />
            </View>
          </View>

          <View>
            <Text className="text-slate-300 text-xs font-bold mb-2">Email Address</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
              <Ionicons name="mail-outline" size={18} color="#64748B" />
              <TextInput value={email} onChangeText={setEmail} placeholder="name@domain.com" placeholderTextColor="#475569" keyboardType="email-address" autoCapitalize="none" className="flex-1 ml-3 font-semibold text-white text-sm" />
            </View>
          </View>

          <View>
            <Text className="text-slate-300 text-xs font-bold mb-2">Phone Number</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
              <Ionicons name="call-outline" size={18} color="#64748B" />
              <TextInput value={phone} onChangeText={setPhone} placeholder="10-digit mobile number" placeholderTextColor="#475569" keyboardType="phone-pad" className="flex-1 ml-3 font-semibold text-white text-sm" />
            </View>
          </View>

          <View>
            <Text className="text-slate-300 text-xs font-bold mb-2">Password</Text>
            <View className="flex-row items-center bg-white/5 border border-white/10 h-13 rounded-2xl px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
              <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#475569" secureTextEntry autoCapitalize="none" className="flex-1 ml-3 font-semibold text-white text-sm" />
            </View>
          </View>
        </View>

        <Pressable onPress={handleSignup} className="bg-blue-600 h-13 rounded-2xl mt-8 items-center justify-center shadow-lg shadow-blue-600/30">
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-black text-sm tracking-wide">Register Account</Text>}
        </Pressable>
      </MotiView>
    </ScrollView>
  );
}