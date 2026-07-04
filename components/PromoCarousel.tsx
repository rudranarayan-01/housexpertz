import { MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 48; // Full screen container padding offset width calculation

const CAROUSEL_DATA = [
  {
    id: 'c1',
    tag: 'HouseXpertz Elite',
    title: 'Hire Culinary Chefs For Private Parties',
    desc: 'Verified gourmet masters cooking live.',
    btnText: 'Explore Chefs',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400',
  },
  {
    id: 'c2',
    tag: 'Mega Deal',
    title: 'AC Revive Sales & Performance Service',
    desc: 'Deep filter sterilization before summers.',
    btnText: 'Claim 20% Off',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400',
  }
];

export default function PromoCarousel() {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // High Performance Autoplay Timer Loop Hook
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= CAROUSEL_DATA.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000); // Transitions to next node automatically every 4 seconds

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollOffset / CAROUSEL_WIDTH);
    if (currentIndex !== activeIndex && currentIndex >= 0 && currentIndex < CAROUSEL_DATA.length) {
      setActiveIndex(currentIndex);
    }
  };

  return (
    <View className="px-6 mt-8">
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_DATA}
        horizontal
        pagingEnabled
        snapToInterval={CAROUSEL_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View 
            style={{ width: CAROUSEL_WIDTH }} 
            className="bg-[#FF5A1F] rounded-[32px] p-6 flex-row items-center justify-between shadow-lg shadow-orange-500/20 overflow-hidden relative mr-4"
          >
            {/* Ambient Vector Shape Graphic */}
            <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />

            <View className="flex-1 pr-4 z-10">
              <View className="bg-white/20 self-start px-2.5 py-1 rounded-md mb-2">
                <Text className="text-white text-[10px] font-black tracking-widest uppercase">{item.tag}</Text>
              </View>
              <Text className="text-white text-xl font-black tracking-tight leading-snug" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-orange-100 text-xs mt-1 font-medium" numberOfLines={1}>
                {item.desc}
              </Text>
              <Pressable className="bg-[#0B132B] self-start px-4 py-2.5 rounded-xl mt-4 active:scale-95 shadow-md">
                <Text className="text-white font-bold text-xs tracking-tight">{item.btnText}</Text>
              </Pressable>
            </View>

            <Image
              source={{ uri: item.image }}
              className="w-24 h-32 rounded-2xl z-10"
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Dynamic Pagination Pill Dots Indicator */}
      <View className="flex-row justify-center items-center mt-3 gap-x-1.5">
        {CAROUSEL_DATA.map((_, idx) => (
          <MotiView
            key={idx}
            animate={{
              width: activeIndex === idx ? 16 : 6,
              backgroundColor: activeIndex === idx ? '#FF5A1F' : '#CBD5E1',
            }}
            transition={{ type: 'timing', duration: 250 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </View>
    </View>
  );
}