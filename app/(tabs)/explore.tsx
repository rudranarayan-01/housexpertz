import { BookingService, CategoryStat, SubService } from '@/services/booking.service';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

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
    staleTime: 1000 * 60 * 10,
  });

  // 2. CLIENT-SIDE SORTING
  const sortedCategories = useMemo(() => {
    if (!rawCategories) return [];
    return [...rawCategories].sort((a, b) => b.count - a.count);
  }, [rawCategories]);

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

  // 4. SEARCH FILTER ENGINE
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
        <Text className="text-slate-400 text-xs text-center mt-1">Please verify your connectivity parameters and retry.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="w-full h-full bg-slate-50 relative flex-1">
        
        {/* HEADER SEARCH BAR BLOCK */}
        <View className="bg-[#0B132B] pt-14 pb-5 px-5 md:px-12 rounded-b-[36px] shadow-xl shadow-slate-900/20 z-10">
          <View className="max-w-7xl mx-auto w-full">
            <View className="flex-row items-center bg-white/10 border border-white/15 h-12 rounded-2xl px-4 max-w-2xl">
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
        </View>

        {/* TWO-COLUMN MATRIX FRAMEWORK */}
        <View className="flex-1 max-w-7xl w-full mx-auto flex-row">

          {/* LEFT SIDEBAR: Navigation Hub */}
          <View className="w-24 md:w-32 bg-slate-50 border-r border-slate-100">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="py-4">
              {sortedCategories.map((category: CategoryStat) => {
                const isSelected = selectedSlug === category.slug;
                return (
                  <Pressable
                    key={category._id}
                    onPress={() => {
                      setSelectedSlug(category.slug);
                      setSearchQuery('');
                    }}
                    className={`items-center justify-center py-4 px-1 mb-1 relative ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                  >
                    {isSelected && (
                      <MotiView
                        from={{ opacity: 0, scaleY: 0.3 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"
                      />
                    )}

                    <View className={`w-11 h-11 rounded-xl items-center justify-center mb-1.5 ${isSelected ? 'bg-blue-50' : 'bg-slate-200/40'}`}>
                      <FontAwesome6 
                        name={getCategoryIcon(category.slug)} 
                        size={16} 
                        color={isSelected ? '#2563EB' : '#64748B'} 
                      />
                    </View>
                    <Text
                      className={`text-[10px] md:text-xs text-center font-bold tracking-tight px-1 ${isSelected ? 'text-[#0B132B]' : 'text-slate-400'}`}
                      numberOfLines={2}
                    >
                      {category.name}
                    </Text>
                    
                    <View className="bg-slate-200/50 px-1.5 py-0.5 rounded-full mt-1">
                      <Text className="text-[8px] text-slate-500 font-bold">{category.count}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* RIGHT SIDEBAR PANEL: Interactive Service Grid */}
          <View className="flex-1 bg-white px-4 md:px-8 pt-5">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 px-1">
              {activeCategoryName}
            </Text>

            {isLoadingServices ? (
              <View className="flex-1 items-center justify-center pb-20">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : (
              <AnimatePresence exitBeforeEnter>
                <MotiView
                  key={selectedSlug}
                  from={{ opacity: 0, translateY: 6 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -6 }}
                  transition={{ type: 'timing', duration: 180 }}
                  className="flex-1"
                >
                  {filteredServices.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-12 px-4">
                      <Ionicons name="search-outline" size={32} color="#CBD5E1" />
                      <Text className="text-slate-400 text-xs font-medium text-center mt-2">
                        No matches found for &quot;{searchQuery}&quot;
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={filteredServices}
                      key={IS_TABLET ? 'tablet-grid' : 'mobile-grid'}
                      numColumns={IS_TABLET ? 3 : 2}
                      showsVerticalScrollIndicator={false}
                      contentContainerClassName="pb-24"
                      columnWrapperClassName="justify-between"
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }: { item: SubService }) => (
                        <Pressable
                          onPress={() => router.push(`/services/${item.slug}`)}
                          className="w-[48.5%] md:w-[31.5%] bg-white rounded-3xl p-2.5 mb-4 border border-slate-100 shadow-sm shadow-slate-100/50 items-center active:scale-[0.98]"
                        >
                          {/* Image Box */}
                          <View className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                            <Image
                              source={{ uri: item.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300' }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>

                          <Text className="text-[#0B132B] text-xs font-black text-center tracking-tight px-0.5" numberOfLines={1}>
                            {item.name}
                          </Text>

                          <Text className="text-slate-500 text-[10px] font-bold mt-0.5">
                            ₹{item.basePrice}{item.pricingType === 'fixed' ? '' : '/hr'}
                          </Text>

                          <View className="bg-blue-50 px-4 py-1.5 rounded-full mt-2.5 border border-blue-100/20 w-full items-center">
                            <Text className="text-blue-600 text-[9px] font-black uppercase tracking-wide">Book</Text>
                          </View>
                        </Pressable>
                      )}
                    />
                  )}
                </MotiView>
              </AnimatePresence>
            )}
          </View>

        </View>
      </View>
    </View>
  );
}