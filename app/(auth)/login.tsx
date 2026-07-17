import { useOAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from "expo-linking";
import { MotiView } from 'moti';
import React from 'react';
import {
    Dimensions,
    ImageBackground,
    Pressable,
    StatusBar,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// High-quality premium home services image contextualized like Urban Company operations
const BACKGROUND_IMAGE_URI = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/oauth-native-callback");

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth handshake error:", err);
    }
  };

  return (
    <View className="flex-1 bg-[#040814]">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero Visual Layer with Contextual Image */}
      <ImageBackground 
        source={{ uri: BACKGROUND_IMAGE_URI }}
        style={{ height: SCREEN_HEIGHT * 0.55 }}
        className="w-full absolute top-0 left-0 right-0"
        resizeMode="cover"
      >
        {/* Deep Overlay Gradients to maximize contrast and premium feeling */}
        <LinearGradient
          colors={['rgba(4, 8, 20, 0.2)', 'rgba(4, 8, 20, 0.85)', '#040814']}
          locations={[0, 0.75, 1]}
          className="absolute inset-0"
        />
      </ImageBackground>

      {/* Screen Interactive Container */}
      <View 
        style={{ 
          paddingTop: insets.top > 0 ? insets.top : 24,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32 
        }}
        className="flex-1 justify-end px-6"
      >
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 100 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Accent Header Tag */}
          <View className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full self-start mb-4">
            <Text className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
              ★ Premium Home Operations
            </Text>
          </View>

          {/* Main Context Headline */}
          <Text className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none mb-3">
            Expert Services.{'\n'}
            On Demand.
          </Text>

          <Text className="text-slate-400 text-sm font-semibold leading-6 mb-8 max-w-[90%]">
            Join the elite circle of home maintenance. Seamlessly book vetted technicians, schedule cleaning, and manage repair logs in one single dashboard.
          </Text>

          {/* Frosted Glass Login Wrapper Card */}
          <View className="bg-white/[0.06] border border-white/10 p-6 rounded-[28px] shadow-2xl">
            <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-4 text-center">
              Secure Unified Gateway
            </Text>

            <Pressable
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              className="w-full bg-[#2563EB] h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/10 transition-transform"
            >
              <MaterialCommunityIcons name="google" size={18} color="white" className="mr-3" />
              <Text className="text-white font-black text-xs uppercase tracking-widest">
                Continue with Google
              </Text>
            </Pressable>

            {/* Micro details matching brand architecture */}
            <Text className="text-slate-500 text-[11px] font-medium text-center mt-4 leading-4">
              By logging in, you agree to HouseXpertz Terms of Service and Privacy Directives.
            </Text>
          </View>
        </MotiView>
      </View>
    </View>
  );
}