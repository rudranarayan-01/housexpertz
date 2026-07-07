import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
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
                        Privacy Policy
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
                        Privacy Protection
                    </Text>
                    <Text className="text-2xl font-black text-[#0B132B] tracking-tight mb-2">
                        Data Privacy Standards
                    </Text>
                    <Text className="text-slate-400 text-xs font-medium mb-6">
                        Last Updated: July 2026
                    </Text>

                    <Text className="text-slate-600 text-sm font-medium leading-6 mb-6">
                        We value your trust and are committed to protecting your personal metrics data. This document outlines how we collect, process, share, and protect your info across our system frameworks.
                    </Text>

                    <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
                        1. Information We Collect
                    </Text>
                    <Text className="text-slate-500 text-sm font-medium leading-6 mb-5">
                        • <Text className="font-bold text-slate-700">Account Credentials:</Text> Contact metrics, authentication encryption tokens, and saved regional operational addresses.{"\n\n"}
                        • <Text className="font-bold text-slate-700">Device Tracking:</Text> Spatial coordinates data, IP metrics addresses, and system hardware configs gathered while matching specialist routings.{"\n\n"}
                        • <Text className="font-bold text-slate-700">Payment Transactions:</Text> Secure payment engine tokens processed through verified structural banking gateways.
                    </Text>

                    <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
                        2. How Your Data Is Processed
                    </Text>
                    <Text className="text-slate-500 text-sm font-medium leading-6 mb-6">
                        Your parameters are used exclusively to deploy local technical services, complete transparent transaction logs, verify structural security patterns, and provide automated routing status alerts.
                    </Text>

                    <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
                        3. Information Protection & Safety Keys
                    </Text>
                    <Text className="text-slate-500 text-sm font-medium leading-6 mb-6">
                        All network streams run directly under Transport Layer Security (TLS) and data assets are locked into AES-256 cloud encryption structures. We never trade or rent out personal data registers to third-party ad frameworks.
                    </Text>

                    <Text className="text-[#0B132B] text-base font-black tracking-tight mb-2">
                        4. User Data Rights
                    </Text>
                    <Text className="text-slate-500 text-sm font-medium leading-6 mb-2">
                        You retain full authorization rights over your profile registers. You may request information purging, database extractions, or temporary account system freezes directly by opening a support terminal line.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}