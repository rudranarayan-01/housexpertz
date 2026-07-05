import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH >= 768 ? 340 : SCREEN_WIDTH * 0.78;

interface DealItem {
    id: string;
    title: string;
    subtitle: string;
    tag: string;
    bgGradient: string[];
    targetSlug: string;
}

const MOCK_DEALS: DealItem[] = [
    {
        id: '1',
        title: 'AC Service & Repair',
        subtitle: 'Beat the summer heat cleanly',
        tag: 'Upto 30% OFF',
        targetSlug: 'ac-and-cooling-solutions',
        bgGradient: []
    },
    {
        id: '2',
        title: 'Professional Chefs',
        subtitle: 'Elite culinary experiences at home',
        tag: 'Flat ₹500 Cashback',
        targetSlug: 'chef-culinary',
        bgGradient: []
    },
];

export default function MegaDeals() {
    const router = useRouter();

    return (
        <View className="my-6">
            <View className="flex-row justify-between items-center px-5 mb-4">
                <View>
                    <Text className="text-[#0B132B] text-lg font-black tracking-tight">Mega Deals</Text>
                    <Text className="text-slate-400 text-xs font-medium">Limited period premium promotional offers</Text>
                </View>
                <Pressable className="bg-blue-50 px-3 py-1.5 rounded-xl">
                    <Text className="text-blue-600 text-xs font-bold">See All</Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pl-5 pr-2"
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 12}
            >
                {MOCK_DEALS.map((deal) => (
                    <Pressable
                        key={deal.id}
                        onPress={() => router.push(`/services/${deal.targetSlug}` as any)}
                        style={{ width: CARD_WIDTH }}
                        className="h-40 bg-[#0B132B] rounded-[28px] mr-3 overflow-hidden relative p-5 justify-between shadow-md shadow-slate-900/10 active:scale-[0.99]"
                    >
                        <View className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent opacity-60" />

                        <View className="flex-row justify-between items-start z-10">
                            <View className="flex-1 pr-4">
                                <View className="bg-amber-500 self-start px-2.5 py-0.5 rounded-full mb-2">
                                    <Text className="text-white text-[9px] font-black uppercase tracking-wider">{deal.tag}</Text>
                                </View>
                                <Text className="text-white text-lg font-black tracking-tight leading-6" numberOfLines={2}>
                                    {deal.title}
                                </Text>
                                <Text className="text-slate-300 text-[11px] font-medium mt-0.5" numberOfLines={1}>
                                    {deal.subtitle}
                                </Text>
                            </View>

                            <View className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md items-center justify-center border border-white/10">
                                <FontAwesome6 name="bolt" size={14} color="#F59E0B" />
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between z-10 pt-2 border-t border-white/10">
                            <Text className="text-white text-xs font-black">Grab Now</Text>
                            <Ionicons name="arrow-forward-circle" size={24} color="white" />
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}