import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';

const ACTIVE_COUPONS = [
  {
    code: 'XPXPERT500',
    title: 'Flat ₹500 Off',
    subtitle: 'Valid on all Full Home Deep Cleaning services',
    expiry: 'Expires in 3 days',
    color: '#FF5A1F',
    bg: '#FFF7ED',
    border: '#FFEDD5',
  },
  {
    code: 'ACREVIVE20',
    title: '20% Super Saver',
    subtitle: 'Get up to ₹300 off on your summer AC checkups',
    expiry: 'Valid this month',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#DBEAFE',
  }
];

export default function OffersScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      
      {/* Premium Dark Header Block */}
      <View className="bg-[#0B132B] pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg">
        <Text className="text-white text-2xl font-black tracking-tight">Exclusive Deals</Text>
        <Text className="text-slate-400 text-xs font-semibold mt-1">Premium coupon codes & seasonal packages</Text>
      </View>

      <View className="px-6 mt-6 mb-12">
        {/* Seasonal Featured Banner Box */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] overflow-hidden mb-8 h-44 shadow-md shadow-slate-200"
        >
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600' }}
            className="w-full h-full justify-end p-5"
          >
            {/* Dark tint overlay for premium contrast */}
            <View className="absolute inset-0 bg-black/40" />
            
            <View className="z-10">
              <View className="bg-[#FF5A1F] self-start px-2.5 py-0.5 rounded-md mb-1.5">
                <Text className="text-white text-[10px] font-black tracking-widest uppercase">Limited Time</Text>
              </View>
              <Text className="text-white text-xl font-black tracking-tight">Monsoon Home Makeover</Text>
              <Text className="text-slate-200 text-xs font-medium mt-0.5">Get up to 30% off on interior painting & waterproofing</Text>
            </View>
          </ImageBackground>
        </MotiView>

        {/* Interactive Coupons Section */}
        <Text className="text-[#0B132B] text-lg font-black tracking-tight mb-4">Available Coupons</Text>
        
        {ACTIVE_COUPONS.map((coupon, index) => (
          <MotiView
            key={coupon.code}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100 }}
            className="rounded-3xl p-5 mb-5 border flex-row justify-between items-center"
            style={{ backgroundColor: coupon.bg, borderColor: coupon.border }}
          >
            <View className="flex-1 pr-4">
              <Text className="font-black text-xl tracking-tight" style={{ color: coupon.color }}>
                {coupon.title}
              </Text>
              <Text className="text-slate-700 text-xs font-bold mt-1 leading-snug">
                {coupon.subtitle}
              </Text>
              <View className="flex-row items-center mt-3">
                <Ionicons name="time-outline" size={12} color="#64748B" />
                <Text className="text-slate-500 text-[11px] font-semibold ml-1">{coupon.expiry}</Text>
              </View>
            </View>

            {/* Dash Divider Graphic */}
            <View className="border-l border-dashed border-slate-300 h-20 mx-2" />

            {/* Interactive Copy Code Area */}
            <Pressable 
              className="items-center justify-center pl-2 active:scale-95"
              onPress={() => alert(`Code ${coupon.code} copied!`)}
            >
              <View className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <Text className="text-slate-900 font-extrabold text-xs tracking-tight">{coupon.code}</Text>
              </View>
              <Text className="text-slate-400 text-[10px] font-bold mt-1.5 uppercase tracking-wide">Tap to copy</Text>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </ScrollView>
  );
}