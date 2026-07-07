import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsConditionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

      {/* BRAND THEME HEADER ARC */}
      <View 
        className="bg-[#0B132B] px-6 rounded-b-[40px] shadow-xl shadow-slate-900/10 z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 36 }}
      >
        <View className="max-w-4xl mx-auto w-full flex-row items-center">
          <Pressable 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center border border-white/10 active:opacity-70"
          >
            <Ionicons name="arrow-back" size={18} color="white" />
          </Pressable>
          <Text className="text-white text-lg md:text-xl font-black ml-4 tracking-tight">
            Terms & Conditions
          </Text>
        </View>
      </View>

      {/* LEGAL CONTENT STREAM CONTAINER */}
      <ScrollView
        className="flex-1 -mt-4 z-20"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingTop: 24, 
          paddingBottom: insets.bottom + 40 
        }}
      >
        <View className="max-w-4xl mx-auto w-full bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm">
          <Text className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
            User Agreement
          </Text>
          <Text className="text-2xl font-black text-[#0B132B] tracking-tight mb-2">
            Terms of Service
          </Text>
          <Text className="text-slate-400 text-xs font-medium mb-6">
            Last Updated: July 2026
          </Text>

          <Text className="text-slate-600 text-sm font-medium leading-6 mb-6">
            By accessing our system frameworks or initiating operational checkout paths, you agree to comply with and be bound entirely by the following structural rules.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
            1. Account Maintenance Rules
          </Text>
          <Text className="text-slate-500 text-sm font-medium leading-6 mb-6">
            Users must submit entirely accurate data when configuring profile keys. You are fully responsible for preserving the secret state of credentials and active system sessions on your hardware engines.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
            2. Service Booking & Cancellations
          </Text>
          <Text className="text-slate-500 text-sm font-medium leading-6 mb-6">
            Appointments and field technician operations remain bound to local availability matrices. Cancellations initiated less than 2 hours before an operations slot may incur standard system routing fee adjustments.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
            3. Liability Limitations
          </Text>
          <Text className="text-slate-500 text-sm font-medium leading-6 mb-6">
            Our system operators accept no liability for network disconnections, unpredicted environment structural variations, or service delays caused directly by regional logistical anomalies.
          </Text>

          <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
            4. Fair Platform Usage
          </Text>
          <Text className="text-slate-500 text-sm font-medium leading-6 mb-2">
            Any attempt to exploit transaction gateways, submit false reviews, bypass booking mechanics, or engage with engineering personnel off-platform will trigger immediate, permanent profile suspension.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}