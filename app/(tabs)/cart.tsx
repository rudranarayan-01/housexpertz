import { useCartStore } from '@/store/cart.store';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock structural address schemas - replace with your dynamic API query data later
const INITIAL_ADDRESSES = [
    { id: '1', type: 'Home', flat: 'Flat 405, Sapphire Heights', area: 'HSR Layout, Sector 3', city: 'Bangalore' },
    { id: '2', type: 'Office', flat: '3rd Floor, Tech Park Alpha', area: 'Whitefield', city: 'Bangalore' },
];

export default function CartScreen() {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Connect to global state engine
    const cartItems = useCartStore((state) => state.cartItems);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const subtotal = useCartStore((state) => state.getSubtotal());
    const tax = useCartStore((state) => state.getTax());
    const totalAmount = useCartStore((state) => state.getTotalAmount());

    // Component local interactive overlay state states
    const [addresses, setAddresses] = useState(INITIAL_ADDRESSES); // Toggle to [] to test the empty state
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

    const handleCheckout = () => {
        if (!isSignedIn) {
            router.push('/(auth)');
        } else {
            // Trigger checkout selection modal immediately
            setIsAddressModalVisible(true);
        }
    };

    const handleConfirmOrder = () => {
        const chosenAddress = addresses.find(a => a.id === selectedAddressId);
        setIsAddressModalVisible(false);
        router.push({
            pathname: '/booking-success',
            params: {
                addressType: chosenAddress?.type,
                fullAddress: `${chosenAddress?.flat}, ${chosenAddress?.area}`,
                amountPaid: totalAmount
            }
        });
        setTimeout(() => {
            clearCart();
        }, 400);
    };

    const handleAddNewAddressRedirect = () => {
        setIsAddressModalVisible(false);
        // Replace with your real address adding sheet route coordinates
        console.log('Routing toward target profile address creation context panels');
        // router.push('/profile/add-address');
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor="#0B132B" animated />

            {/* 1. VISUAL LAYER FIXED HEADER */}
            <View className="bg-[#0B132B] pt-14 pb-10 px-6 rounded-b-[32px] z-10 shadow-lg">
                <View className="max-w-7xl mx-auto w-full flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-2xl font-black tracking-tight">Your Cart</Text>
                        <Text className="text-slate-400 text-xs font-semibold mt-0.5">
                            {cartItems.length} {cartItems.length === 1 ? 'Service' : 'Services'} Selected
                        </Text>
                    </View>

                    {cartItems.length > 0 && (
                        <Pressable
                            onPress={clearCart}
                            className="bg-white/10 p-2.5 rounded-xl border border-white/10 active:scale-95"
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* CORE SCREENS ROUTING FRAMEWORK */}
            {cartItems.length === 0 ? (
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 items-center justify-center p-6 bg-slate-50"
                >
                    <View className="w-20 h-20 bg-white border border-slate-100 rounded-full items-center justify-center mb-4 shadow-sm">
                        <Ionicons name="cart-outline" size={36} color="#94A3B8" />
                    </View>
                    {/* <Text className="text-[#0B132B] font-black text-lg tracking-tight">Your Cart is Empty</Text> */}
                    <Text className="text-slate-400 text-xs text-center font-medium mt-1 max-w-[260px]">
                        Looks like you haven&apos;t added any professional services to your dashboard yet.
                    </Text>
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        className="mt-6 bg-[#0B132B] px-6 h-12 rounded-xl items-center justify-center shadow-md shadow-blue-600/20 active:scale-95"
                    >
                        <Text className="text-white font-black text-xs uppercase tracking-wider">Explore Services</Text>
                    </Pressable>
                </MotiView>
            ) : (
                <>
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-44">
                        <View className="max-w-7xl mx-auto w-full md:px-6 pt-4">

                            {/* CART ITEMS MATRIX */}
                            <View className="bg-white md:rounded-3xl border-y md:border border-slate-100 shadow-sm px-4 py-1">
                                {cartItems.map((item) => (
                                    <View key={item.id} className="flex-row items-center py-4 border-b border-slate-100 last:border-b-0">
                                        <Image source={{ uri: item.image }} className="w-16 h-16 rounded-xl bg-slate-200" />

                                        <View className="flex-1 ml-4 pr-2">
                                            <Text className="text-[#0B132B] font-black text-sm md:text-base leading-tight" numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            {item.variantTitle && (
                                                <Text className="text-blue-600/90 text-[11px] font-bold mt-0.5 bg-blue-50 self-start px-1.5 py-0.5 rounded-md">
                                                    {item.variantTitle}
                                                </Text>
                                            )}
                                            <Text className="text-slate-400 text-xs font-medium mt-1">{item.category}</Text>
                                            <Text className="text-[#0B132B] font-black text-sm md:text-base mt-1">₹{item.price}</Text>
                                        </View>

                                        <Pressable
                                            onPress={() => removeItem(item.id)}
                                            className="w-8 h-8 bg-slate-50 rounded-full items-center justify-center border border-slate-100 active:bg-red-50 active:border-red-100 transition-colors"
                                        >
                                            <Ionicons name="close-outline" size={16} color="#64748B" />
                                        </Pressable>
                                    </View>
                                ))}
                            </View>

                            {/* BILLING DECLARATION BREAKDOWN */}
                            <View className="bg-white mt-4 p-5 md:rounded-3xl border-y md:border border-slate-100 shadow-sm">
                                <Text className="text-[#0B132B] font-black text-xs uppercase tracking-wider mb-4">Payment Summary</Text>

                                <View className="flex-row justify-between mb-2.5">
                                    <Text className="text-slate-500 text-sm font-medium">Item Subtotal</Text>
                                    <Text className="text-[#0B132B] text-sm font-bold">₹{subtotal}</Text>
                                </View>

                                <View className="flex-row justify-between mb-4">
                                    <Text className="text-slate-500 text-sm font-medium">Taxes & Fees (18% GST)</Text>
                                    <Text className="text-[#0B132B] text-sm font-bold">₹{tax}</Text>
                                </View>

                                <View className="h-[1px] bg-slate-100 w-full mb-4" />

                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[#0B132B] font-black text-base">Grand Total</Text>
                                    <Text className="text-blue-600 font-black text-xl">₹{totalAmount}</Text>
                                </View>
                            </View>

                            {/* GUEST AUTH NOTIFICATION BANNER CARDS */}
                            {!isSignedIn && (
                                <MotiView
                                    from={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mx-4 md:mx-0 bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 mt-5 flex-row items-start"
                                >
                                    <Ionicons name="information-circle" size={20} color="#D97706" className="mt-0.5" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-amber-900 font-black text-xs uppercase tracking-wide">Authentication Required</Text>
                                        <Text className="text-amber-700/90 text-xs font-semibold mt-0.5 leading-4">
                                            You are completing this checkout profile step as a guest. Secure setup profiles require linking your credentials before scheduling space distribution coordinates.
                                        </Text>
                                    </View>
                                </MotiView>
                            )}

                        </View>
                    </ScrollView>

                    {/* BOTTOM ACTION FOOTER DRAWER */}
                    <MotiView
                        from={{ translateY: 100 }}
                        animate={{ translateY: 0 }}
                        style={{
                            paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24,
                        }}
                        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pt-4 z-20 shadow-2xl"
                    >
                        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Amount</Text>
                                <Text className="text-[#0B132B] text-2xl font-black mt-0.5">₹{totalAmount}</Text>
                            </View>

                            <Pressable
                                onPress={handleCheckout}
                                className="bg-blue-600 active:bg-[#0B132B] h-14 rounded-2xl px-6 flex-row items-center justify-center shadow-lg shadow-blue-600/20 flex-1 max-w-xs ml-4 active:scale-98 transition-all"
                            >
                                <Text className="text-white font-black text-sm md:text-base tracking-tight mr-2">
                                    {isSignedIn ? 'Place Order' : 'Login to Book'}
                                </Text>
                                <Ionicons name={isSignedIn ? "checkmark-circle" : "log-in-outline"} size={18} color="white" />
                            </Pressable>
                        </View>
                    </MotiView>
                </>
            )}

            {/* ADDRESS SELECTION AND MODAL SHEET SYSTEM */}
            <Modal
                visible={isAddressModalVisible}
                animationType="none"
                transparent
                onRequestClose={() => setIsAddressModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    {/* Backdrop Dimmer Pressable Dismissal trigger */}
                    <Pressable className="absolute inset-0 w-full h-full" onPress={() => setIsAddressModalVisible(false)} />

                    <MotiView
                        from={{ translateY: SCREEN_HEIGHT }}
                        animate={{ translateY: isAddressModalVisible ? 0 : SCREEN_HEIGHT }}
                        transition={{ type: 'timing', duration: 300 }}
                        style={{ maxHeight: SCREEN_HEIGHT * 0.75 }}
                        className="bg-white rounded-t-[32px] w-full px-6 pt-6 shadow-2xl"
                    >
                        {/* Handle Bar Accent element */}
                        <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-5" />

                        <View className="flex-row justify-between items-center mb-5">
                            <View>
                                <Text className="text-[#0B132B] text-lg font-black tracking-tight">Select Address</Text>
                                <Text className="text-slate-400 text-xs font-medium">Where should we deliver this service?</Text>
                            </View>
                            <Pressable
                                onPress={() => setIsAddressModalVisible(false)}
                                className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center active:scale-95"
                            >
                                <Ionicons name="close" size={18} color="#475569" />
                            </Pressable>
                        </View>

                        {/* CONDITIONAL ADDRESS ENGINE LOGIC */}
                        {addresses.length === 0 ? (
                            <View className="py-10 items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 px-4">
                                <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mb-3">
                                    <Ionicons name="location-outline" size={24} color="#2563EB" />
                                </View>
                                <Text className="text-[#0B132B] font-bold text-sm tracking-tight">No Saved Addresses Found</Text>
                                <Text className="text-slate-400 text-xs text-center mt-1 mb-5 max-w-[240px]">
                                    Please add your service delivery coordinates to continue matching with our regional experts.
                                </Text>
                                <Pressable
                                    onPress={handleAddNewAddressRedirect}
                                    className="bg-blue-600 px-5 h-11 rounded-xl flex-row items-center justify-center active:scale-95"
                                >
                                    <Ionicons name="add-circle-outline" size={16} color="white" className="mr-1.5" />
                                    <Text className="text-white font-bold text-xs uppercase tracking-wider">Add New Address</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <>
                                <ScrollView showsVerticalScrollIndicator={false} className="space-y-3 max-h-60">
                                    {addresses.map((address) => {
                                        const isSelected = selectedAddressId === address.id;
                                        return (
                                            <Pressable
                                                key={address.id}
                                                onPress={() => setSelectedAddressId(address.id)}
                                                className={`p-4 rounded-2xl border flex-row items-start mb-3 transition-all ${isSelected ? 'bg-blue-50/50 border-blue-500' : 'bg-slate-50 border-slate-200/60'
                                                    }`}
                                            >
                                                <View className="mt-0.5">
                                                    <Ionicons
                                                        name={address.type === 'Home' ? 'home-outline' : 'business-outline'}
                                                        size={18}
                                                        color={isSelected ? '#2563EB' : '#64748B'}
                                                    />
                                                </View>

                                                <View className="flex-1 ml-3 pr-4">
                                                    <View className="flex-row items-center">
                                                        <Text className={`font-black text-sm tracking-tight ${isSelected ? 'text-blue-900' : 'text-[#0B132B]'}`}>
                                                            {address.type}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-slate-500 text-xs font-semibold mt-1 leading-4">
                                                        {address.flat}, {address.area}, {address.city}
                                                    </Text>
                                                </View>

                                                <View className={`w-5 h-5 rounded-full border items-center justify-center mt-0.5 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                                    }`}>
                                                    {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>

                                {/* Bottom Secondary Utility Action trigger inside filled states */}
                                <Pressable
                                    onPress={handleAddNewAddressRedirect}
                                    className="flex-row items-center justify-center py-2.5 mt-2 mb-4 border border-dashed border-slate-200 rounded-xl active:bg-slate-50"
                                >
                                    <Ionicons name="add" size={16} color="#2563EB" />
                                    <Text className="text-blue-600 font-bold text-xs ml-1">Add Another Address</Text>
                                </Pressable>
                            </>
                        )}

                        {/* ACTION CONFIRM BUTTON FOOTER ACCENT LAYER */}
                        <View style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24 }} className="pt-4 border-t border-slate-100">
                            <Pressable
                                disabled={addresses.length === 0 || !selectedAddressId}
                                onPress={handleConfirmOrder}
                                className={`h-14 rounded-2xl flex-row items-center justify-center shadow-lg transition-all ${addresses.length === 0 || !selectedAddressId
                                        ? 'bg-slate-200 shadow-none'
                                        : 'bg-emerald-600 shadow-emerald-600/20 active:scale-98'
                                    }`}
                            >
                                <Text className="text-white font-black text-base tracking-tight mr-2">
                                    {selectedAddressId ? 'Confirm & Place Order' : 'Select an Address'}
                                </Text>
                                {selectedAddressId && <Ionicons name="checkmark" size={18} color="white" />}
                            </Pressable>
                        </View>
                    </MotiView>
                </View>
            </Modal>
        </View>
    );
}