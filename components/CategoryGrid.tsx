import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const PREMIUM_CATEGORIES = [
  { id: '1', name: 'Appliance', icon: 'washing-machine', color: '#3B82F6', bg: '#EFF6FF' },
  { id: '2', name: 'Chef Team', icon: 'chef-hat', color: '#FF5A1F', bg: '#FFF7ED' },
  { id: '3', name: 'Deep Clean', icon: 'wand-magic-sparkles', color: '#10B981', bg: '#ECFDF5', family: 'FontAwesome6' },
  { id: '4', name: 'Painting', icon: 'paint-roller', color: '#8B5CF6', bg: '#F5F3FF', family: 'FontAwesome6' },
];

export default function CategoryGrid() {
  return (
    <View className="px-6 -mt-4">
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-5 flex-row justify-between shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        {PREMIUM_CATEGORIES.map((cat) => (
          <Pressable key={cat.id} className="items-center active:scale-95">
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow-sm"
              style={{ backgroundColor: cat.bg }}
            >
              {cat.family === 'FontAwesome6' ? (
                <FontAwesome6 name={cat.icon as any} size={22} color={cat.color} />
              ) : (
                <MaterialCommunityIcons name={cat.icon as any} size={26} color={cat.color} />
              )}
            </View>
            <Text className="text-slate-700 text-xs font-bold tracking-tight">{cat.name}</Text>
          </Pressable>
        ))}
      </MotiView>
    </View>
  );
}