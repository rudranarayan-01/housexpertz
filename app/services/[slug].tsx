import { BookingService } from '@/services/booking.service';
import { Offer, OffersService } from '@/services/offers.service';
import { useCartStore } from '@/store/cart.store';
import { ServiceVariant } from '@/types/service.types';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

export default function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.cartItems);

  // TanStack Query API Hook
  const { data: service, isLoading: isLoadingService, isError: isServiceError } = useQuery({
    queryKey: ['serviceDetail', slug],
    queryFn: () => BookingService.getServiceDetailsBySlug(slug!),
    enabled: !!slug,
  });

  const { data: offersData } = useQuery({
    queryKey: ['availableOffers'],
    queryFn: OffersService.getAvailableOffers,
  });

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Auto-select first variant on dynamic response load (e.g., "Party Makeup" first)
  useEffect(() => {
    if (service?.variants && service.variants.length > 0) {
      const exists = service.variants.some(v => v._id === selectedVariantId);
      if (!selectedVariantId || !exists) {
        setSelectedVariantId(service.variants[0]._id);
      }
    } else {
      setSelectedVariantId(null);
    }
  }, [service]);

  // Safely select the active variant object
  const selectedVariant = useMemo(() => {
    if (!service?.variants) return null;
    return service.variants.find(v => v._id === selectedVariantId) || null;
  }, [service, selectedVariantId]);

  // Active Sale Price (e.g., ₹3000)
  const activePrice = useMemo(() => {
    if (!service) return 0;
    if (service.pricingType === 'variant' && service.variants && service.variants.length > 0) {
      return selectedVariant ? selectedVariant.price : (service.basePrice || service.price || 0);
    }
    return service.price !== undefined ? service.price : (service.basePrice || 0);
  }, [service, selectedVariant]);

  // Original Crossed Price Reference (e.g., ₹5000 base price crossed out if variant is cheaper)
  const originalCrossedPrice = useMemo(() => {
    if (!service) return null;
    const base = service.basePrice || service.price || 0;
    if (activePrice < base) {
      return base;
    }
    return null;
  }, [service, activePrice]);

  const isAlreadyInCart = useMemo(() => {
    if (!service) return false;
    return cartItems.some(
      (item) => item.id === service._id && item.variantTitle === (selectedVariant?.title || null)
    );
  }, [cartItems, service, selectedVariant]);

  const handleAddToCart = () => {
    if (!service) return;

    if (isAlreadyInCart) {
      router.push('/(tabs)/cart');
      return;
    }

    const cartPayload = {
      id: service._id,
      name: service.name,
      variantTitle: selectedVariant?.title || null,
      price: activePrice,
      image: service.image,
      category: service.category?.name || 'General'
    };

    addItem(cartPayload);
    console.log('Successfully added payload to store:', cartPayload);
  };

  if (isLoadingService) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (isServiceError || !service) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" animated />

      <View className="w-full h-full bg-slate-50 relative">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-44"
        >
          {/* 1. HERO COVER ART CONTAINER */}
          <View style={{ height: IS_TABLET ? 440 : 288 }} className="relative w-full bg-slate-900">
            <Image
              source={{ uri: service.image }}
              className="w-full h-full opacity-90"
              resizeMode="cover"
            />

            {/* BACK BUTTON AND FLOATING CATEGORY TAG OVERLAY */}
            <View className="absolute top-14 left-0 right-0 z-30 px-5 md:px-12">
              <View className="max-w-7xl mx-auto w-full flex-row justify-between items-center">
                <Pressable
                  onPress={() => router.back()}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full items-center justify-center shadow-md shadow-black/10 active:scale-95"
                >
                  <Ionicons name="chevron-back" size={20} color="#0B132B" />
                </Pressable>

                {service.category?.name && (
                  <View className="bg-[#0B132B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                      {service.category.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 2. DYNAMIC CONTENT CARD */}
          <View className="max-w-7xl mx-auto w-full md:px-6 -mt-6 z-10">

            {/* TITLE, STATS & SPECIFICATION META */}
            <View className="bg-white px-5 md:px-8 pt-6 pb-6 rounded-t-[32px] md:rounded-b-[32px] border-b border-slate-100 shadow-sm">
              <Text className="text-[#0B132B] text-2xl md:text-4xl font-black tracking-tight leading-none">
                {service.name}
              </Text>

              <View className="flex-row items-center mt-4 flex-wrap gap-2">
                <View className="flex-row items-center bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl">
                  <FontAwesome6 name="star" size={11} color="#D97706" solid />
                  <Text className="text-amber-700 text-xs font-black ml-1.5">{service.rating || '4.8'}</Text>
                </View>

                {service.duration && (
                  <View className="flex-row items-center bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                    <Ionicons name="time-outline" size={13} color="#2563EB" />
                    <Text className="text-blue-700 text-xs font-bold ml-1">{service.duration}</Text>
                  </View>
                )}

                <View className="flex-row items-center bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                  <FontAwesome6 name="shield-halved" size={11} color="#059669" />
                  <Text className="text-emerald-700 text-[11px] font-bold ml-1">HouseXpertz Verified</Text>
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-2">
                  About Service
                </Text>
                <Text className="text-slate-500 text-sm md:text-base font-medium leading-6">
                  {service.description}
                </Text>
              </View>
            </View>

            {/* 3. OFFERS SECTION */}
            {offersData?.offers && offersData.offers.length > 0 && (
              <View className="bg-white px-5 md:px-8 py-6 mt-4 md:rounded-3xl border-y md:border border-slate-100 shadow-sm">
                <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-3">
                  Available Offers
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pr-5">
                  {offersData.offers.map((offer: Offer) => (
                    <View
                      key={offer._id}
                      className="w-64 bg-emerald-50/60 border border-dashed border-emerald-300 rounded-2xl p-4 mr-3 justify-between"
                    >
                      <View>
                        <View className="flex-row items-center mb-1">
                          <FontAwesome6 name="ticket" size={12} color="#059669" />
                          <View className="bg-emerald-600 px-2 py-0.5 rounded-md ml-2">
                            <Text className="text-white text-[10px] font-black tracking-wide">{offer.code}</Text>
                          </View>
                        </View>
                        <Text className="text-slate-600 text-[11px] font-medium leading-4 mt-1" numberOfLines={2}>
                          {offer.description}
                        </Text>
                      </View>
                      <Text className="text-emerald-800 text-[10px] font-black uppercase tracking-tight mt-3">
                        Min. Order: ₹{offer.minOrderAmount}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* 4. CHOOSE PACKAGE VARIANT (Aligned with Web UI Specifications) */}
            {service.pricingType === 'variant' && service.variants && service.variants.length > 0 && (
              <View className="bg-white px-5 md:px-8 py-6 mt-4 md:rounded-3xl border-y md:border border-slate-100 shadow-sm">
                <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-3">
                  Choose Package Variant
                </Text>

                {service.variants.map((v: ServiceVariant) => {
                  const isSelected = selectedVariantId === v._id;
                  return (
                    <Pressable
                      key={v._id}
                      onPress={() => setSelectedVariantId(v._id)}
                      className={`flex-row items-start justify-between p-4 mb-3 rounded-2xl border transition-all ${
                        isSelected ? 'bg-blue-50/10 border-blue-600' : 'bg-white border-slate-200/60'
                      }`}
                    >
                      {/* Left: Indicator, Title, Custom Sub-Label & Inclusions */}
                      <View className="flex-row items-start flex-1 pr-4">
                        <View className={`w-5 h-5 rounded-full border items-center justify-center mr-3 mt-0.5 ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text className={`text-sm md:text-base font-black tracking-tight uppercase ${
                              isSelected ? 'text-blue-900' : 'text-[#0B132B]'
                            }`}>
                              {v.title}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark-circle" size={14} color="#2563EB" className="ml-1.5" />
                            )}
                          </View>
                          
                          {/* Web-Style Descriptions & Meta Badges */}
                          <Text className="text-slate-400 text-xs font-semibold mt-1">
                            Professional {v.title} services tailored for your home needs.
                          </Text>
                          
                          <View className="flex-row items-center mt-2 flex-wrap gap-2">
                            <View className="flex-row items-center bg-slate-100 px-2 py-0.5 rounded-md">
                              <Ionicons name="time-outline" size={10} color="#64748B" />
                              <Text className="text-slate-500 text-[10px] font-bold ml-1">
                                {service.duration || '3 HOUR'}
                              </Text>
                            </View>
                            <View className="flex-row items-center bg-blue-50 px-2 py-0.5 rounded-md">
                              <Ionicons name="information-circle-outline" size={10} color="#2563EB" />
                              <Text className="text-blue-600 text-[10px] font-black ml-1 uppercase">
                                Standard Inclusions
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Right: Explicit Pricing Display */}
                      <View className="items-end">
                        <Text className={`text-base md:text-lg font-black ${
                          isSelected ? 'text-blue-600' : 'text-[#0B132B]'
                        }`}>
                          ₹{v.price}
                        </Text>
                        <Text className="text-slate-400 text-[9px] font-bold uppercase mt-0.5">
                          Tax Incl.
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* 5. BRAND GUARANTEES */}
            <View className="px-5 md:px-8 py-6 mt-4 bg-white md:rounded-3xl border-y md:border border-slate-100 shadow-sm">
              <Text className="text-[#0B132B] font-black text-sm uppercase tracking-wider mb-4">
                HouseXpertz Guarantee
              </Text>
              <View className="flex-row items-start mb-4">
                <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mt-0.5">
                  <FontAwesome6 name="user-shield" size={12} color="#64748B" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-[#0B132B] text-xs md:text-sm font-black">Background Checked Professionals</Text>
                  <Text className="text-slate-400 text-[11px] md:text-xs mt-0.5">Every expert is thoroughly vetted and certified for secure, elite standard setups.</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mt-0.5">
                  <FontAwesome6 name="arrow-rotate-left" size={12} color="#64748B" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-[#0B132B] text-xs md:text-sm font-black">No Questions Asked Re-work</Text>
                  <Text className="text-slate-400 text-[11px] md:text-xs mt-0.5">Not fully satisfied? We assign dedicated support personnel to redo the scope free of cost.</Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* 6. FIXED TRANSACTION BAR WITH BOTH ACTIVE & ORIGINAL CROSSED PRICES */}
        <MotiView
          from={{ translateY: 120 }}
          animate={{ translateY: 0 }}
          style={{
            paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24,
          }}
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 md:px-12 pt-4 z-20 shadow-2xl"
        >
          <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                {selectedVariant ? `Selected: ${selectedVariant.title}` : 'Price'}
              </Text>
              
              <View className="flex-row items-baseline mt-0.5 flex-wrap">
                {/* Sale Price */}
                <Text className="text-[#0B132B] text-2xl md:text-3xl font-black">
                  ₹{activePrice}
                </Text>
                
                {/* Crossed-out Original Reference Price */}
                {originalCrossedPrice !== null && (
                  <Text className="text-slate-300 text-sm font-bold line-through ml-2">
                    ₹{originalCrossedPrice}
                  </Text>
                )}
                
                {service.unitName && (
                  <Text className="text-slate-400 text-xs font-bold ml-1">
                    /{service.unitName}
                  </Text>
                )}
              </View>
            </View>

            <Pressable
              onPress={handleAddToCart}
              className={`h-14 rounded-2xl px-6 flex-row items-center justify-center shadow-lg flex-1 max-w-xs ml-4 active:scale-95 transition-all ${
                isAlreadyInCart ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-[#0B132B]'
              }`}
            >
              <Text className="text-white font-black text-sm md:text-base tracking-tight mr-2">
                {isAlreadyInCart ? 'Go to Cart' : 'Add to Cart'}
              </Text>
              <Ionicons name={isAlreadyInCart ? "arrow-forward" : "cart"} size={18} color="white" />
            </Pressable>
          </View>
        </MotiView>

      </View>
    </View>
  );
}