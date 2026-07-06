import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Linking, Pressable, Text, View } from 'react-native';

// Clerk Expo Hooks & Web Handshake Module Integration
import { orderService } from '@/services/orderService';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

// Warms up the native mobile browser for incredibly fast OAuth handshakes
WebBrowser.maybeCompleteAuthSession();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

// Interfaces mapping directly to your API schema
interface OrderItem {
    serviceId: string;
    name: string;
    price: number;
    image: string;
    _id: string;
}

interface Order {
    _id: string;
    orderId: string;
    userId: string;
    items: OrderItem[];
    status: 'pending' | 'completed' | 'cancelled' | string;
    totalAmount: number;
    bookingDate: string;
    serviceFee: number;
    assignedPartner: string | null;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

// Configuration mapper for styling order statuses beautifully
const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return { label: 'Active', color: '#1E40AF', bg: '#EFF6FF', icon: 'clock-outline' };
        case 'completed':
            return { label: 'Completed', color: '#166534', bg: '#DCFCE7', icon: 'checkbox-marked-circle-outline' };
        case 'cancelled':
            return { label: 'Cancelled', color: '#991B1B', bg: '#FEE2E2', icon: 'close-circle-outline' };
        default:
            return { label: status, color: '#475569', bg: '#F1F5F9', icon: 'help-circle-outline' };
    }
};

// Formats your server ISO timestamps into cleanly readable locale strings
const formatBookingDate = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return isoString;
    }
};

