import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { InvoiceAdjustmentsForm } from '@/components/invoice-adjustments-form';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillBilling } from '@/lib/fieldbill-billing';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  countInvoices,
  completeJob,
  createInvoiceDraftForCompletedJob,
  getBusinessProfile,
  getActiveJob,
  getJobAudioNote,
  getDefaultInvoiceAdjustments,
  getInvoicePreviewFromAdjustments,
  getPartsSubtotalForJob,
  type InvoiceAdjustments,
  type JobAudioNoteRecord,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatDurationMillis, formatHours, formatMoney } from '@/lib/fieldbill-format';
import { needsProToCreateInvoice } from '@/lib/fieldbill-monetization';

export default function FinishJobScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const { canGateInvoices, hasProAccess } = useFieldBillBilling();
  const headerHeight = useHeaderHeight();
  const [job, setJob] = React.useState<JobRecord | null>(null);
  const [audioNote, setAudioNote] = React.useState<JobAudioNoteRecord | null>(null);
  const [currency, setCurrency] = React.useState('USD');
  const [taxLabor, setTaxLabor] = React.useState(false);
  const [taxMaterials, setTaxMaterials] = React.useState(true);
  const [partsSubtotal, setPartsSubtotal] = React.useState(0);
  const [laborHours, setLaborHours] = React.useState('');
  const [hourlyRate, setHourlyRate] = React.useState('');
  const [discountAmount, setDiscountAmount] = React.useState('0');
  const [taxPercent, setTaxPercent] = React.useState('0');
  const [error, setError] = React.useState('');
  const [busyAction, setBusyAction] = React.useState<'send' | 'save' | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadReview = async () => {
        setIsLoading(true);
        const [activeJob, businessProfile] = await Promise.all([getActiveJob(db), getBusinessProfile(db)]);

        if (!isActive) {
          return;
        }

        if (!activeJob) {
          setJob(null);
          setAudioNote(null);
          setPartsSubtotal(0);
          setCurrency(businessProfile.currency);
          setTaxLabor(businessProfile.taxLabor);
          setTaxMaterials(businessProfile.taxMaterials);
          setIsLoading(false);
          return;
        }

        const [nextPartsSubtotal, nextAudioNote] = await Promise.all([
          getPartsSubtotalForJob(db, activeJob.id),
          getJobAudioNote(db, activeJob.id),
        ]);
        const defaults = getDefaultInvoiceAdjustments(activeJob, businessProfile);

        if (!isActive) {
          return;
        }

        setJob(activeJob);
        setAudioNote(nextAudioNote);
        setPartsSubtotal(nextPartsSubtotal);
        setCurrency(businessProfile.currency);
        setTaxLabor(businessProfile.taxLabor);
        setTaxMaterials(businessProfile.taxMaterials);
        setLaborHours(String(defaults.laborHours));
        setHourlyRate(String(defaults.hourlyRate));
        setDiscountAmount(String(defaults.discountAmount));
        setTaxPercent(String(defaults.taxPercent));
        setError('');
        setIsLoading(false);
        fieldBillDebugLog('finish-job.focus', {
          jobId: activeJob.id,
          partsSubtotal: nextPartsSubtotal,
        });
      };

      void loadReview();

      return () => {
        isActive = false;
      };
    }, [db])
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (router.canGoBack()) {
          return false;
        }

        fieldBillDebugLog('finish-job.back.active-job');
        router.replace('/active-job');
        return true;
      });

      return () => subscription.remove();
    }, [router])
  );

  const parsedAdjustments = parseInvoiceAdjustments({
    laborHours,
    hourlyRate,
    discountAmount,
    taxPercent,
  });

  const preview = parsedAdjustments
    ? getInvoicePreviewFromAdjustments(partsSubtotal, parsedAdjustments, {
        taxLabor,
        taxMaterials,
      })
    : null;

  const handleSaveLater = async () => {
    if (!job || !parsedAdjustments || busyAction) {
      if (!parsedAdjustments) {
        setError('Fix the numbers first.');
      }
      return;
    }

    setBusyAction('save');
    setError('');

    try {
      const invoiceCount = await countInvoices(db);
      if (canGateInvoices && needsProToCreateInvoice(invoiceCount, hasProAccess)) {
        setBusyAction(null);
        router.push('/upgrade' as never);
        return;
      }

      const completedJob = await completeJob(db, job.id);

      if (!completedJob) {
        throw new Error('Job not found.');
      }

      await createInvoiceDraftForCompletedJob(db, completedJob.id, parsedAdjustments);
      router.replace('/');
    } catch {
      setError("Couldn't save draft.");
      setBusyAction(null);
    }
  };

  const handleSendBill = async () => {
    if (!job || !parsedAdjustments || busyAction) {
      if (!parsedAdjustments) {
        setError('Fix the numbers first.');
      }
      return;
    }

    setBusyAction('send');
    setError('');

    try {
      const invoiceCount = await countInvoices(db);
      if (canGateInvoices && needsProToCreateInvoice(invoiceCount, hasProAccess)) {
        setBusyAction(null);
        router.push('/upgrade' as never);
        return;
      }

      const completedJob = await completeJob(db, job.id);

      if (!completedJob) {
        throw new Error('Job not found.');
      }

      const invoice = await createInvoiceDraftForCompletedJob(db, completedJob.id, parsedAdjustments);

      if (!invoice) {
        throw new Error('Invoice not created.');
      }

      router.replace({
        pathname: '/send-last-bill',
        params: { invoiceId: invoice.id },
      });
    } catch {
      setError("Couldn't open invoice.");
      setBusyAction(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No active job.</Text>
          <Text style={styles.emptyText}>Go home and start a job.</Text>
          <FieldBillButton label="GO HOME" onPress={() => router.replace('/')} primary />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.kicker}>Review before invoice</Text>
            <Text style={styles.customerName}>{job.customer_name}</Text>
            <Text style={styles.address}>{job.address}</Text>

            {preview ? (
              <>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryTile}>
                    <Text style={styles.label}>Labor Hours</Text>
                    <Text style={styles.value}>{formatHours(preview.laborHours)}</Text>
                  </View>
                  <View style={styles.summaryTile}>
                    <Text style={styles.label}>Labor Total</Text>
                    <Text style={styles.value}>{formatMoney(preview.laborTotal, currency)}</Text>
                  </View>
                  <View style={styles.summaryTile}>
                    <Text style={styles.label}>Parts</Text>
                    <Text style={styles.value}>{formatMoney(partsSubtotal, currency)}</Text>
                  </View>
                  <View style={[styles.summaryTile, styles.audioTile]}>
                    <Text style={styles.label}>Audio Note</Text>
                    <Text style={styles.valueText}>
                      {audioNote
                        ? `Saved${audioNote.duration_ms ? ` • ${formatDurationMillis(audioNote.duration_ms)}` : ''}`
                        : 'No audio note.'}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalPanel}>
                  <Text style={styles.label}>Grand Total</Text>
                  <Text style={styles.totalValue}>{formatMoney(preview.total, currency)}</Text>
                </View>
              </>
            ) : null}
          </View>

          <InvoiceAdjustmentsForm
            laborHours={laborHours}
            hourlyRate={hourlyRate}
            discountAmount={discountAmount}
            taxPercent={taxPercent}
            onLaborHoursChange={setLaborHours}
            onHourlyRateChange={setHourlyRate}
            onDiscountAmountChange={setDiscountAmount}
            onTaxPercentChange={setTaxPercent}
          />
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <FieldBillButton
              label={busyAction === 'send' ? 'OPENING INVOICE...' : 'OPEN INVOICE'}
              onPress={() => void handleSendBill()}
              primary
              disabled={busyAction !== null}
            />
            <FieldBillButton
              label={busyAction === 'save' ? 'SAVING...' : 'SAVE DRAFT'}
              onPress={() => void handleSaveLater()}
              disabled={busyAction !== null}
            />
            <FieldBillButton
              label="BACK"
              onPress={() => router.back()}
              disabled={busyAction !== null}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function parseInvoiceAdjustments(values: {
  laborHours: string;
  hourlyRate: string;
  discountAmount: string;
  taxPercent: string;
}): InvoiceAdjustments | null {
  const laborHours = Number(values.laborHours || '0');
  const hourlyRate = Number(values.hourlyRate || '0');
  const discountAmount = Number(values.discountAmount || '0');
  const taxPercent = Number(values.taxPercent || '0');

  if (
    !Number.isFinite(laborHours) ||
    laborHours < 0 ||
    !Number.isFinite(hourlyRate) ||
    hourlyRate < 0 ||
    !Number.isFinite(discountAmount) ||
    discountAmount < 0 ||
    !Number.isFinite(taxPercent) ||
    taxPercent < 0 ||
    taxPercent > 100
  ) {
    return null;
  }

  return {
    laborHours,
    hourlyRate,
    discountAmount,
    taxPercent,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FieldBillColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },
  card: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 14,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  customerName: {
    fontSize: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  address: {
    fontSize: 19,
    lineHeight: 28,
    color: FieldBillColors.mutedText,
  },
  row: {
    gap: 6,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryTile: {
    minWidth: 150,
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f0eadf',
    padding: 16,
    gap: 6,
  },
  audioTile: {
    minWidth: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  valueText: {
    fontSize: 20,
    lineHeight: 28,
    color: FieldBillColors.text,
  },
  totalPanel: {
    borderRadius: 20,
    backgroundColor: '#1f472b',
    padding: 18,
    gap: 8,
  },
  totalValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fffdf7',
  },
  errorText: {
    fontSize: 17,
    color: '#8a2d2d',
  },
  footer: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
    backgroundColor: FieldBillColors.background,
  },
  actions: {
    gap: FieldBillSpacing.buttonGap,
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: FieldBillSpacing.screenPadding,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  emptyText: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
    textAlign: 'center',
  },
});
