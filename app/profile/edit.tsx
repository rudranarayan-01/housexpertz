import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState('Karan Sharma');
    const [email, setEmail] = useState('karan.sharma@example.com');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [selectedAddress, setSelectedAddress] = useState('123, Premium Tower, Bandra West, Mumbai, Maharashtra');
    const [coordinates, setCoordinates] = useState({ latitude: 19.0760, longitude: 72.8777 });

    const handleOpenMapPicker = () => {
        // Enterprise Integration Node: Route the user to a modal/screen containing your Google Map API picker module
        // This will return the exact formatted_address string and lat/lng coordinates object back
        Alert.alert(
            'Location Picker',
            'Opening Google Maps integration to fetch precision coordinates...',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Simulate Pick',
                    onPress: () => {
                        setSelectedAddress('456, Luxury Heights, Link Road, Andheri West, Mumbai');
                        setCoordinates({ latitude: 19.1136, longitude: 72.8697 });
                    }
                }
            ]
        );
    };

    const handleSaveChanges = () => {
        setLoading(true);

        // Simulate network API request payload write-back sequence
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Profile parameters and coordinates updated successfully.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, 800);
    };

    return (
        <View className="flex-1 bg-white">
            {/* 1. TOP PREMIUM HEADER */}
            <View className="bg-[#0B132B] pt-14 pb-5 px-6 rounded-b-[32px] shadow-md flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center mr-4 active:scale-95"
                    >
                        <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                    </Pressable>
                    <Text className="text-white text-xl font-black tracking-tight">Edit Profile</Text>
                </View>

                <Pressable
                    onPress={handleSaveChanges}
                    disabled={loading}
                    className="bg-blue-600 px-4 py-2 rounded-xl active:scale-95 disabled:opacity-50"
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text className="text-white text-xs font-black tracking-tight">Save</Text>
                    )}
                </Pressable>
            </View>

            {/* 2. CORE PROFILE EDITABLE INPUT FIELDS */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-6">

                {/* Profile Avatar Context Box */}
                <View className="items-center mb-8">
                    <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center border-2 border-slate-200 relative">
                        <Text className="text-[#0B132B] text-2xl font-black">KS</Text>
                        <Pressable className="absolute bottom-0 right-0 bg-blue-600 w-7 h-7 rounded-full items-center justify-center border-2 border-white shadow-sm active:scale-90">
                            <Ionicons name="camera" size={12} color="#FFFFFF" />
                        </Pressable>
                    </View>
                    <Text className="text-slate-400 text-xs font-bold mt-2">Change Profile Photo</Text>
                </View>

                {/* Name Input Block */}
                <View className="mb-5">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-wider pl-1 mb-2">Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        className="bg-slate-50 border border-slate-200 rounded-2xl h-14 px-4 font-bold text-slate-800 text-sm focus:border-blue-500"
                    />
                </View>

                {/* Email Input Block */}
                <View className="mb-5">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-wider pl-1 mb-2">Email Address</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="name@example.com"
                        className="bg-slate-50 border border-slate-200 rounded-2xl h-14 px-4 font-bold text-slate-800 text-sm focus:border-blue-500"
                    />
                </View>

                {/* Mobile Input Block (Read-only option matching Urban Company policy verification checks) */}
                <View className="mb-6">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-wider pl-1 mb-2">Verified Contact Number</Text>
                    <View className="bg-slate-100 border border-slate-200 rounded-2xl h-14 px-4 flex-row items-center justify-between">
                        <Text className="font-bold text-slate-500 text-sm">{phone}</Text>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    </View>
                </View>

                {/* 3. PREMIUM GOOGLE MAP PLACE PICKER COMPONENT ENTRY */}
                <View className="border-t border-slate-100 pt-5">
                    <Text className="text-slate-400 text-xs font-black uppercase tracking-wider pl-1 mb-2">Primary Service Address</Text>

                    <Pressable
                        onPress={handleOpenMapPicker}
                        className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 flex-row items-center active:bg-slate-100/70"
                    >
                        <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3.5 border border-blue-100">
                            <Ionicons name="map-sharp" size={18} color="#2563EB" />
                        </View>
                        <View className="flex-1 pr-2">
                            <Text className="text-slate-800 font-bold text-sm tracking-tight mb-0.5" numberOfLines={1}>
                                {selectedAddress ? 'Location Selected' : 'Choose on Google Map'}
                            </Text>
                            <Text className="text-slate-400 text-xs font-medium" numberOfLines={2}>
                                {selectedAddress || 'Tap to launch map location pin configuration'}
                            </Text>
                        </View>
                        <Ionicons name="locate" size={18} color="#94A3B8" />
                    </Pressable>

                    {/* Coordinate Trace Preview (Helper view for debugging map coordinates) */}
                    {selectedAddress !== '' && (
                        <View className="mt-2.5 flex-row items-center pl-1">
                            <View className="bg-slate-100 px-2 py-1 rounded-md flex-row items-center">
                                <Text className="text-slate-500 text-[10px] font-mono font-bold">
                                    LAT: {coordinates.latitude.toFixed(4)} • LNG: {coordinates.longitude.toFixed(4)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

