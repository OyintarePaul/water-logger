import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../db/client';
import { userSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

export default function ResetOnboardingButton() {
    const router = useRouter();

    const handleResetOnboarding = async () => {
        try {
            // Reset onboarding_completed to 0 in SQLite
            await db
                .update(userSettings)
                .set({ onboardingCompleted: 0 })
                .where(eq(userSettings.id, 1))

            // Navigate back to the onboarding screen
            router.replace('/onboarding');
        } catch (error) {
            console.error('Failed to reset onboarding state:', error);
            Alert.alert('Error', 'Could not reset onboarding status.');
        }
    };

    return (
        <TouchableOpacity
            onPress={handleResetOnboarding}
            className="my-3 py-3 px-4 bg-red-50 border border-red-200 rounded-2xl items-center justify-center active:opacity-80"
        >
            <Text className="text-red-600 font-semibold text-sm">
                Reset Onboarding
            </Text>
        </TouchableOpacity>
    );
}