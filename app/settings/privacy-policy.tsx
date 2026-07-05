import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Premium Header */}
      <View className="bg-[#0B132B] pt-14 pb-5 px-6 rounded-b-[32px] shadow-md flex-row items-center">
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center mr-4 active:scale-95"
        >
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </Pressable>
        <Text className="text-white text-xl font-black tracking-tight">Privacy Policy</Text>
      </View>

      {/* Policy Content Scroll */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-6 pb-12">
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text className="text-slate-500 text-xs font-medium mb-6">
            At HouseXpertz, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">1. Information We Collect</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            To deliver top-tier on-demand home services, we collect user details including your name, email, phone number, and precise geographical location data. Location tracking is essential to match you efficiently with nearby service professionals and ensure exact delivery addresses.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">2. How We Use Your Information</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            Your data helps us process secure transactions, send instant booking updates, facilitate communications between you and assigned technicians, and optimize platform safety against fraudulent behavior.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">3. Data Sharing & Marketplace Dynamics</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            As a marketplace platform, HouseXpertz shares your coordinate destination, name, and contact details directly with the verified independent service professional assigned to handle your booking. We do not sell your personal information to third-party advertisers.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">4. Payment Processing</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-6">
            All credit card, debit card, or digital wallet transactions are encrypted and routed safely through certified payment gateways. HouseXpertz does not directly log or store your full card numbers on local infrastructure arrays.
          </Text>

          {/* Divider Line */}
          <View className="h-[1px] bg-slate-100 my-4" />

          {/* Document Footer Metadata */}
          <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">App Name</Text>
              <Text className="text-[#0B132B] text-xs font-black">HouseXpertz</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Build Version</Text>
              <Text className="text-blue-600 text-xs font-black">1.0.0 (Release-2026.1)</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Effective Date</Text>
              <Text className="text-[#0B132B] text-xs font-black">July 5, 2026</Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}