import { Stack } from 'expo-router';
import React from 'react';

// Must be a DEFAULT export
export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#FFFFFF' }
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="privacy-policy" />
            <Stack.Screen name="terms-of-service" />
        </Stack>
    );
}