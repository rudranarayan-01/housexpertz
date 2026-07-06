import { orderService } from '@/services/orderService';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, Linking, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

// Local interfaces aligned with your populated backend response
interface OrderItem {
    serviceId: string;
    name: string;
    price: number;
    image: string;
    _id: string;
}

interface OrderDetailResponse {
    _id: string;
    orderId: string;
    userId: string;
    items: OrderItem[];
    status: 'pending' | 'completed' | 'cancelled' | string;
    totalAmount: number;
    bookingDate: string;
    serviceFee: number;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    assignedPartner: {
        name: string;
        phone: string;
    } | null;
}

const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return { label: 'Active', color: '#1E40AF', bg: '#EFF6FF', icon: 'clock-outline' };
        case 'completed':
            return { label: 'Completed', color: '#166534', bg: '#DCFCE7', icon: 'checkbox-marked-circle-outline' };
        case 'cancelled':
            return { label: 'Cancelled', color: '#991B1B', bg: '#FEE2E2', icon: 'close-circle-outline' };
        default:
            return { label: status || 'Unknown', color: '#475569', bg: '#F1F5F9', icon: 'help-circle-outline' };
    }
};

const formatFullDate = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return isoString;
    }
};

export default function OrderDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getToken, isSignedIn } = useAuth();

    const { data: order, isLoading, error, refetch } = useQuery<OrderDetailResponse>({
        queryKey: ['orderDetail', id],
        queryFn: () => orderService.fetchOrderById(id, getToken),
        enabled: !!isSignedIn && !!id,
    });

    const statusStyle = getStatusConfig(order?.status || '');

    // Loading State
    if (isLoading) {
        return (
            <View className="flex-1 bg-slate-50 items-center justify-center">
                <StatusBar barStyle="light-content" backgroundColor="#0B132B" />
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-slate-400 text-xs font-semibold mt-3">Retrieving operation parameters...</Text>
            </View>
        );
    }

    // Error State
    if (error || !order) {
        return (
            <View className="flex-1 bg-slate-50 items-center justify-center p-6">
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text className="text-[#0B132B] font-bold text-base mt-4">Failed to Load Parameters</Text>
                <Text className="text-slate-400 text-xs text-center mt-1 mb-4">{(error as Error)?.message || 'Order details mismatch'}</Text>
                <Pressable onPress={() => refetch()} className="bg-blue-600 px-5 py-2.5 rounded-xl">
                    <Text className="text-white font-bold text-xs">Retry Fetch</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            {/* Maintained Theme Status Bar */}
            <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

            {/* Consistent Application Header */}
            <View className={`bg-[#0B132B] pb-6 px-6 rounded-b-[40px] shadow-lg ${IS_TABLET ? 'pt-16 pb-8' : 'pt-14'}`}>
                <View className="flex-row items-center justify-between">
                    <Pressable 
                        onPress={() => router.back()} 
                        className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center active:scale-95 transition-all"
                    >
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </Pressable>
                    <View className="items-center flex-1 mx-4">
                        <Text className="text-white font-black text-lg tracking-tight">Operation Blueprint</Text>
                        <Text className="text-slate-400 text-[11px] font-bold mt-0.5">ID: {order.orderId}</Text>
                    </View>
                    <View className="px-3 py-1.5 rounded-full flex-row items-center" style={{ backgroundColor: statusStyle.bg }}>
                        <MaterialCommunityIcons name={statusStyle.icon as any} size={11} color={statusStyle.color} style={{ marginRight: 4 }} />
                        <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: statusStyle.color }}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                contentContainerClassName={`pb-12 ${IS_TABLET ? 'px-8 pt-8' : 'px-5 pt-5'}`}
                showsVerticalScrollIndicator={false}
            >
                <View className={`w-full max-w-6xl self-center ${IS_TABLET ? 'flex-row gap-x-8 items-start' : 'flex-col'}`}>
                    
                    {/* LEFT COLUMN / TOP LAYER: Service Summaries & Costs */}
                    <View className={IS_TABLET ? 'flex-[1.2] gap-y-6' : 'gap-y-5'}>
                        
                        {/* Booked Items Loop */}
                        <MotiView 
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-200/40"
                        >
                            <Text className="text-[#0B132B] font-black text-sm tracking-tight mb-4 uppercase text-xs text-slate-400">Services Booked</Text>
                            {order.items.map((item) => (
                                <View key={item._id} className="flex-row items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
                                    <View className="flex-row items-center flex-1 pr-4">
                                        <Image 
                                            source={{ uri: item.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150' }}
                                            className="w-12 h-12 rounded-xl mr-3 bg-slate-100"
                                        />
                                        <Text className="text-slate-900 font-bold text-sm flex-1" numberOfLines={2}>{item.name}</Text>
                                    </View>
                                    <Text className="text-slate-900 font-black text-sm">₹{item.price}</Text>
                                </View>
                            ))}
                        </MotiView>

                        {/* Financial Ledger Section */}
                        <MotiView 
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 100 }}
                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-200/40"
                        >
                            <Text className="text-[#0B132B] font-black text-sm tracking-tight mb-4 uppercase text-xs text-slate-400">Financial Ledger</Text>
                            <View className="gap-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-slate-400 text-xs font-semibold">Base Service Subtotal</Text>
                                    <Text className="text-slate-700 font-bold text-xs">₹{order.totalAmount - (order.serviceFee || 0)}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-slate-400 text-xs font-semibold">Safety & Platform Fee</Text>
                                    <Text className="text-slate-700 font-bold text-xs">₹{order.serviceFee || 0}</Text>
                                </View>
                                <View className="h-[1px] bg-slate-100 my-1" />
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-slate-900 font-black text-sm">Total Paid Gross Amount</Text>
                                    <Text className="text-blue-600 font-black text-lg">₹{order.totalAmount}</Text>
                                </View>
                            </View>
                        </MotiView>
                    </View>

                    {/* RIGHT COLUMN / BOTTOM LAYER: Schedule, Handyman & Locations */}
                    <View className={IS_TABLET ? 'flex-1 gap-y-6' : 'gap-y-5 mt-5'}>
                        
                        {/* Allocation & Time Registry */}
                        <MotiView 
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 150 }}
                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-200/40"
                        >
                            <Text className="text-[#0B132B] font-black text-sm tracking-tight mb-4 uppercase text-xs text-slate-400">Schedule Windows</Text>
                            <View className="flex-row items-start">
                                <Ionicons name="calendar-outline" size={16} color="#2563EB" style={{ marginTop: 2 }} />
                                <View className="ml-3 flex-1">
                                    <Text className="text-slate-900 font-bold text-sm">Execution Timestamp</Text>
                                    <Text className="text-slate-500 text-xs font-semibold mt-1 leading-5">{formatFullDate(order.bookingDate)}</Text>
                                </View>
                            </View>
                        </MotiView>

                        {/* Assigned Expert Unit Card */}
                        <MotiView 
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 200 }}
                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-200/40"
                        >
                            <Text className="text-[#0B132B] font-black text-sm tracking-tight mb-4 uppercase text-xs text-slate-400">Assigned Professional</Text>
                            {order.assignedPartner ? (
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 pr-2">
                                        <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center">
                                            <Ionicons name="person-outline" size={18} color="#475569" />
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>{order.assignedPartner.name}</Text>
                                            <Text className="text-slate-400 text-[11px] font-semibold mt-0.5" numberOfLines={1}>Field Expert Professional</Text>
                                        </View>
                                    </View>
                                    <Pressable 
                                        onPress={() => Linking.openURL(`tel:${order.assignedPartner?.phone}`)}
                                        className="bg-[#0B132B] px-3.5 py-2 rounded-xl flex-row items-center active:opacity-90"
                                    >
                                        <Ionicons name="call" size={12} color="white" />
                                        <Text className="text-white font-black text-[11px] ml-1.5">Call</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <View className="flex-row items-center p-1">
                                    <MaterialCommunityIcons name="account-clock-outline" size={20} color="#94A3B8" />
                                    <Text className="text-slate-400 text-xs font-medium ml-3.5">Allocating specialist dispatch unit...</Text>
                                </View>
                            )}
                        </MotiView>

                        {/* Logistics Address Card */}
                        <MotiView 
                            from={{ opacity: 0, translateY: 15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 250 }}
                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-200/40"
                        >
                            <Text className="text-[#0B132B] font-black text-sm tracking-tight mb-4 uppercase text-xs text-slate-400">Deployment Location</Text>
                            <View className="flex-row items-start">
                                <Ionicons name="location-outline" size={18} color="#EF4444" style={{ marginTop: 1 }} />
                                <View className="ml-2 flex-1">
                                    <Text className="text-slate-900 font-bold text-sm">{order.customerDetails?.name || 'Customer'}</Text>
                                    <Text className="text-slate-500 text-xs font-semibold mt-1 leading-5">{order.customerDetails?.address}</Text>
                                    <Text className="text-slate-400 text-[11px] font-semibold mt-1.5">{order.customerDetails?.phone}</Text>
                                </View>
                            </View>
                        </MotiView>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}