export default function BookingsScreen() {
    const router = useRouter();
    // Added 'All' filter configuration option
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');

    // 1. Clerk Session Authentication States & Token Fetcher
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    // 2. Fetch authenticated order histories using the network service
    const { data, isLoading, error, refetch } = useQuery<{ success: boolean; orders: Order[] }>({
        queryKey: ['orderHistory'],
        queryFn: () => orderService.fetchOrderHistory(getToken),
        enabled: !!isSignedIn, // Only fires network requests when the user is signed in
    });

    // Client-side analytical state partitioner matching chosen dashboard tabs
    const filteredOrders = useMemo(() => {
        if (!data?.orders) return [];
        if (filter === 'All') return data.orders; // Return complete sequence when "All" is active
        
        return data.orders.filter((order) => {
            const statusLabel = getStatusConfig(order.status).label;
            return statusLabel.toLowerCase() === filter.toLowerCase();
        });
    }, [data, filter]);

    // Google Sign In handler sequence mirroring web strategies
    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error('OAuth operational handshake error:', err);
        }
    };

    // 3. Fallback loading indicator while checking local encrypted token cache stores
    if (!isLoaded) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-slate-400 text-xs font-semibold mt-3">Verifying credentials...</Text>
            </View>
        );
    }

    // 4. Intercept View rendering if unauthenticated session status is detected
    if (!isSignedIn) {
        return (
            <View className="flex-1 bg-slate-50 items-center justify-center p-6">
                <MotiView 
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    className="w-full max-w-sm items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50"
                >
                    <View className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-5 shadow-md">
                        <Text className="text-white font-black text-xl">HS</Text>
                    </View>
                    
                    <Text className="text-slate-900 font-black text-xl tracking-tight text-center">Authentication Required</Text>
                    <Text className="text-slate-400 text-xs font-semibold text-center mt-2 mb-8 leading-5">
                        Please sign in to view your dynamic service logs, track ongoing operations, and view repair histories.
                    </Text>

                    <Pressable 
                        onPress={handleGoogleSignIn}
                        className="w-full bg-[#0B132B] py-4 rounded-2xl active:opacity-90 flex-row items-center justify-center shadow-md shadow-slate-900/10"
                    >
                        <MaterialCommunityIcons name="google" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-black text-xs uppercase tracking-widest">Sign In with Google</Text>
                    </Pressable>
                </MotiView>
            </View>
        );
    }

    // 5. Native error tracking boundaries
    if (error) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <Ionicons name="cloud-offline-outline" size={48} color="#94A3B8" />
                <Text className="text-[#0B132B] font-bold text-base mt-4">Failed to Sync Records</Text>
                <Text className="text-slate-400 text-xs text-center mt-1 mb-4">{(error as Error).message}</Text>
                <Pressable onPress={() => refetch()} className="bg-blue-600 px-5 py-2.5 rounded-xl">
                    <Text className="text-white font-bold text-xs">Retry Connection</Text>
                </Pressable>
            </View>
        );
    }

    // 6. Primary Bookings Dashboard layout render engine
    if (isLoading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-slate-400 text-xs font-semibold mt-3">Syncing structural logs...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50 items-center justify-center">
            <View className="w-full h-full max-w-6xl bg-slate-50 self-center">
                <FlatList
                    data={filteredOrders}
                    key={IS_TABLET ? 'tablet-logs' : 'mobile-logs'}
                    numColumns={IS_TABLET ? 2 : 1}
                    columnWrapperClassName={IS_TABLET ? "justify-between px-6" : undefined}
                    contentContainerClassName="pb-12"
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View className={`bg-[#0B132B] pb-8 px-6 rounded-b-[40px] shadow-lg mb-6 ${IS_TABLET ? 'pt-20' : 'pt-14'}`}>
                            <Text className={`${IS_TABLET ? 'text-3xl' : 'text-2xl'} text-white font-black tracking-tight`}>Your Service Logs</Text>
                            <Text className="text-slate-400 text-xs font-semibold mt-1">Track active bookings and repair history</Text>

                            {/* Responsive Tab Bar Wrapper */}
                            <View className="flex-row mt-6 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 max-w-xl">
                                {(['All', 'Active', 'Completed', 'Cancelled'] as const).map((tab) => (
                                    <Pressable
                                        key={tab}
                                        onPress={() => setFilter(tab)}
                                        className={`flex-1 py-2.5 rounded-xl items-center active:scale-95 transition-all ${filter === tab ? 'bg-blue-600 shadow-sm' : ''}`}
                                    >
                                        <Text className={`text-xs font-bold ${filter === tab ? 'text-white' : 'text-slate-400'}`}>
                                            {tab}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center py-24 px-6">
                            <MaterialCommunityIcons name="folder-open-outline" size={54} color="#94A3B8" />
                            <Text className="text-[#0B132B] font-black text-base mt-3">No logs found</Text>
                            <Text className="text-slate-400 text-xs font-medium text-center mt-1">
                                There are currently no {filter === 'All' ? '' : filter.toLowerCase()} service operations registered under this file folder.
                            </Text>
                        </View>
                    }
                    renderItem={({ item: order, index }) => {
                        const primaryItem = order.items[0];
                        const statusStyle = getStatusConfig(order.status);

                        return (
                            <MotiView
                                from={{ opacity: 0, translateY: 15 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 60, type: 'timing', duration: 250 }}
                                style={{ width: IS_TABLET ? '48.5%' : '100%' }}
                                className={`bg-white rounded-[28px] p-5 mb-5 border border-slate-100 shadow-sm shadow-slate-200/40 ${!IS_TABLET ? 'mx-6' : ''}`}
                            >
                                <View className="flex-row justify-between items-start border-b border-slate-100 pb-4">
                                    <View className="flex-row items-center flex-1 pr-2">
                                        <View className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden mr-3 border border-slate-100">
                                            <Image
                                                source={{ uri: primaryItem?.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150' }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-slate-900 font-black text-sm tracking-tight" numberOfLines={1}>
                                                {primaryItem?.name || 'HouseXpert Operation'}
                                            </Text>
                                            <Text className="text-slate-400 text-[11px] font-bold mt-0.5" numberOfLines={1}>
                                                ID: {order.orderId}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="px-2.5 py-1 rounded-full flex-row items-center" style={{ backgroundColor: statusStyle.bg }}>
                                        <MaterialCommunityIcons name={statusStyle.icon as any} size={10} color={statusStyle.color} style={{ marginRight: 3 }} />
                                        <Text className="text-[9px] font-black uppercase tracking-wider" style={{ color: statusStyle.color }}>
                                            {statusStyle.label}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between items-center mt-4">
                                    <View className="flex-row items-center">
                                        <Ionicons name="calendar-outline" size={14} color="#64748B" />
                                        <Text className="text-slate-500 text-xs font-bold ml-1.5">
                                            {formatBookingDate(order.bookingDate)}
                                        </Text>
                                    </View>
                                    <Text className="text-slate-900 font-black text-base">
                                        ₹{order.totalAmount}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-3 mt-5 pt-1">
                                    <Pressable
                                        onPress={() => Linking.openURL(`tel:${order.customerDetails.phone}`)}
                                        className="flex-1 bg-slate-50 border border-slate-100 py-3 rounded-xl active:bg-slate-100 items-center justify-center"
                                    >
                                        <Text className="text-slate-700 font-black text-xs">Call Support</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => {
                                            router.push({
                                                pathname: "/bookings/[id]",
                                                params: { id: order._id, orderId: order.orderId }
                                            });
                                        }}
                                        className="flex-1 bg-[#0B132B] py-3 rounded-xl active:opacity-90 items-center justify-center shadow-sm shadow-slate-900/10"
                                    >
                                        <Text className="text-white font-black text-xs">Details</Text>
                                    </Pressable>
                                </View>
                            </MotiView>
                        );
                    }}
                />
            </View>
        </View>
    );
}