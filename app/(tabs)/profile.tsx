import { useAuth, useUser } from '@clerk/clerk-expo';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fallback layout metadata if auth layers are bypassed
  const userMetadata = {
    name: user?.fullName || 'Guest Account',
    email: user?.primaryEmailAddress?.emailAddress || 'Log in to sync schedules',
    avatar: user?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

      {/* 1. HERO IDENTITY BRAND CURVED HEADER LAYER */}
      <View className="bg-[#0B132B] pt-14 pb-12 px-6 rounded-b-[40px] z-10 shadow-lg">
        <View className="max-w-7xl mx-auto w-full flex-row items-center">
          <View className="relative">
            <Image
              source={{ uri: userMetadata.avatar }}
              className="w-18 h-18 rounded-3xl bg-slate-800 border-2 border-white/20"
            />
            <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0B132B] items-center justify-center">
              <View className="w-1.5 h-1.5 bg-white rounded-full" />
            </View>
          </View>

          <View className="flex-1 ml-4 pr-2">
            <Text className="text-white text-xl font-black tracking-tight" numberOfLines={1}>
              {userMetadata.name}
            </Text>
            <Text className="text-slate-400 text-xs font-semibold mt-0.5" numberOfLines={1}>
              {userMetadata.email}
            </Text>
          </View>

          {isSignedIn && (
            <Pressable
              onPress={() => router.push('/profile/edit')}
              className="w-9 h-9 bg-white/10 rounded-xl items-center justify-center border border-white/10 active:scale-95"
            >
              <Ionicons name="create-outline" size={16} color="white" />
            </Pressable>
          )}
        </View>
      </View>

      {/* MAIN LAYOUT BODY */}
      <ScrollView
        className="flex-1 -mt-5 z-20"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-36"
      >
        <View className="max-w-7xl mx-auto w-full px-5">

          {/* QUICK METRICS HIGHLIGHT ROW */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-4 flex-row justify-between items-center shadow-sm border border-slate-100"
          >
            <Pressable
              onPress={() => router.push('/(tabs)/bookings')}
              className="flex-1 items-center py-1 border-r border-slate-100"
            >
              <Text className="text-blue-600 text-lg font-black tracking-tight">3 Active</Text>
              <Text className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">Bookings</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/profile/addresses')}
              className="flex-1 items-center py-1 border-r border-slate-100"
            >
              <Text className="text-[#0B132B] text-lg font-black tracking-tight">2 Saved</Text>
              <Text className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">Addresses</Text>
            </Pressable>

            <View className="flex-1 items-center py-1">
              <Text className="text-emerald-600 text-lg font-black tracking-tight">₹150</Text>
              <Text className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">Wallet Cash</Text>
            </View>
          </MotiView>

          {/* SECTION I: ACCOUNT NAVIGATION GROUPS */}
          <Text className="text-[#0B132B]/60 font-black text-[10px] uppercase tracking-wider ml-2 mt-6 mb-2">
            Account Management
          </Text>

          <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
            <ProfileOptionRow
              icon="calendar-clear"
              iconColor="#2563EB"
              bgColor="bg-blue-50"
              title="My Bookings"
              subtitle="Track schedules and download invoices"
              onPress={() => router.push('/(tabs)/bookings')}
            />
            <ProfileOptionRow
              icon="location"
              iconColor="#059669"
              bgColor="bg-emerald-50"
              title="Manage Saved Addresses"
              subtitle="Configure your delivery coordinates"
              onPress={() => router.push('/profile/addresses')}
            />
            <ProfileOptionRow
              icon="settings"
              iconColor="#475569"
              bgColor="bg-slate-100"
              title="Settings"
              subtitle="App preferences and notifications"
              onPress={() => router.push('/profile/settings')}
              isLast
            />
          </View>

          {/* SECTION II: PREMIUM COMPLEMENTARY HUB ELEMENTS */}
          <Text className="text-[#0B132B]/60 font-black text-[10px] uppercase tracking-wider ml-2 mt-6 mb-2">
            Support & Legal
          </Text>

          <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
            <ProfileOptionRow
              icon="headset"
              iconColor="#D97706"
              bgColor="bg-amber-50"
              title="Help & Support Desk"
              subtitle="24/7 priority live-chat assistance"
              onPress={() => console.log('Opening Help Desk Intercom Terminal')}
            />
            <ProfileOptionRow
              icon="shield-checkmark"
              iconColor="#6366F1"
              bgColor="bg-indigo-50"
              title="Privacy Policy"
              subtitle="Review account protection guidelines"
              onPress={() => console.log('Routing to baseline Privacy Markdown')}
              isLast
            />
          </View>

          {/* AUTH TRANSACTION TRIGGER STRIPS */}
          <View className="mt-8 px-2">
            {isSignedIn ? (
              <Pressable
                onPress={handleSignOut}
                className="w-full h-14 bg-red-50 border border-red-200/60 rounded-2xl flex-row items-center justify-center active:bg-red-100/80 active:scale-98 transition-all"
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="text-red-600 font-black text-sm tracking-tight ml-2">
                  Sign Out Account
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push('/(auth)')}
                className="w-full h-14 bg-blue-600 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
              >
                <Ionicons name="log-in-outline" size={18} color="white" />
                <Text className="text-white font-black text-sm tracking-tight ml-2">
                  Log In or Register
                </Text>
              </Pressable>
            )}
            <Text className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-4">
              HouseXpertz Terminal • v1.2.0
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// SHARED ROW PRESENTATION COMPONENT TYPING
interface ProfileOptionRowProps {
  // FIXED: Changed from keyof typeof Ionicons.images to look up valid names from Expo Vector Icons
  icon: React.ComponentProps<typeof Ionicons>['name'] | string;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}

function ProfileOptionRow({ icon, iconColor, bgColor, title, subtitle, onPress, isLast }: ProfileOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center py-4 px-3 active:bg-slate-50 border-b border-slate-100 last:border-b-0 ${isLast ? 'border-b-0' : ''
        }`}
    >
      <View className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center`}>
        {icon === 'headset' ? (
          <FontAwesome6 name="headset" size={14} color={iconColor} />
        ) : (
          <Ionicons name={icon as any} size={18} color={iconColor} />
        )}
      </View>

      <View className="flex-1 ml-4 pr-4">
        <Text className="text-[#0B132B] text-sm font-black tracking-tight">{title}</Text>
        <Text className="text-slate-400 text-[11px] font-semibold mt-0.5 leading-none">{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </Pressable>
  );
}