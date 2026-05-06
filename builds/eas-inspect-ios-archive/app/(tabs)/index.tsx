import * as Calendar from 'expo-calendar';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillBilling } from '@/lib/fieldbill-billing';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  getActiveJob,
  getBusinessProfile,
  getLatestUnsentInvoice,
  isBusinessSetupComplete,
  listInvoiceHistory,
  type InvoiceSummary,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatMoney } from '@/lib/fieldbill-format';
import {
  FIELD_BILL_FREE_INVOICE_LIMIT,
  getFreeInvoicesRemaining,
  needsProToCreateInvoice,
} from '@/lib/fieldbill-monetization';

type HomeSnapshot = {
  readyToSendCount: number;
  awaitingPaymentCount: number;
  openBalance: number;
};

export default function HomeScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const { canGateInvoices, hasProAccess, priceLabel } = useFieldBillBilling();
  const [activeJob, setActiveJob] = React.useState<JobRecord | null>(null);
  const [latestUnsentInvoice, setLatestUnsentInvoice] = React.useState<InvoiceSummary | null>(null);
  const [snapshot, setSnapshot] = React.useState<HomeSnapshot>({
    readyToSendCount: 0,
    awaitingPaymentCount: 0,
    openBalance: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [invoiceCount, setInvoiceCount] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadHomeState = async () => {
        setIsLoading(true);

        const [job, invoice, history, businessProfile] = await Promise.all([
          getActiveJob(db),
          getLatestUnsentInvoice(db),
          listInvoiceHistory(db),
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
        setSnapshot(buildHomeSnapshot(history));
        setInvoiceCount(history.length);
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

  const freeInvoicesRemaining = getFreeInvoicesRemaining(invoiceCount);
  const invoiceLimitReached = canGateInvoices && needsProToCreateInvoice(invoiceCount, hasProAccess);
  const showProStatus = hasProAccess || canGateInvoices;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>FieldBill</Text>
          <Text style={styles.subtitle}>Run the job. Wrap it clean. Get paid.</Text>
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
                    ? `${latestUnsentInvoice.invoice_number ?? 'Pending'} • ${formatMoney(latestUnsentInvoice.total, latestUnsentInvoice.currency)} ready to send`
                    : 'Start the next job, keep notes as you work, and send the invoice before you leave.'}
              </Text>
            </View>

            <View style={styles.glanceCard}>
              <Text style={styles.sectionKicker}>At a Glance</Text>
              <View style={styles.glanceGrid}>
                <View style={styles.glanceTile}>
                  <Text style={styles.glanceValue}>{activeJob ? '1' : '0'}</Text>
                  <Text style={styles.glanceLabel}>In Progress</Text>
                </View>
                <View style={styles.glanceTile}>
                  <Text style={styles.glanceValue}>{snapshot.readyToSendCount}</Text>
                  <Text style={styles.glanceLabel}>To Send</Text>
                </View>
                <View style={styles.glanceTile}>
                  <Text style={styles.glanceValue}>{snapshot.awaitingPaymentCount}</Text>
                  <Text style={styles.glanceLabel}>Awaiting Payment</Text>
                </View>
                <View style={[styles.glanceTile, styles.balanceTile]}>
                  <Text style={styles.glanceValue}>
                    {formatMoney(snapshot.openBalance, latestUnsentInvoice?.currency ?? 'USD')}
                  </Text>
                  <Text style={styles.glanceLabel}>Open Balance</Text>
                </View>
              </View>
            </View>

            {showProStatus ? (
              <View style={styles.proCard}>
                <Text style={styles.sectionKicker}>FieldBill Pro</Text>
                <Text style={styles.sectionTitle}>
                  {hasProAccess
                    ? 'Unlimited invoices are active'
                    : freeInvoicesRemaining > 0
                      ? `${freeInvoicesRemaining} of ${FIELD_BILL_FREE_INVOICE_LIMIT} free invoices left`
                      : 'Free trial used up'}
                </Text>
                <Text style={styles.sectionBody}>
                  {hasProAccess
                    ? 'This device can keep invoicing without limits.'
                    : freeInvoicesRemaining > 0
                      ? 'Use the free trial while you test the app, then unlock once when you are ready.'
                      : `Unlock unlimited invoices for ${priceLabel} one time.`}
                </Text>
              </View>
            ) : null}

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
                  label={invoiceLimitReached ? 'Unlock Pro' : 'Start Job'}
                  detail={
                    invoiceLimitReached
                      ? 'You have used the free invoices. Unlock once to keep creating invoices.'
                      : latestUnsentInvoice
                      ? 'Start another visit and keep today moving.'
                      : 'Start a visit, track the work, and send the invoice when you are done.'
                  }
                  onPress={() => router.push((invoiceLimitReached ? '/upgrade' : '/start-job') as never)}
                  primary
                />
              )}

              {latestUnsentInvoice ? (
                <FieldBillButton
                  label="Open Draft Invoice"
                  detail={`${latestUnsentInvoice.customer_name}\n${latestUnsentInvoice.invoice_number ?? 'Pending'} • ${formatMoney(latestUnsentInvoice.total, latestUnsentInvoice.currency)}`}
                  onPress={() => router.push('/send-last-bill')}
                />
              ) : null}

              <FieldBillButton
                label="Invoice History"
                detail="Past jobs, sent invoices, and paid work."
                onPress={() => router.push('/history')}
              />

              {canGateInvoices && !hasProAccess ? (
                <FieldBillButton
                  label={`Unlock Pro ${priceLabel}`}
                  detail="One-time purchase for unlimited invoices."
                  onPress={() => router.push('/upgrade' as never)}
                />
              ) : null}
            </View>

            <View style={styles.schedulePanel}>
              <Text style={styles.sectionKicker}>Calendar</Text>
              <Text style={styles.sectionTitle}>Block the next visit fast</Text>
              <Text style={styles.sectionBody}>
                Open the phone calendar with the event already filled in, adjust it if needed, and save.
              </Text>
              <FieldBillButton
                label="Add to Calendar"
                detail="Creates a follow-up event in the phone calendar."
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
  glanceCard: {
    borderRadius: 24,
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    padding: 18,
    gap: 12,
  },
  proCard: {
    borderRadius: 24,
    backgroundColor: '#efe8d7',
    borderWidth: 1,
    borderColor: '#d8ccb2',
    padding: 18,
    gap: 10,
  },
  glanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  glanceTile: {
    minWidth: 140,
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f0eadf',
    padding: 14,
    gap: 4,
  },
  balanceTile: {
    backgroundColor: '#edf3ee',
  },
  glanceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  glanceLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: FieldBillColors.mutedText,
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

function buildHomeSnapshot(history: InvoiceSummary[]): HomeSnapshot {
  return history.reduce<HomeSnapshot>(
    (summary, invoice) => {
      if (invoice.status === 'draft' || invoice.status === 'ready_to_send') {
        summary.readyToSendCount += 1;
        summary.openBalance += invoice.total;
      } else if (invoice.status === 'sent') {
        summary.awaitingPaymentCount += 1;
        summary.openBalance += invoice.total;
      }

      return summary;
    },
    {
      readyToSendCount: 0,
      awaitingPaymentCount: 0,
      openBalance: 0,
    }
  );
}
