import { BookingService, CategoryStat, SubService } from '@/services/booking.service';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const getCategoryIcon = (slug: string): string => {
  const iconMap: Record<string, string> = {
    'healthcare-at-home': 'user-doctor',
    'personal-grooming': 'scissors',
    'ac-and-cooling-solutions': 'snowflake',
    'electrical-power-systems': 'bolt',
    'hygiene-and-deep-cleaning': 'wand-magic-sparkles',
    'home-renovation': 'hammer',
    'essential-appliance-care': 'screwdriver-wrench',
    'master-plumbing-services': 'faucet-drip',
  };

  // Fallback to a clean generic icon if a new slug doesn't match
  return iconMap[slug] || 'circle-dot';
};

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. FETCH ALL CATEGORIES WITH QUANTITY STATS
  const { 
    data: rawCategories, 
    isLoading: isLoadingCategories, 
    isError: isCategoryError 
  } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: BookingService.getCategoryStats,
    staleTime: 1000 * 60 * 10, // Cache structural stats for 10 minutes
  });

  // 2. CLIENT-SIDE SORTING: Rank categories dynamically by total service frequency count
  const sortedCategories = useMemo(() => {
    if (!rawCategories) return [];
    return [...rawCategories].sort((a, b) => b.count - a.count);
  }, [rawCategories]);

  // Set initial fallback focus once data structural array fields mount
  useEffect(() => {
    if (sortedCategories.length > 0 && !selectedSlug) {
      setSelectedSlug(sortedCategories[0].slug);
    }
  }, [sortedCategories, selectedSlug]);

  // 3. FETCH DETAILED SUB-SERVICES ATTACHED TO CURRENT ACTIVE CATEGORY TAB
  const { 
    data: subServicesData, 
    isLoading: isLoadingServices 
  } = useQuery({
    queryKey: ['categoryServices', selectedSlug],
    queryFn: () => BookingService.getServicesByCategorySlug(selectedSlug),
    enabled: !!selectedSlug,
  });

  // 4. SEARCH FILTER ENGINE: Matches query across active child context entries
  const filteredServices = useMemo(() => {
    const list = subServicesData?.services || [];
    if (!searchQuery.trim()) return list;
    return list.filter((service: SubService) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [subServicesData, searchQuery]);

  const activeCategoryName = useMemo(() => {
    const found = sortedCategories.find(cat => cat.slug === selectedSlug);
    return found ? found.name : 'Catalog';
  }, [sortedCategories, selectedSlug]);

  if (isLoadingCategories) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-slate-400 text-xs font-semibold mt-3">Loading catalog matrices...</Text>
      </View>
    );
  }

  if (isCategoryError || sortedCategories.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="cloud-offline-outline" size={48} color="#94A3B8" />
        <Text className="text-[#0B132B] font-bold text-base mt-4">Failed to Sync Catalog</Text>
        <Text className="text-slate-400 text-xs text-center mt-1">Please verify your data connectivity parameters and retry.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      
      {/* HEADER SEARCH BAR BLOCK (Pinned & Non-scrollable) */}
      <View className="bg-[#0B132B] pt-14 pb-5 px-5 rounded-b-[36px] shadow-xl shadow-slate-900/20 z-10">
        <View className="flex-row items-center bg-white/10 border border-white/15 h-12 rounded-2xl px-4">
          <Ionicons name="search-sharp" size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search within this category..."
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

      {/* TWO-COLUMN MATRIX FRAMEWORK */}
      <View className="flex-1 flex-row">

        {/* LEFT COMPONENT: Fixed Sidebar Category Hub */}
        <View className="w-24 bg-slate-50 border-r border-slate-100">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="py-4">
            {sortedCategories.map((category: CategoryStat) => {
              const isSelected = selectedSlug === category.slug;
              return (
                <Pressable
                  key={category._id}
                  onPress={() => {
                    setSelectedSlug(category.slug);
                    setSearchQuery(''); // Clear text query when jumping groups
                  }}
                  className={`items-center justify-center py-4 px-1 mb-2 relative rounded-l-2xl ${isSelected ? 'bg-white' : ''}`}
                >
                  {isSelected && (
                    <MotiView
                      from={{ opacity: 0, scaleY: 0.3 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"
                    />
                  )}

                  <View className={`w-11 h-11 rounded-xl items-center justify-center mb-1.5 ${isSelected ? 'bg-blue-50' : 'bg-slate-200/30'}`}>
                    <FontAwesome6 
                      name={getCategoryIcon(category.slug)} 
                      size={16} 
                      color={isSelected ? '#2563EB' : '#64748B'} 
                    />
                  </View>
                  <Text
                    className={`text-[10px] text-center font-bold tracking-tight px-1 ${isSelected ? 'text-[#0B132B]' : 'text-slate-400'}`}
                    numberOfLines={2}
                  >
                    {category.name}
                  </Text>
                  
                  {/* Miniature indicator revealing number of platform assets underneath */}
                  <View className="bg-slate-200/50 px-1.5 py-0.5 rounded-full mt-1">
                    <Text className="text-[8px] text-slate-500 font-bold">{category.count}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* RIGHT COMPONENT: Sub-Service Grid Panel */}
        <View className="flex-1 bg-white px-4 pt-5">
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
            {activeCategoryName}
          </Text>

          {isLoadingServices ? (
            <View className="flex-1 items-center justify-center pb-20">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <AnimatePresence exitBeforeEnter>
                <MotiView
                  key={selectedSlug}
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -8 }}
                  transition={{ type: 'timing', duration: 200 }}
                  className="flex-row flex-wrap justify-between pb-12"
                >
                  {filteredServices.length === 0 ? (
                    <View className="w-full items-center justify-center py-12 px-4">
                      <Ionicons name="search-outline" size={32} color="#CBD5E1" />
                      <Text className="text-slate-400 text-xs font-medium text-center mt-2">
                        No matches found for "{searchQuery}"
                      </Text>
                    </View>
                  ) : (
                    filteredServices.map((sub: SubService) => (
                      <Pressable
                        key={sub._id}
                        onPress={() => router.push(`/services/${sub.slug}` as any)}
                        className="w-[48%] bg-white rounded-3xl p-2.5 mb-4 border border-slate-100 shadow-sm shadow-slate-100/50 items-center active:scale-[0.98]"
                      >
                        <View className="w-full h-24 rounded-2xl overflow-hidden bg-slate-100 mb-2">
                          <Image
                            source={{ uri: sub.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300' }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>

                        <Text className="text-[#0B132B] text-xs font-black text-center tracking-tight px-0.5" numberOfLines={1}>
                          {sub.name}
                        </Text>

                        <Text className="text-slate-500 text-[10px] font-bold mt-0.5">
                          ₹{sub.basePrice}{sub.pricingType === 'fixed' ? '' : '/hr'}
                        </Text>

                        <View className="bg-blue-50 px-3 py-1 rounded-full mt-2 border border-blue-100/30">
                          <Text className="text-blue-600 text-[9px] font-black uppercase tracking-wide">Book</Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </MotiView>
              </AnimatePresence>
            </ScrollView>
          )}
        </View>

      </View>
    </View>
  );
}