import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const ACTIVE_BOOKINGS = [
    {
        id: 'b1',
        service: 'Kitchen Deep Cleaning',
        provider: 'HouseXpert Elite Team',
        status: 'In Progress',
        statusColor: '#3B82F6',
        statusBg: '#EFF6FF',
        date: 'Today, 04:30 PM',
        price: '₹1,499',
        icon: 'sparkles'
    },
    {
        id: 'b2',
        service: 'AC Repair & Gas Refill',
        provider: 'Xpert: Ramesh Kumar',
        status: 'Scheduled',
        statusColor: '#F59E0B',
        statusBg: '#FEF3C7',
        date: 'Tommorrow, 11:00 AM',
        price: '₹649',
        icon: 'air-conditioner'
    }
];

export default function BookingsScreen() {
    const [filter, setFilter] = useState('Active');

    return (
        <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
            {/* Premium Dark Header banner block */}
            <View className="bg-[#0B132B] pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg">
                <Text className="text-white text-2xl font-black tracking-tight">Your Service Logs</Text>
                <Text className="text-slate-400 text-xs font-semibold mt-1">Track active bookings and repair history</Text>

                {/* Filter Pill Selectors */}
                <View className="flex-row mt-6 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5">
                    {['Active', 'Completed', 'Cancelled'].map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setFilter(tab)}
                            className={`flex-1 py-2.5 rounded-xl items-center ${filter === tab ? 'bg-blue-600' : ''}`}
                        >
                            <Text className={`text-xs font-bold ${filter === tab ? 'text-white' : 'text-slate-400'}`}>
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Main Container Section */}
            <View className="px-6 mt-6 mb-10">
                {filter === 'Active' ? (
                    ACTIVE_BOOKINGS.map((item, index) => (
                        <MotiView
                            key={item.id}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: index * 100 }}
                            className="bg-white rounded-[28px] p-5 mb-5 border border-slate-100 shadow-sm shadow-slate-200/50"
                        >
                            {/* Card Top Block */}
                            <View className="flex-row justify-between items-start border-b border-slate-100 pb-4">
                                <View className="flex-row items-center flex-1 pr-2">
                                    <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-3">
                                        <MaterialCommunityIcons name={item.icon as any} size={22} color="#2563EB" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-slate-900 font-black text-base tracking-tight" numberOfLines={1}>
                                            {item.service}
                                        </Text>
                                        <Text className="text-slate-400 text-xs font-bold mt-0.5">{item.provider}</Text>
                                    </View>
                                </View>

                                <View className="px-3 py-1 rounded-full" style={{ backgroundColor: item.statusBg }}>
                                    <Text className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: item.statusColor }}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Card Mid Block Info */}
                            <View className="flex-row justify-between items-center mt-4">
                                <View className="flex-row items-center">
                                    <Ionicons name="time-outline" size={16} color="#64748B" />
                                    <Text className="text-slate-500 text-xs font-bold ml-1.5">{item.date}</Text>
                                </View>
                                <Text className="text-slate-900 font-black text-base">{item.price}</Text>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-x-3 mt-5 pt-1">
                                <Pressable className="flex-1 bg-slate-100 py-3 rounded-xl active:opacity-70 items-center">
                                    <Text className="text-slate-700 font-bold text-xs">Call Expert</Text>
                                </Pressable>
                                <Pressable className="flex-1 bg-[#0B132B] py-3 rounded-xl active:bg-blue-600 items-center">
                                    <Text className="text-white font-bold text-xs">Details</Text>
                                </Pressable>
                            </View>
                        </MotiView>
                    ))
                ) : (
                    <View className="items-center justify-center py-12">
                        <MaterialCommunityIcons name="folder-open-outline" size={48} color="#94A3B8" />
                        <Text className="text-slate-400 font-bold text-sm mt-2">No historical items found</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}