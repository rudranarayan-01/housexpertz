import { useAuth } from '@clerk/clerk-expo';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
    const { signOut } = useAuth();
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Download HouseXpertz - Get professional home services, deep cleaning, and expert repairs instantly!',
            });
        } catch (error) {
            Alert.alert('Error', 'Could not initiate app share protocol.');
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to sign out of HouseXpertz?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => console.log('User signed out') },
        ]);
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* 1. TOP PREMIUM HEADER */}
            <View className="bg-[#0B132B] pt-14 pb-6 px-6 rounded-b-[32px] shadow-md flex-row items-center">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center mr-4 active:scale-95"
                >
                    <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                </Pressable>
                <Text className="text-white text-xl font-black tracking-tight">App Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-12">

                {/* 2. MINI PROFILE PREVIEW SNAPSHOT */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-6 mt-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-row items-center"
                >
                    <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center border border-blue-100">
                        <Text className="text-blue-600 font-black text-lg">JD</Text>
                    </View>
                    <View className="ml-4 flex-1">
                        <Text className="text-slate-900 font-black text-base tracking-tight">John Doe</Text>
                        <Text className="text-slate-400 text-xs font-semibold">+91 98765 43210</Text>
                    </View>
                    <View className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        <Text className="text-emerald-600 font-bold text-[10px] tracking-wide uppercase">Verified</Text>
                    </View>
                </MotiView>

                {/* 3. SETTINGS GROUP: PREFERENCES */}
                <View className="px-6 mt-6">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2 mb-3">Preferences</Text>
                    <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* Push Notifications Toggle Switch */}
                        <View className="flex-row items-center justify-between p-4 border-b border-slate-50">
                            <View className="flex-row items-center flex-1">
                                <View className="w-9 h-9 bg-orange-50 rounded-xl items-center justify-center mr-3">
                                    <Ionicons name="notifications" size={18} color="#FF5A1F" />
                                </View>
                                <View>
                                    <Text className="text-slate-800 font-bold text-sm tracking-tight">Push Notifications</Text>
                                    <Text className="text-slate-400 text-[11px] font-medium">Order updates & promotions</Text>
                                </View>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                                thumbColor={notificationsEnabled ? '#2563EB' : '#94A3B8'}
                            />
                        </View>

                        {/* Dark Mode Config Info Node */}
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center flex-1">
                                <View className="w-9 h-9 bg-purple-50 rounded-xl items-center justify-center mr-3">
                                    <MaterialCommunityIcons name="theme-light-dark" size={18} color="#8B5CF6" />
                                </View>
                                <View>
                                    <Text className="text-slate-800 font-bold text-sm tracking-tight">App Theme</Text>
                                    <Text className="text-slate-400 text-[11px] font-medium">System Dark Mode Adaptive</Text>
                                </View>
                            </View>
                            <Text className="text-slate-400 text-xs font-bold mr-1">System Default</Text>
                        </View>

                    </View>
                </View>

                {/* 4. SETTINGS GROUP: LEGAL & COMPLIANCE */}
                <View className="px-6 mt-6">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2 mb-3">Legal & Safety</Text>
                    <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* Navigation link to Privacy Policy Screen */}
                        <Pressable
                            onPress={() => router.push('/settings/privacy-policy')}
                            className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50"
                        >
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 bg-blue-50 rounded-xl items-center justify-center mr-3">
                                    <FontAwesome6 name="shield-halved" size={16} color="#3B82F6" />
                                </View>
                                <Text className="text-slate-800 font-bold text-sm tracking-tight">Privacy Policy</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                        </Pressable>

                        {/* Navigation link to Terms of Service Screen */}
                        <Pressable
                            onPress={() => router.push('/settings/terms-of-service')}
                            className="flex-row items-center justify-between p-4 active:bg-slate-50"
                        >
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 bg-emerald-50 rounded-xl items-center justify-center mr-3">
                                    <Ionicons name="document-text" size={18} color="#10B981" />
                                </View>
                                <Text className="text-slate-800 font-bold text-sm tracking-tight">Terms of Service</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                        </Pressable>

                    </View>
                </View>

                {/* 5. SETTINGS GROUP: SUPPORT & APP VALUES */}
                <View className="px-6 mt-6">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2 mb-3">Support & Interactions</Text>
                    <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                        {/* Help Center */}
                        <Pressable className="flex-row items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50">
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 bg-pink-50 rounded-xl items-center justify-center mr-3">
                                    <Ionicons name="help-buoy" size={18} color="#EC4899" />
                                </View>
                                <Text className="text-slate-800 font-bold text-sm tracking-tight">Help Center & Bookings Support</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                        </Pressable>

                        {/* Share App Action Node */}
                        <Pressable
                            onPress={handleShareApp}
                            className="flex-row items-center justify-between p-4 active:bg-slate-50"
                        >
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 bg-yellow-50 rounded-xl items-center justify-center mr-3">
                                    <Ionicons name="share-social" size={18} color="#EAB308" />
                                </View>
                                <Text className="text-slate-800 font-bold text-sm tracking-tight">Share HouseXpertz App</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                        </Pressable>

                    </View>
                </View>

                {/* 6. ACCOUNT DISMISSAL SYSTEM ACTION BUTTON */}
                <View className="px-6 mt-8">
                    <Pressable
                        onPress={() => signOut()}
                        className="bg-rose-50 border border-rose-100 py-4 rounded-2xl items-center justify-center active:scale-95"
                    >
                        <Text className="text-rose-600 font-black text-sm tracking-tight">Logout Account</Text>
                    </Pressable>
                </View>

                {/* 7. APP RUNTIME INFRASTRUCTURE STAMP FOOTER */}
                <View className="items-center mt-8">
                    <Text className="text-slate-300 text-xs font-black uppercase tracking-widest">HouseXpertz Architecture</Text>
                    <Text className="text-slate-400 text-[11px] font-bold mt-0.5">Build Version 1.0.0 (Release-2026.1)</Text>
                </View>

            </ScrollView>
        </View>
    );
}