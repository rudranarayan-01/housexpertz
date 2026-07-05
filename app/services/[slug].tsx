import { BookingService, ServiceVariant } from '@/services/booking.service';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  console.log('Navigated to service detail page for slug:', slug);

  // Fetch the remote database entry matching this resource identity
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['serviceDetail', slug],
    queryFn: () => BookingService.getServiceDetailsBySlug(slug!),
    enabled: !!slug,
  });

  // Track the variant user selection state
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Fallback to select the first variant automatically if available
  useMemo(() => {
    if (service?.variants && service.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(service.variants[0]._id);
    }
  }, [service, selectedVariantId]);

  // Derive target configuration based on execution metrics
  const activePrice = useMemo(() => {
    if (!service) return 0;
    if (service.pricingType === 'variant' && service.variants) {
      const active = service.variants.find(v => v._id === selectedVariantId);
      return active ? active.price : service.basePrice;
    }
    return service.price || service.basePrice;
  }, [service, selectedVariantId]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (isError || !service) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-[#0B132B] font-bold text-base mt-4">Service Information Unavailable</Text>
        <Pressable onPress={() => router.back()} className="mt-4 bg-slate-100 px-4 py-2 rounded-xl">
          <Text className="text-slate-600 font-bold text-xs">Navigate Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      
      {/* SCROLLABLE PANEL SYSTEM */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        
        {/* HERO IMAGE BANNER & BACK NAVIGATION */}
        <View className="relative w-full h-72 bg-slate-900">
          <Image 
            source={{ uri: service.image }} 
            className="w-full h-full opacity-90"
            resizeMode="cover" 
          />
          
          {/* Header Action Row Floating */}
          <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center">
            <Pressable 
              onPress={() => router.back()} 
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full items-center justify-center shadow-md shadow-black/10"
            >
              <Ionicons name="chevron-back" size={20} color="#0B132B" />
            </Pressable>
            
            <View className="bg-[#0B132B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                {service.category?.name || 'Service'}
              </Text>
            </View>
          </View>
        </View>

        {/* DETAILS OVERLAY MAIN BLOCK */}
        <View className="bg-white px-5 pt-6 pb-6 rounded-t-[32px] -mt-6 border-b border-slate-100">
          
          <Text className="text-[#0B132B] text-2xl font-black tracking-tight leading-8">
            {service.name}
          </Text>

          {/* METRIC BADGES CLUSTER */}
          <View className="flex-row items-center mt-3 flex-wrap">
            <View className="flex-row items-center bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl mr-3">
              <FontAwesome6 name="star" size={11} color="#D97706" solid />
              <Text className="text-amber-700 text-xs font-black ml-1.5">{service.rating || '4.8'}</Text>
            </View>

            {service.duration && (
              <View className="flex-row items-center bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl mr-3">
                <Ionicons name="time-outline" size={13} color="#2563EB" />
                <Text className="text-blue-700 text-xs font-bold ml-1">{service.duration}</Text>
              </View>
            )}

            <View className="flex-row items-center bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
              <FontAwesome6 name="shield-check" size={11} color="#059669" />
              <Text className="text-emerald-700 text-[11px] font-bold ml-1">HouseXpertz Verified</Text>
            </View>
          </View>

          {/* DESCRIPTION COMPONENT */}
          <View className="mt-6">
            <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-2">
              About Service
            </Text>
            <Text className="text-slate-500 text-sm font-medium leading-6">
              {service.description}
            </Text>
          </View>
        </View>

        {/* DYNAMIC VARIANT VARIATIONS SECTION */}
        {service.pricingType === 'variant' && service.variants && service.variants.length > 0 && (
          <View className="bg-white px-5 py-6 mt-3 border-y border-slate-100">
            <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-3">
              Select Package Option
            </Text>
            
            {service.variants.map((v: ServiceVariant) => {
              const isSelected = selectedVariantId === v._id;
              return (
                <Pressable
                  key={v._id}
                  onPress={() => setSelectedVariantId(v._id)}
                  className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border transition-all ${
                    isSelected ? 'bg-blue-50/50 border-blue-500' : 'bg-slate-50 border-slate-200/60'
                  }`}
                >
                  <View className="flex-row items-center flex-1 pr-4">
                    <View className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Text className={`text-sm font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-[#0B132B]'}`}>
                      {v.title}
                    </Text>
                  </View>
                  <Text className={`text-base font-black ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                    ₹{v.price}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ASSURANCE PROMISE MATRICES */}
        <View className="px-5 py-6 mt-3 bg-white border-y border-slate-100">
          <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-4">
            HouseXpertz Guarantee
          </Text>
          <View className="flex-row items-start mb-4">
            <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mt-0.5">
              <FontAwesome6 name="user-shield" size={12} color="#64748B" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-[#0B132B] text-xs font-black">Background Checked Professionals</Text>
              <Text className="text-slate-400 text-[11px] mt-0.5">Every expert is thoroughly vetted and certified for secure, elite standard setups.</Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mt-0.5">
              <FontAwesome6 name="arrow-rotate-left" size={12} color="#64748B" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-[#0B132B] text-xs font-black">No Questions Asked Re-work</Text>
              <Text className="text-slate-400 text-[11px] mt-0.5">Not fully satisfied? We assign dedicated support personnel to redo the scope free of cost.</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* FIXED BOTTOM ACTION SHEET */}
      <MotiView 
        from={{ translateY: 100 }}
        animate={{ translateY: 0 }}
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 pt-4 pb-8 flex-row items-center justify-between shadow-2xl shadow-black/30 z-20"
      >
        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Booking Price</Text>
          <View className="flex-row items-baseline mt-0.5">
            <Text className="text-[#0B132B] text-2xl font-black">₹{activePrice}</Text>
            {service.unitName && (
              <Text className="text-slate-400 text-xs font-bold ml-1">/{service.unitName}</Text>
            )}
          </View>
        </View>

        <Pressable 
          onPress={() => console.log('Proceeding with transaction package configuration...')}
          className="bg-blue-600 active:bg-blue-700 h-14 rounded-2xl px-8 flex-row items-center justify-center shadow-lg shadow-blue-600/20"
          style={{ width: SCREEN_WIDTH * 0.52 }}
        >
          <Text className="text-white font-black text-sm tracking-tight mr-2">Book Service</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </Pressable>
      </MotiView>

    </View>
  );
}