import { Ionicons } from '@expo/vector-icons';
import { MotiText, MotiView } from 'moti';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

// Component Block Implementations
import CategoryGrid from '../../components/CategoryGrid';
import MegaDeals from '../../components/MegaDeals';
import PromoCarousel from '../../components/PromoCarousel';
import ServiceSpotlight from '../../components/ServiceSpotlight';
import TopBookedSection from '../../components/TopBookedSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

export default function HouseXpertzHome() {
  return (
    <View className="flex-1 bg-slate-50 items-center justify-center">
      {/* Outer Content Constraint Box to enforce perfect alignment and prevent tablet over-stretching */}
      <View className="w-full h-full max-w-3xl bg-slate-50 self-center relative">
        
        {/* 1. FIXED TOP HEADER BAR */}
        <View className="bg-[#0B132B] pt-14 pb-4 px-6 z-10">
          <View className="flex-row justify-between items-center">
            <MotiView from={{ opacity: 0, translateX: -15 }} animate={{ opacity: 1, translateX: 0 }}>
              <Pressable className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10 active:opacity-80">
                <Ionicons name="location" size={14} color="#3B82F6" />
                <Text className="text-white text-xs font-semibold ml-1">Mumbai, India</Text>
                <Ionicons name="chevron-down" size={12} color="white" className="ml-1" />
              </Pressable>
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
        </View>

        {/* SCROLLABLE MAIN CONTENT */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-12">
          
          {/* HERO TITLE & SEARCH BAR WINDOW */}
          <View className="bg-[#0B132B] pb-10 px-6 rounded-b-[40px] shadow-2xl shadow-slate-900/40">
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="text-white text-3xl md:text-4xl font-black tracking-tight mb-6 leading-none pt-2"
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

          {/* 2. CATEGORY BOX GRID */}
          <CategoryGrid />

          {/* 3. MEGA DEALS RUNWAY CAROUSEL */}
          {/* Directly mirrors the premium contextual layout rows right before conversions */}
          <MegaDeals />

          {/* 4. AUTO LOOPING PROMO SLIDER MODULE */}
          <PromoCarousel />

          {/* 5. API REAL-TIME MOST BOOKED SECTION */}
          <TopBookedSection />

          {/* 6. FEATURED LUXURY SPOTLIGHT BANNER */}
          {/* Replicates the prominent conversion cards from your home web ecosystem */}
          <ServiceSpotlight />
          
        </ScrollView>
      </View>
    </View>
  );
}