import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingSuccessScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Parse structural navigation values dynamically injected from checkout screens
    const { addressType, fullAddress, amountPaid } = useLocalSearchParams<{
        addressType?: string;
        fullAddress?: string;
        amountPaid?: string;
    }>();

    // Dynamic values fallback safeguard
    const localizedAddressType = addressType || 'Selected Address';
    const localizedFullAddress = fullAddress || 'Your Saved Location Profile';
    const localizedAmount = amountPaid || '0';

    // Generate a random mock order sequence ID tracker configuration
    const orderId = React.useMemo(() => {
        return `HX-${Math.floor(100000 + Math.random() * 900000)}`;
    }, []);

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" animated />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pt-12 pb-36 px-6"
            >
                <View className="max-w-md mx-auto w-full items-center">

                    {/* ANIMATED HERO ICON BLOCK */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.4, rotate: '-45deg' }}
                        animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
                        transition={{ type: 'spring', damping: 12, mass: 0.8 }}
                        className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center border border-emerald-100 shadow-sm mt-8 mb-6"
                    >
                        <View className="w-18 h-18 bg-emerald-500 rounded-full items-center justify-center shadow-md shadow-emerald-500/20">
                            <Ionicons name="checkmark" size={38} color="white" />
                        </View>
                    </MotiView>

                    {/* MASTER STATUS STRINGS */}
                    <MotiView
                        from={{ opacity: 0, translateY: 15 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        className="items-center"
                    >
                        <Text className="text-[#0B132B] text-2xl font-black tracking-tight text-center">
                            Booking Confirmed!
                        </Text>
                        <Text className="text-slate-400 text-xs font-semibold text-center mt-1.5 max-w-[280px]">
                            Your elite service request has been registered. We are assigning a top specialist.
                        </Text>
                    </MotiView>

                    {/* STRUCTURAL REFERENCE INFORMATION METRICS CARDS */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 350 }}
                        className="w-full bg-white rounded-3xl border border-slate-100 p-5 shadow-sm mt-8"
                    >
                        {/* TRANSACTION META ID ROW */}
                        <View className="flex-row justify-between items-center pb-3.5 border-b border-slate-100 mb-4">
                            <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Booking ID</Text>
                            <Text className="text-blue-600 font-black text-sm tracking-tight">{orderId}</Text>
                        </View>

                        {/* ASSIGNED ADDRESS DESTINATION */}
                        <View className="flex-row items-start mb-4">
                            <View className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center mt-0.5">
                                <Ionicons
                                    name={localizedAddressType === 'Home' ? 'home-outline' : 'business-outline'}
                                    size={14}
                                    color="#475569"
                                />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Service Location</Text>
                                <Text className="text-[#0B132B] text-xs font-black mt-0.5">{localizedAddressType}</Text>
                                <Text className="text-slate-500 text-xs font-medium mt-0.5 leading-4" numberOfLines={2}>
                                    {localizedFullAddress}
                                </Text>
                            </View>
                        </View>

                        {/* FINALIZED TOTAL AMOUNT TRANSFERRED */}
                        <View className="flex-row items-start">
                            <View className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center mt-0.5">
                                <FontAwesome6 name="wallet" size={12} color="#475569" />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Payment Settled</Text>
                                <Text className="text-[#0B132B] text-base font-black mt-0.5">₹{localizedAmount}</Text>
                            </View>
                        </View>
                    </MotiView>

                    {/* BRAND GUARANTEE ACCENT BANNER TICKERS */}
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 500 }}
                        className="w-full bg-blue-50/40 border border-blue-100 rounded-2xl p-4 mt-4 flex-row items-center"
                    >
                        <Ionicons name="shield-checkmark" size={18} color="#2563EB" />
                        <Text className="text-blue-800 text-[11px] font-bold ml-2.5 flex-1 leading-4">
                            Protected by HouseXpertz Guarantee. Clear scheduling updates will sync via your application terminal dashboard directly.
                        </Text>
                    </MotiView>

                </View>
            </ScrollView>

            {/* FIXED ACTION CONTROL CONTAINER SHEETS */}
            <MotiView
                from={{ translateY: 80 }}
                animate={{ translateY: 0 }}
                style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24 }}
                className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pt-4 z-20 shadow-2xl"
            >
                <View className="max-w-md mx-auto w-full flex-col gap-3">

                    <Pressable
                        onPress={() => {
                            // Redirect to your explicit active orders tracking screen index coordinates
                            router.replace('/(tabs)/bookings');
                        }}
                        className="w-full h-14 bg-blue-600 active:bg-blue-700 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
                    >
                        <Text className="text-white font-black text-sm md:text-base tracking-tight mr-1.5">
                            Track Status
                        </Text>
                        <Ionicons name="time" size={16} color="white" />
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            // Return safely back to standard discovery layouts
                            router.dismissAll();
                            router.replace('/(tabs)');
                        }}
                        className="w-full h-12 bg-slate-50 border border-slate-200/80 rounded-2xl flex-row items-center justify-center active:scale-98 active:bg-slate-100 transition-all"
                    >
                        <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider">
                            Return to Home
                        </Text>
                    </Pressable>

                </View>
            </MotiView>
        </View>
    );
}