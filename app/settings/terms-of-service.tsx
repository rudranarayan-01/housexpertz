import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function TermsOfServiceScreen() {
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
        <Text className="text-white text-xl font-black tracking-tight">Terms of Service</Text>
      </View>

      {/* Terms Content Scroll */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-6 pb-12">
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 50 }}
        >
          <Text className="text-slate-500 text-xs font-medium mb-6">
            Welcome to HouseXpertz. By downloading, accessing, or using our mobile software marketplace, you explicitly agree to comply with and be bound by the subsequent legal framework stipulations.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">1. Scope of Marketplace Services</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            HouseXpertz operates purely as a structural marketplace platform linking consumers with independent third-party service contractors (&quot;Partners&quot;). **HouseXpertz does not provide the hands-on home technical services directly and does not employ the partners.**
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">2. User Account Accountability</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            You must be at least 18 years of age to order services. You maintain total personal custody over keeping your active authentication passwords secret and are accountable for all transactional sessions initiated through your instance.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">3. Bookings, Pricing & Cancellations</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-5">
            Service pricing structures are designated dynamically based on specific metrics. Cancellation fees apply automatically if you revoke a confirmed job order after the free grace-period allocation timer window expires.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">4. Disclaimers & Limitation of Liability</Text>
          <Text className="text-slate-600 text-sm leading-relaxed mb-6">
            Independent partners carry full responsibility for the quality, safety, and ultimate execution of their trade. HouseXpertz limits its liability to the maximum bounds permissible under applicable local statutes regarding accidental property damage or personal injury during a service.
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