import { Ionicons } from '@expo/vector-icons';
import { useRouter, useUnstableGlobalHref } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function UnmatchedRouteScreen() {
  const router = useRouter();
  
  // Captures the exact broken path the user attempted to visit
  const attemptedPath = useUnstableGlobalHref();

  useEffect(() => {
    /**
     * ENTERPRISE PRODUCTION NOTE:
     * Log this failure event to your error tracking telemetry suites 
     * (e.g., Sentry, Firebase Crashlytics, or Datadog) to catch broken paths early.
     */
    console.error(`[Router Telemetry] 404 Unmatched Route Exception on path: ${attemptedPath}`);
    
    // Optional: Trigger a Sentry.captureMessage(`404: ${attemptedPath}`) here.
  }, [attemptedPath]);

  const handleSafelyReturnHome = () => {
    // replace() instead of push() clears the broken route out of the navigation stack history
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#0B132B] items-center justify-center px-6">
      
      {/* Background Ambient Branding Element */}
      <View className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      <View className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 400 }}
        className="items-center"
      >
        {/* Visual Alert Icon Hub */}
        <View className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] items-center justify-center mb-6 shadow-2xl">
          <Ionicons name="compass-outline" size={44} color="#3B82F6" />
        </View>

        {/* Informative Error Copy */}
        <Text className="text-white text-2xl font-black tracking-tight text-center mb-2">
          Looking for a HouseXpert?
        </Text>
        <Text className="text-slate-400 text-sm font-semibold text-center max-w-xs mb-8 leading-relaxed">
          The view or action path you requested doesn't exist or may have migrated to a new section bundle.
        </Text>

        {/* Enterprise Technical Debug Info (Visible during staging/development) */}
        {__DEV__ && (
          <View className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-3 mb-8 w-full max-w-sm">
            <Text className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Dev Route Trace Exception:
            </Text>
            <Text className="text-slate-300 text-xs font-mono" numberOfLines={2}>
              {attemptedPath || 'Unknown path array'}
            </Text>
          </View>
        )}

        {/* Action Call to Action Button */}
        <Pressable 
          onPress={handleSafelyReturnHome}
          className="bg-blue-600 px-8 py-4 rounded-2xl flex-row items-center justify-center active:scale-95 shadow-lg shadow-blue-600/20 w-full max-w-xs"
        >
          <Ionicons name="home-sharp" size={16} color="white" className="mr-2" />
          <Text className="text-white font-black text-sm tracking-tight">Return to Dashboard</Text>
        </Pressable>
      </MotiView>
    </View>
  );
}