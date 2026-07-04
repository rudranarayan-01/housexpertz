import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const EXPLORE_DATA = [
    {
        id: 'cat1',
        name: 'Appliance Care',
        icon: 'screwdriver-wrench',
        subCategories: [
            { name: 'Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300' },
            { name: 'Refrigerator', image: 'https://images.unsplash.com/photo-1571175452281-04284b979505?q=80&w=300' },
            { name: 'Microwave Repair', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=300' },
            { name: 'AC Air Service', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300' },
        ]
    },
    {
        id: 'cat2',
        name: 'Deep Cleaning',
        icon: 'wand-magic-sparkles',
        subCategories: [
            { name: 'Full Home Clean', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300' },
            { name: 'Sofa & Carpet', image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=300' },
            { name: 'Kitchen Sparkle', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=300' },
            { name: 'Bathroom Sanitize', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300' },
        ]
    },
    {
        id: 'cat3',
        name: 'Chef & Culinary',
        icon: 'bowl-food',
        subCategories: [
            { name: 'Party Live Cook', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300' },
            { name: 'Daily Meal Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=300' },
        ]
    },
    {
        id: 'cat4',
        name: 'Home Repairs',
        icon: 'faucet-drip',
        subCategories: [
            { name: 'Expert Plumbing', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300' },
            { name: 'Electrical Fix', image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=300' },
            { name: 'Woodwork/Carpentry', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=300' },
        ]
    }
];

export default function ExploreScreen() {
    const [selectedId, setSelectedId] = useState(EXPLORE_DATA[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    // 1. FAST RENDERING: Memoize selections to bypass unnecessary render computations on click
    const currentCategory = useMemo(() => {
        return EXPLORE_DATA.find(cat => cat.id === selectedId) || EXPLORE_DATA[0];
    }, [selectedId]);

    return (
        <View className="flex-1 bg-white">

            {/* HEADER SEARCH BAR BLOCK */}
            <View className="bg-[#0B132B] pt-14 pb-5 px-5 rounded-b-[36px] shadow-xl shadow-slate-900/20">
                <View className="flex-row items-center bg-white/10 border border-white/15 h-12 rounded-2xl px-4">
                    <Ionicons name="search-sharp" size={18} color="#94A3B8" />
                    <TextInput
                        placeholder="Search within all services..."
                        placeholderTextColor="#64748B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 font-semibold text-white text-xs"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={16} color="#94A3B8" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* TWO-COLUMN EXPLORE MATRIX */}
            <View className="flex-1 flex-row">

                {/* LEFT COLUMN: Main List */}
                <View className="w-24 bg-slate-50 border-r border-slate-100">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="py-4">
                        {EXPLORE_DATA.map((category) => {
                            const isSelected = selectedId === category.id;
                            return (
                                <Pressable
                                    key={category.id}
                                    onPress={() => setSelectedId(category.id)}
                                    className={`items-center justify-center py-4 px-1 mb-2 relative rounded-l-2xl ${isSelected ? 'bg-white' : ''}`}
                                >
                                    {/* Premium indicator marker */}
                                    {isSelected && (
                                        <MotiView
                                            from={{ opacity: 0, scaleY: 0.3 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"
                                        />
                                    )}

                                    <View className={`w-11 h-11 rounded-xl items-center justify-center mb-1.5 ${isSelected ? 'bg-blue-50' : 'bg-slate-200/30'}`}>
                                        <FontAwesome6 name={category.icon} size={16} color={isSelected ? '#2563EB' : '#64748B'} />
                                    </View>
                                    <Text
                                        className={`text-[10px] text-center font-bold tracking-tight px-1 ${isSelected ? 'text-[#0B132B]' : 'text-slate-400'}`}
                                        numberOfLines={2}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* RIGHT COLUMN: Grid Display */}
                <View className="flex-1 bg-white px-4 pt-5">
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        {currentCategory.name} Catalog
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* AnimatePresence prevents structural snapping when changing menu groups */}
                        <AnimatePresence exitBeforeEnter>
                            <MotiView
                                key={selectedId}
                                from={{ opacity: 0, translateY: 8 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0, translateY: -8 }}
                                transition={{ type: 'timing', duration: 200 }}
                                className="flex-row flex-wrap justify-between pb-12"
                            >
                                {currentCategory.subCategories.map((sub) => (
                                    <Pressable
                                        key={sub.name}
                                        className="w-[48%] bg-white rounded-3xl p-2.5 mb-4 border border-slate-100 shadow-sm shadow-slate-100/50 items-center active:scale-[0.98]"
                                    >
                                        <View className="w-full h-24 rounded-2xl overflow-hidden bg-slate-100 mb-2">
                                            <Image
                                                source={{ uri: sub.image }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>

                                        <Text className="text-[#0B132B] text-xs font-black text-center tracking-tight px-0.5" numberOfLines={1}>
                                            {sub.name}
                                        </Text>

                                        <View className="bg-blue-50 px-3 py-1 rounded-full mt-2 border border-blue-100/30">
                                            <Text className="text-blue-600 text-[9px] font-black uppercase tracking-wide">Explore</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </MotiView>
                        </AnimatePresence>
                    </ScrollView>
                </View>

            </View>

        </View>
    );
}