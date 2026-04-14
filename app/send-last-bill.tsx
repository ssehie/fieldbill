import { useFocusEffect } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { InvoiceAdjustmentsForm } from '@/components/invoice-adjustments-form';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { formatStructuredAddressLines } from '@/lib/address';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  DEFAULT_PAYMENT_NOTE,
  getBusinessProfile,
  getInvoicePreviewFromAdjustments,
  getInvoiceReviewById,
  getJobAudioNote,
  getLatestUnsentInvoiceReview,
  getPartLineTotal,
  markInvoicePaid,
  markInvoiceSent,
  saveBusinessProfile,
  type BusinessProfile,
  type InvoiceAdjustments,
  type JobAudioNoteRecord,
  type InvoiceReview,
  updateInvoiceAdjustments,
} from '@/lib/fieldbill-db';
import {
  formatDate,
  formatDurationMillis,
  formatHours,
  formatMoney,
  formatNumber,
  formatTimeRange,
} from '@/lib/fieldbill-format';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function SendLastBillScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const params = useLocalSearchParams<{ invoiceId?: string }>();
  const [invoice, setInvoice] = React.useState<InvoiceReview | null>(null);
  const [audioNote, setAudioNote] = React.useState<JobAudioNoteRecord | null>(null);
  const [laborHours, setLaborHours] = React.useState('');
  const [hourlyRate, setHourlyRate] = React.useState('');
  const [discountAmount, setDiscountAmount] = React.useState('0');
  const [taxPercent, setTaxPercent] = React.useState('0');
  const [paymentNote, setPaymentNote] = React.useState(DEFAULT_PAYMENT_NOTE);
  const [businessName, setBusinessName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [street1, setStreet1] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [invoiceStartNumber, setInvoiceStartNumber] = React.useState(1);
  const [nextInvoiceNumber, setNextInvoiceNumber] = React.useState(1);
  const [currency, setCurrency] = React.useState('USD');
  const [defaultTaxEnabled, setDefaultTaxEnabled] = React.useState(false);
  const [defaultTaxRate, setDefaultTaxRate] = React.useState(0);
  const [defaultLaborRate, setDefaultLaborRate] = React.useState<number | null>(null);
  const [paymentTerms, setPaymentTerms] = React.useState(DEFAULT_PAYMENT_NOTE);
  const [taxLabor, setTaxLabor] = React.useState(false);
  const [taxMaterials, setTaxMaterials] = React.useState(true);
  const [showJobAddress, setShowJobAddress] = React.useState(true);
  const [showNotes, setShowNotes] = React.useState(true);
  const [onboardingComplete, setOnboardingComplete] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const [isEmailing, setIsEmailing] = React.useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = React.useState(false);
  const [error, setError] = React.useState('');
  const [saveState, setSaveState] = React.useState<SaveState>('idle');
  const hasHydratedRef = React.useRef(false);
  const lastSavedDraftKeyRef = React.useRef('');

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadInvoice = async () => {
        setIsLoading(true);

        const [nextInvoice, profile] = await Promise.all([
          params.invoiceId ? getInvoiceReviewById(db, params.invoiceId) : getLatestUnsentInvoiceReview(db),
          getBusinessProfile(db),
        ]);
        const nextAudioNote = nextInvoice ? await getJobAudioNote(db, nextInvoice.job_id) : null;

        if (!isActive) {
          return;
        }

        setInvoice(nextInvoice);
        setAudioNote(nextAudioNote);
        setLaborHours(nextInvoice ? String(nextInvoice.laborHours) : '');
        setHourlyRate(nextInvoice ? String(nextInvoice.hourlyRate) : '');
        setDiscountAmount(nextInvoice ? String(nextInvoice.discountAmount) : '0');
        setTaxPercent(nextInvoice ? String(nextInvoice.taxPercent) : '0');
        setPaymentNote(nextInvoice?.payment_note ?? profile.paymentTerms);
        setBusinessName(profile.businessName);
        setAddress(profile.address);
        setStreet1(profile.street1);
        setCity(profile.city);
        setState(profile.state);
        setPostalCode(profile.postalCode);
        setPhone(profile.phone);
        setEmail(profile.email);
        setInvoiceStartNumber(profile.invoiceStartNumber);
        setNextInvoiceNumber(profile.nextInvoiceNumber);
        setCurrency(profile.currency);
        setDefaultTaxEnabled(profile.defaultTaxEnabled);
        setDefaultTaxRate(profile.defaultTaxRate);
        setDefaultLaborRate(profile.defaultLaborRate);
        setPaymentTerms(profile.paymentTerms);
        setTaxLabor(profile.taxLabor);
        setTaxMaterials(profile.taxMaterials);
        setShowJobAddress(profile.showJobAddress);
        setShowNotes(profile.showNotes);
        setOnboardingComplete(profile.onboardingComplete);
        setError('');
        setSaveState(nextInvoice ? 'saved' : 'idle');
        fieldBillDebugLog('invoice.load', {
          invoiceId: nextInvoice?.id ?? null,
          status: nextInvoice?.status ?? null,
          total: nextInvoice?.total ?? null,
        });
        lastSavedDraftKeyRef.current = buildDraftKey(
          nextInvoice?.id ?? '',
          nextInvoice ? String(nextInvoice.laborHours) : '',
          nextInvoice ? String(nextInvoice.hourlyRate) : '',
          nextInvoice ? String(nextInvoice.discountAmount) : '0',
          nextInvoice ? String(nextInvoice.taxPercent) : '0',
          nextInvoice?.payment_note ?? profile.paymentTerms,
          profile
        );
        hasHydratedRef.current = true;
        setIsLoading(false);
      };

      void loadInvoice();

      return () => {
        isActive = false;
      };
    }, [db, params.invoiceId])
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (router.canGoBack()) {
          return false;
        }

        fieldBillDebugLog('invoice.back.home', {
          invoiceId: params.invoiceId ?? null,
        });
        router.replace('/');
        return true;
      });

      return () => subscription.remove();
    }, [params.invoiceId, router])
  );

  const parsedAdjustments = parseInvoiceAdjustments({
    laborHours,
    hourlyRate,
    discountAmount,
    taxPercent,
  });

  const businessProfile = React.useMemo<BusinessProfile>(
    () => ({
      businessName,
      phone,
      email,
      address,
      formattedAddress: address,
      street1,
      city,
      state,
      postalCode,
      invoiceStartNumber,
      nextInvoiceNumber,
      currency,
      defaultTaxEnabled,
      defaultTaxRate,
      defaultLaborRate,
      paymentTerms,
      taxLabor,
      taxMaterials,
      showJobAddress,
      showNotes,
      onboardingComplete,
    }),
    [
      address,
      businessName,
      city,
      currency,
      defaultLaborRate,
      defaultTaxEnabled,
      defaultTaxRate,
      email,
      invoiceStartNumber,
      nextInvoiceNumber,
      onboardingComplete,
      paymentTerms,
      phone,
      postalCode,
      showJobAddress,
      showNotes,
      state,
      street1,
      taxLabor,
      taxMaterials,
    ]
  );
  const invoiceCurrency = invoice?.currency ?? currency;
  const businessAddressLines = React.useMemo(
    () => formatStructuredAddressLines(businessProfile),
    [businessProfile]
  );
  const customerAddressLines = React.useMemo(
    () =>
      showJobAddress && invoice
        ? formatStructuredAddressLines({
            formattedAddress: invoice.address,
            street1: invoice.street1,
            city: invoice.city,
            state: invoice.state,
            postalCode: invoice.postal_code,
          })
        : [],
    [
      invoice?.address,
      invoice?.city,
      invoice?.postal_code,
      invoice?.state,
      invoice?.street1,
      showJobAddress,
    ]
  );
  const invoiceTaxPreferences = React.useMemo(
    () => ({
      taxLabor: invoice?.tax_labor === 1 ? true : false,
      taxMaterials: invoice?.tax_materials === 1 ? true : false,
    }),
    [invoice]
  );

  const preview =
    invoice && parsedAdjustments
      ? getInvoicePreviewFromAdjustments(invoice.partsSubtotal, parsedAdjustments, invoiceTaxPreferences)
      : null;

  const persistDraft = React.useCallback(
    async (showError = false) => {
      if (!invoice || !parsedAdjustments) {
        if (showError) {
          setError('Fix the numbers first.');
        }
        return null;
      }

      try {
        setSaveState('saving');

        const [updatedInvoice] = await Promise.all([
          updateInvoiceAdjustments(db, invoice.id, {
            ...parsedAdjustments,
            paymentNote,
          }),
          saveBusinessProfile(db, businessProfile),
        ]);

        if (!updatedInvoice) {
          throw new Error('Invoice not updated.');
        }

        const refreshedReview = await getInvoiceReviewById(db, updatedInvoice.id);
        setInvoice(refreshedReview);
        fieldBillDebugLog('invoice.save', {
          invoiceId: updatedInvoice.id,
          total: updatedInvoice.total,
          taxPercent: updatedInvoice.tax_percent,
        });
        lastSavedDraftKeyRef.current = buildDraftKey(
          updatedInvoice.id,
          laborHours,
          hourlyRate,
          discountAmount,
          taxPercent,
          paymentNote,
          businessProfile
        );
        setSaveState('saved');

        return refreshedReview;
      } catch {
        setSaveState('error');

        if (showError) {
          setError("Couldn't save changes.");
        }

        return null;
      }
    },
    [
      businessProfile,
      db,
      discountAmount,
      hourlyRate,
      invoice,
      laborHours,
      parsedAdjustments,
      paymentNote,
      taxPercent,
    ]
  );

  React.useEffect(() => {
    if (!invoice || !hasHydratedRef.current || !parsedAdjustments) {
      return;
    }

    const nextDraftKey = buildDraftKey(
      invoice.id,
      laborHours,
      hourlyRate,
      discountAmount,
      taxPercent,
      paymentNote,
      businessProfile
    );

    if (nextDraftKey === lastSavedDraftKeyRef.current) {
      return;
    }

    setSaveState('saving');

    const timeoutId = setTimeout(() => {
      void persistDraft(false);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [
    businessProfile,
    discountAmount,
    hourlyRate,
    invoice,
    laborHours,
    parsedAdjustments,
    paymentNote,
    persistDraft,
    taxPercent,
  ]);

  const handleMarkSent = async () => {
    if (!invoice || isSending) {
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const refreshedReview = await persistDraft(true);

      if (!refreshedReview) {
        throw new Error('Invoice not updated.');
      }

      await markInvoiceSent(db, refreshedReview.id);
      router.replace('/');
    } catch {
      setError("Couldn't mark it sent.");
      setIsSending(false);
    }
  };

  const handleEmailToMe = async () => {
    if (!invoice || isEmailing) {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Add your email first.');
      return;
    }

    setIsEmailing(true);
    setError('');

    try {
      const refreshedReview = await persistDraft(true);

      if (!refreshedReview) {
        throw new Error('Invoice not updated.');
      }

      const isMailAvailable = await MailComposer.isAvailableAsync();
      if (!isMailAvailable) {
        setError('Set up a mail app first.');
        return;
      }

      const composeOptions: MailComposer.MailComposerOptions = {
        recipients: [trimmedEmail],
        subject: buildEmailSubject(refreshedReview),
        body: buildEmailBody(refreshedReview, businessProfile, audioNote),
      };
      fieldBillDebugLog('invoice.share.email', {
        invoiceId: refreshedReview.id,
        recipient: trimmedEmail,
        hasAudioAttachment: Boolean(audioNote?.file_uri),
      });

      if (audioNote?.file_uri) {
        try {
          await MailComposer.composeAsync({
            ...composeOptions,
            attachments: [audioNote.file_uri],
          });
          return;
        } catch {
          setError("Couldn't attach audio note.");
        }
      }

      await MailComposer.composeAsync(composeOptions);
    } catch {
      setError("Couldn't open email.");
    } finally {
      setIsEmailing(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice || isMarkingPaid) {
      return;
    }

    setIsMarkingPaid(true);
    setError('');

    try {
      const refreshedReview = await persistDraft(true);

      if (!refreshedReview) {
        throw new Error('Invoice not updated.');
      }

      await markInvoicePaid(db, refreshedReview.id);
      router.replace('/');
    } catch {
      setError("Couldn't mark it paid.");
      setIsMarkingPaid(false);
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

  if (!invoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No invoice ready.</Text>
          <Text style={styles.emptyText}>
            Finish a job first, then the invoice will land here ready to review.
          </Text>
          <FieldBillButton label="Go Home" onPress={() => router.replace('/')} primary />
        </View>
      </SafeAreaView>
    );
  }

  const totals = preview ?? invoice;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.billCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerBlock}>
              <Text style={styles.invoiceEyebrow}>Invoice</Text>
              <Text style={styles.invoiceNumber}>{invoice.invoice_number ?? 'Pending'}</Text>
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>{formatInvoiceStatus(invoice.status)}</Text>
            </View>
          </View>

          <View style={styles.partyRow}>
            <View style={styles.partyCard}>
              <Text style={styles.metaLabel}>From</Text>
              <Text style={styles.partyTitle}>{businessName.trim() || 'Your business name'}</Text>
              {businessAddressLines.map((line) => (
                <Text key={line} style={styles.supportText}>
                  {line}
                </Text>
              ))}
              {phone.trim() ? <Text style={styles.supportText}>{phone.trim()}</Text> : null}
              {email.trim() ? <Text style={styles.supportText}>{email.trim()}</Text> : null}
            </View>

            <View style={styles.partyCard}>
              <Text style={styles.metaLabel}>Bill To</Text>
              <Text style={styles.partyTitle}>{invoice.customer_name}</Text>
              {customerAddressLines.map((line) => (
                <Text key={line} style={styles.supportText}>
                  {line}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.twoUpRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metaLabel}>Job Date</Text>
              <Text style={styles.metricValue}>{formatDate(invoice.start_time)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metaLabel}>Job Time</Text>
              <Text style={styles.metricValue}>
                {formatTimeRange(invoice.start_time, invoice.end_time)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryPanel}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Labor Hours</Text>
              <Text style={styles.summaryValue}>{formatHours(totals.laborHours)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hourly Rate</Text>
              <Text style={styles.summaryValue}>{formatMoney(totals.hourlyRate, invoiceCurrency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Labor Total</Text>
              <Text style={styles.summaryValue}>{formatMoney(totals.laborTotal, invoiceCurrency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Parts Subtotal</Text>
              <Text style={styles.summaryValue}>{formatMoney(invoice.partsSubtotal, invoiceCurrency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>{formatMoney(totals.discountAmount, invoiceCurrency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {formatNumber(totals.taxPercent)}% ({formatMoney(totals.taxAmount, invoiceCurrency)})
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{formatMoney(totals.total, invoiceCurrency)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.metaLabel}>Parts</Text>
            {invoice.parts.length === 0 ? (
              <Text style={styles.noteText}>No parts added for this visit.</Text>
            ) : (
              <View style={styles.partsList}>
                {invoice.parts.map((part) => (
                  <View key={part.id} style={styles.partRow}>
                    <View style={styles.partTextBlock}>
                      <Text style={styles.partName}>{part.name}</Text>
                      <Text style={styles.partMeta}>
                        {formatNumber(part.quantity)} x {formatMoney(part.unit_price, invoiceCurrency)}
                      </Text>
                    </View>
                    <Text style={styles.partTotal}>{formatMoney(getPartLineTotal(part), invoiceCurrency)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.metaLabel}>Payment Terms</Text>
            <Text style={styles.noteText}>{paymentNote.trim() || DEFAULT_PAYMENT_NOTE}</Text>
          </View>

          {showNotes && invoice.note?.trim() ? (
            <View style={styles.section}>
              <Text style={styles.metaLabel}>Job Notes</Text>
              <Text style={styles.noteText}>{invoice.note.trim()}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.metaLabel}>Audio Note</Text>
            <Text style={styles.noteText}>
              {audioNote
                ? `Audio note attached${audioNote.duration_ms ? ` • ${formatDurationMillis(audioNote.duration_ms)}` : ''}`
                : 'No audio note.'}
            </Text>
          </View>

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

        <View style={styles.editCard}>
          <Text style={styles.cardTitle}>Business Details</Text>

          <LabeledInput label="Business Name" value={businessName} onChangeText={setBusinessName} />
          <LabeledInput label="Phone" value={phone} onChangeText={setPhone} />
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <LabeledInput label="Address" value={address} onChangeText={setAddress} />

          <View style={styles.field}>
            <Text style={styles.label}>Payment Terms</Text>
            <TextInput
              multiline
              placeholder={DEFAULT_PAYMENT_NOTE}
              placeholderTextColor="#7b877c"
              style={[styles.input, styles.multilineInput]}
              value={paymentNote}
              onChangeText={(value) => {
                setPaymentNote(value);
                setPaymentTerms(value);
              }}
            />
          </View>

          <Text style={styles.saveText}>{formatSaveState(saveState)}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <FieldBillButton
            label={isEmailing ? 'Opening Email...' : 'Email Invoice'}
            onPress={() => void handleEmailToMe()}
            primary
            disabled={isEmailing || isSending || isMarkingPaid}
          />
          <FieldBillButton
            label={isSending ? 'Marking Sent...' : 'Mark as Sent'}
            onPress={() => void handleMarkSent()}
            disabled={
              isEmailing || isSending || isMarkingPaid || invoice.status === 'sent' || invoice.status === 'paid'
            }
          />
          <FieldBillButton
            label={isMarkingPaid ? 'Marking Paid...' : 'Mark as Paid'}
            onPress={() => void handleMarkPaid()}
            disabled={isEmailing || isSending || isMarkingPaid || invoice.status === 'paid'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#7b877c"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        {...inputProps}
      />
    </View>
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

function buildDraftKey(
  invoiceId: string,
  laborHours: string,
  hourlyRate: string,
  discountAmount: string,
  taxPercent: string,
  paymentNote: string,
  businessProfile: BusinessProfile
): string {
  return JSON.stringify({
    invoiceId,
    laborHours,
    hourlyRate,
    discountAmount,
    taxPercent,
    paymentNote,
    ...businessProfile,
  });
}

function buildEmailSubject(invoice: InvoiceReview): string {
  return `Invoice ${invoice.invoice_number ?? 'Pending'} for ${invoice.customer_name}`;
}

function buildEmailBody(
  invoice: InvoiceReview,
  businessProfile: BusinessProfile,
  audioNote: JobAudioNoteRecord | null
): string {
  const businessAddressLines = formatStructuredAddressLines(businessProfile);
  const customerAddressLines = businessProfile.showJobAddress
    ? formatStructuredAddressLines({
        formattedAddress: invoice.address,
        street1: invoice.street1,
        city: invoice.city,
        state: invoice.state,
        postalCode: invoice.postal_code,
      })
    : [];
  const lines = [
    businessProfile.businessName.trim() || 'FieldBill',
    ...businessAddressLines,
    businessProfile.phone.trim() ? `Phone: ${businessProfile.phone.trim()}` : '',
    businessProfile.email.trim() ? `Email: ${businessProfile.email.trim()}` : '',
    '',
    `Invoice: ${invoice.invoice_number ?? 'Pending'}`,
    `Status: ${formatInvoiceStatus(invoice.status)}`,
    '',
    `Bill To: ${invoice.customer_name}`,
    ...customerAddressLines.map((line, index) => (index === 0 ? `Address: ${line}` : `         ${line}`)),
    `Service Date: ${formatDate(invoice.start_time)}`,
    `Service Time: ${formatTimeRange(invoice.start_time, invoice.end_time)}`,
    '',
    'Summary',
    `Labor Hours: ${formatHours(invoice.laborHours)}`,
    `Hourly Rate: ${formatMoney(invoice.hourlyRate, invoice.currency)}`,
    `Labor Total: ${formatMoney(invoice.laborTotal, invoice.currency)}`,
    `Parts Subtotal: ${formatMoney(invoice.partsSubtotal, invoice.currency)}`,
    `Discount: ${formatMoney(invoice.discountAmount, invoice.currency)}`,
    `Tax: ${formatNumber(invoice.taxPercent)}% = ${formatMoney(invoice.taxAmount, invoice.currency)}`,
    `Total Due: ${formatMoney(invoice.total, invoice.currency)}`,
    '',
    'Notes',
    businessProfile.showNotes && invoice.note?.trim() ? `Notes: ${invoice.note.trim()}` : '',
    audioNote
      ? `Audio note: Attached${audioNote.duration_ms ? ` (${formatDurationMillis(audioNote.duration_ms)})` : ''}`
      : 'Audio note: None',
    `Payment Terms: ${invoice.payment_note?.trim() || DEFAULT_PAYMENT_NOTE}`,
  ].filter(Boolean);

  if (invoice.parts.length > 0) {
    lines.push('', 'Parts');
    invoice.parts.forEach((part) => {
      lines.push(
        `- ${part.name}: ${formatNumber(part.quantity)} x ${formatMoney(part.unit_price, invoice.currency)} = ${formatMoney(getPartLineTotal(part), invoice.currency)}`
      );
    });
  }

  return lines.join('\n');
}

function formatInvoiceStatus(status: InvoiceReview['status']): string {
  if (status === 'ready_to_send') {
    return 'Ready to Send';
  }

  if (status === 'paid') {
    return 'Paid';
  }

  if (status === 'sent') {
    return 'Sent';
  }

  return 'Draft';
}

function formatSaveState(saveState: SaveState): string {
  if (saveState === 'saving') {
    return 'Saving...';
  }

  if (saveState === 'saved') {
    return 'Saved';
  }

  if (saveState === 'error') {
    return 'Save failed';
  }

  return ' ';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FieldBillColors.background,
  },
  content: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 18,
  },
  billCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerBlock: {
    gap: 4,
    flex: 1,
  },
  invoiceEyebrow: {
    fontSize: 15,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  invoiceNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  statusChip: {
    borderRadius: 999,
    backgroundColor: '#e6efe4',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: FieldBillColors.primaryStrong,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  editCard: {
    backgroundColor: '#f0eadf',
    borderRadius: 22,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  customerName: {
    fontSize: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  partyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  partyCard: {
    minWidth: 240,
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f5efe4',
    padding: 16,
    gap: 6,
  },
  partyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  address: {
    fontSize: 19,
    lineHeight: 28,
    color: FieldBillColors.mutedText,
  },
  twoUpRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    minWidth: 180,
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    padding: 16,
    gap: 6,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  section: {
    gap: 6,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 24,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  supportText: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
  },
  summaryPanel: {
    borderRadius: 20,
    backgroundColor: '#1f472b',
    padding: 18,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#d7e7d8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryValue: {
    maxWidth: '55%',
    fontSize: 18,
    fontWeight: '700',
    color: '#fffdf7',
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,253,247,0.18)',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#fffdf7',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  totalValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fffdf7',
    textAlign: 'right',
  },
  partsList: {
    gap: 12,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  partTextBlock: {
    flex: 1,
    gap: 2,
  },
  partName: {
    fontSize: 20,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  partMeta: {
    fontSize: 17,
    color: FieldBillColors.mutedText,
  },
  partTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  noteText: {
    fontSize: 20,
    lineHeight: 28,
    color: FieldBillColors.text,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    color: FieldBillColors.text,
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  saveText: {
    minHeight: 22,
    fontSize: 16,
    color: FieldBillColors.mutedText,
  },
  errorText: {
    fontSize: 17,
    color: '#8a2d2d',
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
    lineHeight: 26,
  },
});
