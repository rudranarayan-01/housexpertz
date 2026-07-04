import { Ionicons } from '@expo/vector-icons';
import { MotiText, MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

// Component Block Implementations
import CategoryGrid from '../../components/CategoryGrid';
import PromoCarousel from '../../components/PromoCarousel';

const TRENDING_CARDS = [
  {
    id: 't1',
    tag: 'MOST BOOKED',
    title: 'AC Revive & Deep Service',
    subtitle: 'Includes performance analysis + filter wash',
    pricing: 'Starts at ₹449',
    rating: '4.9 (12k)',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500',
  },
  {
    id: 't2',
    tag: 'PREMIUM LUXE',
    title: 'Full Home Deep Cleaning',
    subtitle: 'High-pressure mechanized sanitization',
    pricing: 'Save ₹500 today',
    rating: '4.8 (8k)',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500',
  }
];

export default function HouseXpertzHome() {
  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>

      {/* 1. TOP PREMIUM HEADER BAR & SEARCH WINDOW */}
      <View className="bg-[#0B132B] pt-14 pb-8 px-6 rounded-b-[40px] shadow-2xl shadow-slate-900/40">
        <View className="flex-row justify-between items-center mb-6">
          <MotiView from={{ opacity: 0, translateX: -15 }} animate={{ opacity: 1, translateX: 0 }}>
            <View className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Ionicons name="location" size={14} color="#3B82F6" />
              <Text className="text-white text-xs font-semibold ml-1">Mumbai, India</Text>
              <Ionicons name="chevron-down" size={12} color="white" className="ml-1" />
            </View>
          </MotiView>

          <View className="flex-row gap-x-2">
            <Pressable className="bg-white/10 p-2.5 rounded-xl border border-white/10 active:scale-95">
              <Ionicons name="wallet-outline" size={20} color="white" />
            </Pressable>
            <Pressable className="bg-white/10 p-2.5 rounded-xl border border-white/10 active:scale-95">
              <Ionicons name="notifications-outline" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="text-white text-3xl font-black tracking-tight mb-6 leading-none"
        >
          Your Premium{"\n"}
          <Text className="text-blue-500">HouseXpert</Text> Is Ready
        </MotiText>

        <View className="flex-row items-center bg-slate-900/50 border border-white/10 h-14 rounded-2xl px-4">
          <Ionicons name="search-sharp" size={20} color="#94A3B8" />
          <TextInput
            placeholder="What helper do you need today?"
            placeholderTextColor="#64748B"
            className="flex-1 ml-3 font-semibold text-white text-sm"
          />
          <Pressable className="bg-blue-600 p-2 rounded-xl active:scale-95">
            <Ionicons name="options-outline" size={16} color="white" />
          </Pressable>
        </View>
      </View>

      {/* 2. CATEGORY BOX SECTION */}
      <CategoryGrid />

      {/* 3. AUTO LOOPING PROMO SLIDER MODULE */}
      <PromoCarousel />

      {/* 4. HORIZONTAL TRENDING LIST SECTION */}
      <View className="mt-8 mb-12">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <View>
            <Text className="text-xl font-black text-[#0B132B] tracking-tight">Trending Services</Text>
            <Text className="text-slate-400 text-xs font-semibold mt-0.5">Top picks by homeowners this week</Text>
          </View>
          <Pressable className="bg-blue-50 px-3 py-1.5 rounded-full active:opacity-70">
            <Text className="text-blue-600 font-bold text-xs">View All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="pl-6 pr-2"
        >
          {TRENDING_CARDS.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 150 }}
              className="bg-white w-72 rounded-[30px] p-4 mr-4 shadow-md shadow-slate-200/60 border border-slate-100"
            >
              <Image source={{ uri: item.image }} className="w-full h-40 rounded-2xl mb-3" resizeMode="cover" />

              <View className="flex-row justify-between items-center">
                <Text className="text-blue-600 font-extrabold text-[10px] uppercase tracking-widest">{item.tag}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text className="text-slate-700 text-xs font-bold ml-1">{item.rating}</Text>
                </View>
              </View>

              <Text className="text-slate-900 font-black text-base mt-1 tracking-tight" numberOfLines={1}>{item.title}</Text>
              <Text className="text-slate-400 text-xs font-medium mt-0.5" numberOfLines={1}>{item.subtitle}</Text>

              <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-50">
                <Text className="text-slate-900 font-extrabold text-sm">{item.pricing}</Text>
                <Pressable className="bg-[#0B132B] px-3 py-2 rounded-xl active:bg-blue-600">
                  <Text className="text-white font-bold text-xs">Book Now</Text>
                </Pressable>
              </View>
            </MotiView>
          ))}
        </ScrollView>
      </View>

    </ScrollView>
  );
}