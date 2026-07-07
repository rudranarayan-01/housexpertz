import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Switch, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    // Local preferences state engine
    const [preferences, setPreferences] = useState({
        pushNotifications: true,
        emailUpdates: false,
        orderTrackingAlerts: true,
        biometricAuth: true,
        locationSync: true,
    });

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

            {/* 1. BRAND THEME HEADER ARC */}
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
                        App Settings
                    </Text>
                </View>
            </View>

            {/* SETTINGS MASTER SCROLL TERMINAL */}
            <ScrollView
                className="flex-1 -mt-4 z-20"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >
                <View
                    className={`max-w-4xl mx-auto w-full px-5 ${isTablet ? 'flex-row flex-wrap gap-x-6 items-start' : 'flex-col'
                        }`}
                >

                    {/* SECTION I: NOTIFICATIONS */}
                    <View style={{ width: isTablet ? '48%' : '100%' }}>
                        <Text className="text-[#0B132B]/50 font-black text-[11px] md:text-xs uppercase tracking-widest ml-2 mt-6 mb-3">
                            Notifications
                        </Text>
                        <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
                            <SettingSwitchRow
                                icon="notifications"
                                iconColor="#2563EB"
                                bgColor="bg-blue-50"
                                title="Push Notifications"
                                subtitle="Receive real-time scheduling status updates"
                                value={preferences.pushNotifications}
                                onToggle={() => togglePreference('pushNotifications')}
                            />
                            <SettingSwitchRow
                                icon="mail"
                                iconColor="#059669"
                                bgColor="bg-emerald-50"
                                title="Email Updates"
                                subtitle="Invoices and structural service summaries"
                                value={preferences.emailUpdates}
                                onToggle={() => togglePreference('emailUpdates')}
                            />
                            <SettingSwitchRow
                                icon="time"
                                iconColor="#D97706"
                                bgColor="bg-amber-50"
                                title="Tracking Alerts"
                                subtitle="Live technician routing pings"
                                value={preferences.orderTrackingAlerts}
                                onToggle={() => togglePreference('orderTrackingAlerts')}
                                isLast
                            />
                        </View>
                    </View>

                    {/* SECTION II: SECURITY & PRIVACY */}
                    <View style={{ width: isTablet ? '48%' : '100%' }}>
                        <Text className="text-[#0B132B]/50 font-black text-[11px] md:text-xs uppercase tracking-widest ml-2 mt-6 mb-3">
                            Security & Privacy
                        </Text>
                        <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
                            <SettingSwitchRow
                                icon="finger-print"
                                iconColor="#6366F1"
                                bgColor="bg-indigo-50"
                                title="Biometric Authentication"
                                subtitle="Secure checkout profile encryption keys"
                                value={preferences.biometricAuth}
                                onToggle={() => togglePreference('biometricAuth')}
                            />
                            <SettingSwitchRow
                                icon="locate"
                                iconColor="#475569"
                                bgColor="bg-slate-100"
                                title="Location Sync"
                                subtitle="Auto-detect closest active regional specialists"
                                value={preferences.locationSync}
                                onToggle={() => togglePreference('locationSync')}
                                isLast
                            />
                        </View>
                    </View>

                    {/* SECTION III: UTILITIES */}
                    <View className="w-full">
                        <Text className="text-[#0B132B]/50 font-black text-[11px] md:text-xs uppercase tracking-widest ml-2 mt-6 mb-3">
                            System Operations
                        </Text>
                        <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
                            <SettingActionRow
                                icon="trash-bin"
                                iconColor="#EF4444"
                                bgColor="bg-red-50"
                                title="Clear Application Cache"
                                subtitle="Removes local system data copies temporary profiles"
                                onPress={() => console.log('Cache Purged Successfully')}
                            />
                            <SettingActionRow
                                icon="cloud-download"
                                iconColor="#7C3AED"
                                bgColor="bg-purple-50"
                                title="Download Backup Archives"
                                subtitle="Export historical billing summaries and metrics data"
                                onPress={() => console.log('Initiating Secure JSON Stream')}
                                isLast
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

// TOGGLE SWITCH ROW COMPONENT
interface SettingSwitchRowProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    bgColor: string;
    title: string;
    subtitle: string;
    value: boolean;
    onToggle: () => void;
    isLast?: boolean;
}

function SettingSwitchRow({ icon, iconColor, bgColor, title, subtitle, value, onToggle, isLast }: SettingSwitchRowProps) {
    return (
        <View className={`flex-row items-center justify-between py-4 px-3 border-b border-slate-100 ${isLast ? 'border-b-0' : ''}`}>
            <View className="flex-row items-center flex-1 pr-4">
                <View className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center`}>
                    <Ionicons name={icon} size={18} color={iconColor} />
                </View>
                <View className="flex-1 ml-4">
                    <Text className="text-[#0B132B] text-sm font-black tracking-tight">{title}</Text>
                    <Text className="text-slate-400 text-[11px] font-semibold mt-0.5 leading-4">{subtitle}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E2E8F0"
            />
        </View>
    );
}

// ACTION BUTTON ROW COMPONENT
interface SettingActionRowProps {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconColor: string;
    bgColor: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    isLast?: boolean;
}

function SettingActionRow({ icon, iconColor, bgColor, title, subtitle, onPress, isLast }: SettingActionRowProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center py-4 px-3 active:bg-slate-50 border-b border-slate-100 ${isLast ? 'border-b-0' : ''}`}
        >
            <View className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center`}>
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>
            <View className="flex-1 ml-4 pr-4">
                <Text className="text-[#0B132B] text-sm font-black tracking-tight">{title}</Text>
                <Text className="text-slate-400 text-[11px] font-semibold mt-0.5 leading-4">{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </Pressable>
    );
}