import * as Calendar from 'expo-calendar';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  getActiveJob,
  getBusinessProfile,
  getLatestUnsentInvoice,
  isBusinessSetupComplete,
  type InvoiceSummary,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatMoney } from '@/lib/fieldbill-format';

export default function HomeScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const [activeJob, setActiveJob] = React.useState<JobRecord | null>(null);
  const [latestUnsentInvoice, setLatestUnsentInvoice] = React.useState<InvoiceSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isScheduling, setIsScheduling] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadHomeState = async () => {
        setIsLoading(true);

        const [job, invoice, businessProfile] = await Promise.all([
          getActiveJob(db),
          getLatestUnsentInvoice(db),
          getBusinessProfile(db),
        ]);

        fieldBillDebugLog('home.focus', {
          onboardingComplete: businessProfile.onboardingComplete,
          hasActiveJob: Boolean(job),
          hasInvoice: Boolean(invoice),
        });

        if (!isActive) {
          return;
        }

        if (!isBusinessSetupComplete(businessProfile)) {
          fieldBillDebugLog('home.redirect.setup', {
            onboardingComplete: businessProfile.onboardingComplete,
          });
          router.replace('/setup');
          return;
        }

        setActiveJob(job);
        setLatestUnsentInvoice(invoice);
        setIsLoading(false);
      };

      void loadHomeState();

      return () => {
        isActive = false;
      };
    }, [db, router])
  );

  const handleScheduleOnCalendar = async () => {
    try {
      setIsScheduling(true);

      const calendarAvailable = await Calendar.isAvailableAsync();
      if (!calendarAvailable) {
        Alert.alert('Calendar unavailable', 'This device does not expose the calendar API.');
        return;
      }

      const startDate = new Date(Date.now() + 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const title = activeJob
        ? `FieldBill follow-up: ${activeJob.customer_name}`
        : latestUnsentInvoice
          ? `FieldBill invoice follow-up: ${latestUnsentInvoice.customer_name}`
          : 'FieldBill job';
      const notes = activeJob
        ? `Scheduled from FieldBill for ${activeJob.customer_name}.`
        : latestUnsentInvoice
          ? `Scheduled from FieldBill for ${latestUnsentInvoice.customer_name}.`
          : 'Scheduled from FieldBill.';

      await Calendar.createEventInCalendarAsync(
        {
          title,
          notes,
          startDate,
          endDate,
          allDay: false,
        },
        { startNewActivityTask: true }
      );
    } catch (error) {
      fieldBillDebugLog('home.calendar.schedule.error', {
        message: error instanceof Error ? error.message : String(error),
      });
      Alert.alert(
        'Could not open calendar',
        'We could not open the phone calendar. Check calendar support and try again.'
      );
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>FieldBill</Text>
          <Text style={styles.subtitle}>Field work in. Clean invoice out.</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="large" color={FieldBillColors.primaryStrong} />
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.dashboard}
            showsVerticalScrollIndicator={false}>
            <View style={styles.statusCard}>
              <Text style={styles.sectionKicker}>
                {activeJob ? 'Active Job' : latestUnsentInvoice ? 'Needs Attention' : 'Ready'}
              </Text>
              <Text style={styles.sectionTitle}>
                {activeJob
                  ? activeJob.customer_name
                  : latestUnsentInvoice
                    ? latestUnsentInvoice.customer_name
                    : 'Nothing is running right now'}
              </Text>
              <Text style={styles.sectionBody}>
                {activeJob
                  ? activeJob.address
                  : latestUnsentInvoice
                    ? `${latestUnsentInvoice.invoice_number ?? 'Pending'} • ${formatMoney(latestUnsentInvoice.total, latestUnsentInvoice.currency)} waiting to send`
                    : 'Start a job, track the work, and send the invoice before you leave.'}
              </Text>
            </View>

            <View style={styles.actions}>
            {activeJob ? (
              <FieldBillButton
                label="Continue Job"
                detail={`${activeJob.customer_name}\n${activeJob.address}`}
                onPress={() => router.push('/active-job')}
                primary
              />
            ) : (
              <FieldBillButton
                label={latestUnsentInvoice ? 'Start Job' : 'Create First Invoice'}
                detail={latestUnsentInvoice ? undefined : 'Start a job and open the first invoice.'}
                onPress={() => router.push('/start-job')}
                primary
              />
            )}

            {latestUnsentInvoice ? (
              <FieldBillButton
                label="Send Last Bill"
                detail={`${latestUnsentInvoice.customer_name}\n${latestUnsentInvoice.invoice_number ?? 'Pending'} • ${formatMoney(latestUnsentInvoice.total, latestUnsentInvoice.currency)}`}
                onPress={() => router.push('/send-last-bill')}
              />
            ) : null}

              <FieldBillButton label="History" onPress={() => router.push('/history')} />
            </View>

            <View style={styles.schedulePanel}>
              <Text style={styles.sectionKicker}>Calendar</Text>
              <Text style={styles.sectionTitle}>Block the next visit fast</Text>
              <Text style={styles.sectionBody}>
                Open the phone calendar with a prefilled follow-up event, then tweak it and save.
              </Text>
              <FieldBillButton
                label="Schedule Job"
                detail="Opens the calendar app with a new event ready to save."
                onPress={handleScheduleOnCalendar}
                disabled={isScheduling}
                style={styles.scheduleButton}
              />
            </View>
          </ScrollView>
        )}
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
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 24,
  },
  header: {
    gap: 12,
  },
  dashboard: {
    paddingTop: FieldBillSpacing.sectionGap,
    paddingBottom: 12,
    gap: 16,
  },
  statusCard: {
    borderRadius: 24,
    backgroundColor: '#e7efe6',
    padding: 18,
    gap: 10,
  },
  schedulePanel: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 10,
  },
  sectionKicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: FieldBillColors.mutedText,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 22,
    color: FieldBillColors.mutedText,
  },
  scheduleButton: {
    marginTop: 4,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: FieldBillColors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    color: FieldBillColors.mutedText,
    maxWidth: 280,
  },
  loadingBlock: {
    marginTop: 24,
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
  },
  actions: {
    gap: FieldBillSpacing.buttonGap,
  },
});
