import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import { getBusinessProfile, isBusinessSetupComplete } from '@/lib/fieldbill-db';

export default function AppLaunchScreen() {
  const db = useFieldBillDb();
  const router = useRouter();

  React.useEffect(() => {
    let isActive = true;

    const routeUser = async () => {
      const businessProfile = await getBusinessProfile(db);

      if (!isActive) {
        return;
      }

      const nextRoute = isBusinessSetupComplete(businessProfile) ? '/(tabs)' : '/setup';
      fieldBillDebugLog('app.launch.route', {
        onboardingComplete: businessProfile.onboardingComplete,
        nextRoute,
      });
      router.replace(nextRoute);
    };

    void routeUser();

    return () => {
      isActive = false;
    };
  }, [db, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={FieldBillColors.primaryStrong} />
        <Text style={styles.title}>FieldBill</Text>
        <Text style={styles.subtitle}>Loading your workspace...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FieldBillColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: FieldBillSpacing.screenPadding,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  subtitle: {
    fontSize: 17,
    color: FieldBillColors.mutedText,
  },
});
