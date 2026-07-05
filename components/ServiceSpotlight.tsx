import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function ServiceSpotlight() {
    const router = useRouter();

    return (
        <View className="px-5 my-4">
            <Pressable
                onPress={() => router.push('/services/home-renovation' as any)}
                className="w-full bg-orange-50/50 border border-orange-100 rounded-[32px] p-5 flex-row items-center justify-between shadow-sm shadow-orange-900/5 active:scale-[0.99]"
            >
                <View className="flex-1 pr-4">
                    <Text className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-1">
                        Premium Luxury
                    </Text>
                    <Text className="text-[#0B132B] text-xl font-black tracking-tight leading-6">
                        Professional Chefs at Your Doorstep
                    </Text>
                    <Text className="text-slate-500 text-xs font-medium mt-1.5 leading-4">
                        Curated custom dining menus, live multi-cuisine preparations & clean execution.
                    </Text>

                    <View className="flex-row items-center mt-4 bg-orange-600 self-start px-4 py-2 rounded-xl shadow-md shadow-orange-600/10">
                        <Text className="text-white font-black text-xs mr-1.5">Book Artist</Text>
                        <Ionicons name="sparkles" size={12} color="white" />
                    </View>
                </View>

                <View className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            </Pressable>
        </View>
    );
}