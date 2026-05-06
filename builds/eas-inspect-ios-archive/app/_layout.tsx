import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';

import { FieldBillColors } from '@/constants/fieldbill';
import { FieldBillBillingProvider } from '@/lib/fieldbill-billing';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FieldBillDatabaseProvider } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    fieldBillDebugLog('app.lifecycle.mount');

    const subscription = AppState.addEventListener('change', (state) => {
      fieldBillDebugLog('app.lifecycle.state', { state });
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FieldBillDatabaseProvider>
        <FieldBillBillingProvider>
          <Stack
            screenOptions={{
              headerTintColor: FieldBillColors.text,
              headerTitleStyle: { color: FieldBillColors.text },
              headerStyle: { backgroundColor: FieldBillColors.background },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: FieldBillColors.background },
              headerBackButtonDisplayMode: 'minimal',
            }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name="setup" options={{ headerShown: false }} />
            <Stack.Screen
              name="start-job"
              options={{
                title: 'Start Job',
                headerBackTitle: 'Bck',
                headerBackButtonDisplayMode: 'default',
              }}
            />
            <Stack.Screen
              name="active-job"
              options={{
                title: 'Active Job',
                headerBackTitle: 'Bck',
                headerBackButtonDisplayMode: 'default',
              }}
            />
            <Stack.Screen name="finish-job" options={{ title: 'Review Invoice' }} />
            <Stack.Screen name="add-part" options={{ title: 'Add Part' }} />
            <Stack.Screen name="talk-note" options={{ title: 'Audio Note' }} />
            <Stack.Screen
              name="send-last-bill"
              options={{
                title: 'Invoice',
                headerBackTitle: 'Bck',
                headerBackButtonDisplayMode: 'default',
              }}
            />
            <Stack.Screen
              name="history"
              options={{
                title: 'Invoices',
                headerBackTitle: 'Bck',
                headerBackButtonDisplayMode: 'default',
              }}
            />
            <Stack.Screen name="upgrade" options={{ title: 'FieldBill Pro' }} />
          </Stack>
        </FieldBillBillingProvider>
      </FieldBillDatabaseProvider>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
