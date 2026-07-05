import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';

// Refactored array mirroring Urban Company workflow routes
const PROFILE_OPTIONS = [
  { 
    icon: 'person-outline', 
    title: 'Edit Account Profile', 
    sub: 'Manage numbers & primary addresses',
    route: '/profile/edit' 
  },
  { 
    icon: 'wallet-outline', 
    title: 'HouseXpertz Wallet', 
    sub: 'Manage payment methods, history & cashbacks',
    route: '/wallet' 
  },
  { 
    icon: 'settings-outline', 
    title: 'App Settings', 
    sub: 'Notifications, theme settings, privacy & terms',
    route: '/settings' 
  },
  { 
    icon: 'help-circle-outline', 
    title: 'Customer Help Desk', 
    sub: '24/7 direct operator assistance channels',
    route: '/help' 
  }
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out of HouseXpertz?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      
      {/* Profile Header Block */}
      <View className="bg-[#0B132B] pt-14 pb-12 px-6 rounded-b-[40px] items-center relative shadow-lg">
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full border-4 border-blue-500/30 overflow-hidden mb-4 shadow-md shadow-black/40"
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400' }} 
            className="w-full h-full"
          />
        </MotiView>

        <Text className="text-white text-xl font-black tracking-tight">Karan Sharma</Text>
        <Text className="text-blue-400 text-xs font-bold mt-0.5">+91 98765 43210</Text>

        <View className="bg-blue-600/10 border border-blue-500/20 px-4 py-1.5 rounded-full mt-4 flex-row items-center">
          <Ionicons name="ribbon" size={14} color="#3B82F6" />
          <Text className="text-blue-400 text-[11px] font-black tracking-wide uppercase ml-1.5">Premium Member</Text>
        </View>
      </View>

      {/* Profile Inset Items Settings Menu Grid List */}
      <View className="px-6 -mt-4 mb-12">
        <MotiView 
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="bg-white rounded-[32px] p-5 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          {PROFILE_OPTIONS.map((opt, idx) => (
            <Pressable 
              key={idx} 
              onPress={() => router.push(opt.route as any)}
              className={`flex-row items-center justify-between py-4 ${idx !== PROFILE_OPTIONS.length - 1 ? 'border-b border-slate-50' : ''} active:opacity-60`}
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-3.5 border border-slate-100">
                  <Ionicons name={opt.icon as any} size={20} color="#0B132B" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 text-sm font-black tracking-tight">{opt.title}</Text>
                  <Text className="text-slate-400 text-[11px] font-medium mt-0.5" numberOfLines={1}>{opt.sub}</Text>
                </View>
              </View>
              
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </Pressable>
          ))}
        </MotiView>

        {/* Premium Logout Utility Box */}
        <Pressable 
          onPress={handleLogout}
          className="mt-6 bg-red-50 border border-red-100 rounded-2xl py-4 flex-row items-center justify-center active:scale-[0.99]"
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text className="text-red-600 font-extrabold text-sm ml-2">Sign Out Account</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}