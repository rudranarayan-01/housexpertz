import { BookingService, TopBookedService } from '@/services/booking.service';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';

export default function TopBookedSection() {
  const router = useRouter();

  const { data: topServices, isLoading, isError } = useQuery({
    queryKey: ['topBookedServices'],
    queryFn: BookingService.getTopBooked,
  });

  if (isLoading) {
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (isError || !topServices || topServices.length === 0) {
    return null; // Gracefully fall back if something goes wrong
  }

  return (
    <View className="mt-8 mb-4">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <View>
          <Text className="text-xl font-black text-[#0B132B] tracking-tight">Most Booked Services</Text>
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
        {topServices.map((item: TopBookedService, index: number) => (
          <MotiView
            key={item._id}
            from={{ opacity: 0, translateX: 30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            className="bg-white w-72 rounded-[30px] p-4 mr-4 shadow-md shadow-slate-200/60 border border-slate-100"
          >
            <View className="w-full h-40 rounded-2xl overflow-hidden mb-3 relative">
              <Image 
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500' }} 
                className="w-full h-full" 
                resizeMode="cover" 
              />
              {item.bookingCount && item.bookingCount > 5 && (
                <View className="absolute top-3 left-3 bg-orange-500 px-2.5 py-1 rounded-full">
                  <Text className="text-white font-black text-[9px] uppercase tracking-wider">TRENDING</Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-blue-600 font-extrabold text-[10px] uppercase tracking-widest">
                {item.pricingType === 'fixed' ? 'FIXED RATE' : 'HOURLY HELP'}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="text-slate-700 text-xs font-bold ml-1">
                  {item.rating?.toFixed(1) || '4.8'}
                </Text>
              </View>
            </View>

            <Text className="text-slate-900 font-black text-base mt-1 tracking-tight" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-slate-400 text-xs font-medium mt-0.5" numberOfLines={1}>
              Popular choice in your neighborhood
            </Text>

            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-50">
              <Text className="text-slate-900 font-extrabold text-sm">
                ₹{item.basePrice}{item.pricingType === 'fixed' ? '' : '/hr'}
              </Text>
              <Pressable 
                onPress={() => router.push(`/services/${item.slug}` as any)}
                className="bg-[#0B132B] px-4 py-2 rounded-xl active:bg-blue-600"
              >
                <Text className="text-white font-bold text-xs">Book Now</Text>
              </Pressable>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}