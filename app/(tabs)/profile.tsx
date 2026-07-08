import { useAuth, useUser } from '@clerk/clerk-expo';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, ScrollView, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  // Streamlined Sign Out Handler
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of HouseXpertz?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: async () => {
          try {
            // Your app/_layout.tsx handles the redirection automatically 
            // the exact millisecond this promise resolves!
            await signOut();
          } catch (error) {
            console.error('Error signing out safely:', error);
          }
        } 
      },
    ]);
  };

  const userMetadata = {
    name: user?.fullName || 'Guest Account',
    email: user?.primaryEmailAddress?.emailAddress || 'Log in to sync schedules',
    avatar: user?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* 1. HERO IDENTITY BRAND CURVED HEADER LAYER */}
        <View
          className="bg-[#0B132B] px-6 rounded-b-[48px] shadow-xl shadow-slate-900/10"
          style={{ paddingTop: insets.top + 24, paddingBottom: isTablet ? 56 : 44 }}
        >
          <View className="max-w-4xl mx-auto w-full flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="relative shadow-md">
                <Image
                  source={{ uri: userMetadata.avatar }}
                  className="rounded-2xl bg-slate-800 border-2 border-white/15"
                  style={{ width: isTablet ? 80 : 64, height: isTablet ? 80 : 64 }}
                />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B132B] items-center justify-center" />
              </View>

              <View className="flex-1 ml-4 md:ml-6 pr-2">
                <Text
                  className="text-white font-black tracking-tight"
                  style={{ fontSize: isTablet ? 24 : 18 }}
                  numberOfLines={1}
                >
                  {userMetadata.name}
                </Text>
                <Text
                  className="text-slate-400 font-medium mt-1"
                  style={{ fontSize: isTablet ? 14 : 12 }}
                  numberOfLines={1}
                >
                  {userMetadata.email}
                </Text>
              </View>
            </View>

            {isSignedIn && (
              <Pressable
                onPress={() => router.push('/profile/edit')}
                className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center border border-white/10 active:opacity-70"
              >
                <Ionicons name="create-outline" size={18} color="white" />
              </Pressable>
            )}
          </View>
        </View>

        {/* MAIN LAYOUT CONTAINER */}
        <View className="max-w-4xl mx-auto w-full px-5 -mt-6">

          {/* QUICK METRICS HIGHLIGHT ROW */}
          <View className="bg-white rounded-3xl p-5 flex-row justify-between items-center shadow-sm border border-slate-100">
            <Pressable
              onPress={() => router.push('/(tabs)/bookings')}
              className="flex-1 items-center py-1 border-r border-slate-100"
            >
              <Text className="text-blue-600 text-lg md:text-xl font-black tracking-tight">3 Active</Text>
              <Text className="text-slate-400 text-[10px] md:text-xs font-bold uppercase mt-1 tracking-wider">Bookings</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/profile/addresses')}
              className="flex-1 items-center py-1 border-r border-slate-100"
            >
              <Text className="text-[#0B132B] text-lg md:text-xl font-black tracking-tight">2 Saved</Text>
              <Text className="text-slate-400 text-[10px] md:text-xs font-bold uppercase mt-1 tracking-wider">Addresses</Text>
            </Pressable>

            <View className="flex-1 items-center py-1">
              <Text className="text-emerald-600 text-lg md:text-xl font-black tracking-tight">₹150</Text>
              <Text className="text-slate-400 text-[10px] md:text-xs font-bold uppercase mt-1 tracking-wider">Wallet Cash</Text>
            </View>
          </View>

          {/* SECTION I: ACCOUNT MANAGEMENT */}
          <Text className="text-[#0B132B]/50 font-black text-[11px] md:text-xs uppercase tracking-widest ml-2 mt-8 mb-3">
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
              isTablet={isTablet}
            />
            <ProfileOptionRow
              icon="location"
              iconColor="#059669"
              bgColor="bg-emerald-50"
              title="Manage Saved Addresses"
              subtitle="Configure your delivery coordinates"
              onPress={() => router.push('/profile/addresses')}
              isTablet={isTablet}
            />
            <ProfileOptionRow
              icon="settings"
              iconColor="#475569"
              bgColor="bg-slate-100"
              title="Settings"
              subtitle="App preferences and notifications"
              onPress={() => router.push('/profile/settings')}
              isTablet={isTablet}
              isLast
            />
          </View>

          {/* SECTION II: SUPPORT & LEGAL */}
          <Text className="text-[#0B132B]/50 font-black text-[11px] md:text-xs uppercase tracking-widest ml-2 mt-8 mb-3">
            Support & Legal
          </Text>

          <View className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden px-2">
            <ProfileOptionRow
              icon="headset"
              iconColor="#D97706"
              bgColor="bg-amber-50"
              title="Help & Support Desk"
              subtitle="24/7 priority live-chat assistance"
              onPress={() => console.log('Opening Help Desk')}
              isTablet={isTablet}
            />
            <ProfileOptionRow
              icon="shield-checkmark"
              iconColor="#6366F1"
              bgColor="bg-indigo-50"
              title="Privacy Policy"
              subtitle="Review account protection guidelines"
              onPress={() => router.push('/profile/privacy-policy')}
              isTablet={isTablet}
            />
            <ProfileOptionRow
              icon="document-text"
              iconColor="#EC4899"
              bgColor="bg-pink-50"
              title="Terms & Conditions"
              subtitle="Read platform usage agreement rules"
              onPress={() => router.push('/profile/terms-conditions')}
              isTablet={isTablet}
              isLast
            />
          </View>

          {/* AUTH TRANSACTION TRIGGER STRIPS */}
          <View className="mt-10 px-1">
            {isSignedIn ? (
              <Pressable
                onPress={handleSignOut}
                className="w-full h-14 bg-red-50 border border-red-200/50 rounded-2xl flex-row items-center justify-center active:bg-red-100/70 active:scale-[0.99] transition-all"
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="text-red-600 font-black text-sm tracking-tight ml-2">
                  Sign Out Account
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push('/(auth)/login')}
                className="w-full h-14 bg-blue-600 rounded-2xl flex-row items-center justify-center shadow-md shadow-blue-600/10 active:bg-blue-700 active:scale-[0.99] transition-all"
              >
                <Ionicons name="log-in-outline" size={18} color="white" />
                <Text className="text-white font-black text-sm tracking-tight ml-2">
                  Log In or Register
                </Text>
              </Pressable>
            )}
            <Text className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-6">
              HouseXpertz Terminal • v1.2.0
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// PREMIUM OPTION ROW COMPONENT
interface ProfileOptionRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'] | string;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isTablet: boolean;
  isLast?: boolean;
}

function ProfileOptionRow({ icon, iconColor, bgColor, title, subtitle, onPress, isTablet, isLast }: ProfileOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center py-4 px-3 active:bg-slate-50 border-b border-slate-100 ${isLast ? 'border-b-0' : ''}`}
    >
      <View
        className={`rounded-xl items-center justify-center ${bgColor}`}
        style={{ width: isTablet ? 48 : 40, height: isTablet ? 48 : 40 }}
      >
        {icon === 'headset' ? (
          <FontAwesome6 name="headset" size={isTablet ? 16 : 14} color={iconColor} />
        ) : (
          <Ionicons name={icon as any} size={isTablet ? 20 : 18} color={iconColor} />
        )}
      </View>

      <View className="flex-1 ml-4 pr-4">
        <Text
          className="text-[#0B132B] font-black tracking-tight"
          style={{ fontSize: isTablet ? 15 : 13 }}
        >
          {title}
        </Text>
        <Text
          className="text-slate-400 font-medium mt-0.5 leading-none"
          style={{ fontSize: isTablet ? 12 : 11 }}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </Pressable>
  );
}