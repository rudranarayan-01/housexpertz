import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddressItem {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function ManageAddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  // Responsive design metrics
  const isTablet = width >= 768;

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Home' | 'Work' | 'Other'>('All');
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: '1',
      type: 'Home',
      name: 'Primary Residence',
      details: 'Flat 402, Block B, Royal Heights, Infocity Avenue, Bhubaneswar, 751024',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      name: 'HQ Office',
      details: 'Plot 12, Tech Zone, Co-Working Hub, Patia, Bhubaneswar, 751017',
      isDefault: false,
    },
  ]);

  const filteredAddresses = addresses.filter(
    item => selectedFilter === 'All' || item.type === selectedFilter
  );

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(item => item.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev =>
      prev.map(item => ({ ...item, isDefault: item.id === id }))
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Light text matching dark header background */}
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

      {/* 1. PREMIUM THEME ARC BACKGROUND HEADER */}
      <View 
        className="bg-[#0B132B] px-6 rounded-b-[40px] shadow-xl shadow-slate-900/10 z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 36 }}
      >
        <View className="max-w-5xl mx-auto w-full flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center border border-white/10 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>
            <Text className="text-white text-lg md:text-xl font-black ml-4 tracking-tight">
              Saved Addresses
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/profile/add-address')}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md shadow-blue-600/10"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-xs font-black tracking-tight ml-1.5">Add New</Text>
          </Pressable>
        </View>
      </View>

      {/* FILTER CHIPS HUB */}
      <View className="px-5 -mt-5 z-20">
        <View className="max-w-5xl mx-auto w-full flex-row gap-2 flex-wrap bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100">
          {(['All', 'Home', 'Work', 'Other'] as const).map(filter => {
            const isSelected = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  isSelected ? 'bg-[#0B132B]' : 'bg-slate-50 active:bg-slate-100'
                }`}
              >
                <Text 
                  className={`text-xs font-black tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* RESPONSIVE LAYOUT LIST CONTROLLER */}
      <FlatList
        data={filteredAddresses}
        keyExtractor={item => item.id}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingTop: 24, 
          paddingBottom: insets.bottom + 40,
          maxWidth: 1024,
          width: '100%',
          alignSelf: 'center'
        }}
        // Switches dynamically between a single column layout list and an integrated tablet structural grid layout map
        key={isTablet ? 'tablet-grid' : 'mobile-list'}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? { gap: 16, marginBottom: 16 } : null}
        ListEmptyComponent={
          <View className="items-center justify-center pt-24 max-w-sm mx-auto w-full">
            <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mb-4 border border-slate-200/40">
              <Ionicons name="map-outline" size={26} color="#94A3B8" />
            </View>
            <Text className="text-[#0B132B] text-sm font-black tracking-tight text-center">No addresses found</Text>
            <Text className="text-slate-400 text-xs font-medium text-center mt-1.5 leading-5">
              You haven&apos;t saved any locations under this category filter yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View 
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex-row items-start justify-between"
            style={{ 
              flex: isTablet ? 1 : undefined,
              marginBottom: isTablet ? 0 : 12 
            }}
          >
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 flex-wrap">
                <View className="bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md flex-row items-center">
                  <Ionicons 
                    name={item.type === 'Home' ? 'home' : item.type === 'Work' ? 'business' : 'location'} 
                    size={11} 
                    color="#475569" 
                  />
                  <Text className="text-slate-600 text-[9px] font-black ml-1 uppercase tracking-wider">{item.type}</Text>
                </View>
                <Text className="text-[#0B132B] text-sm font-black tracking-tight">{item.name}</Text>
                
                {item.isDefault && (
                  <View className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    <Text className="text-emerald-700 text-[9px] font-bold uppercase tracking-wider">Default</Text>
                  </View>
                )}
              </View>

              <Text className="text-slate-500 text-xs font-medium mt-3 leading-5">
                {item.details}
              </Text>
              
              {/* ACTION FOOTER BAR */}
              <View className="flex-row items-center gap-5 mt-5 pt-4 border-t border-slate-100">
                {!item.isDefault && (
                  <Pressable onPress={() => handleSetDefault(item.id)} className="active:opacity-60">
                    <Text className="text-blue-600 text-xs font-black tracking-tight">Set as Default</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => router.push(`/profile/edit-address?id=${item.id}`)} className="active:opacity-60">
                  <Text className="text-slate-400 text-xs font-bold tracking-tight">Edit Details</Text>
                </Pressable>
              </View>
            </View>

            <Pressable 
              onPress={() => handleDelete(item.id)}
              className="w-9 h-9 rounded-xl bg-red-50 border border-red-100/30 items-center justify-center active:bg-red-100 transition-colors"
            >
              <Ionicons name="trash-outline" size={15} color="#EF4444" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}