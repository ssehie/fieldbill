import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressAutocompleteInput } from '@/components/address-autocomplete-input';
import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillLegal, FieldBillSpacing } from '@/constants/fieldbill';
import {
  emptyStructuredAddress,
  isStructuredAddressMatch,
  toStructuredAddressRecord,
  type StructuredAddress,
} from '@/lib/address';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  completeBusinessOnboarding,
  DEFAULT_CURRENCY,
  DEFAULT_INVOICE_NUMBER,
  DEFAULT_PAYMENT_TERMS,
  getBusinessProfile,
  isBusinessSetupComplete,
} from '@/lib/fieldbill-db';

type Step = 0 | 1 | 2 | 3;

export default function OnboardingScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const [businessName, setBusinessName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [structuredAddress, setStructuredAddress] = React.useState<StructuredAddress>(
    emptyStructuredAddress()
  );
  const [nextInvoiceNumber, setNextInvoiceNumber] = React.useState(String(DEFAULT_INVOICE_NUMBER));
  const [defaultTaxEnabled, setDefaultTaxEnabled] = React.useState(false);
  const [defaultTaxRate, setDefaultTaxRate] = React.useState('0');
  const [defaultLaborRate, setDefaultLaborRate] = React.useState('');
  const [paymentTerms, setPaymentTerms] = React.useState(DEFAULT_PAYMENT_TERMS);
  const [currency, setCurrency] = React.useState(DEFAULT_CURRENCY);
  const [taxLabor, setTaxLabor] = React.useState(false);
  const [taxMaterials, setTaxMaterials] = React.useState(true);
  const [showJobAddress, setShowJobAddress] = React.useState(true);
  const [showNotes, setShowNotes] = React.useState(true);

  React.useEffect(() => {
    let isActive = true;

    const loadDefaults = async () => {
      const profile = await getBusinessProfile(db);

      if (!isActive) {
        return;
      }

      if (isBusinessSetupComplete(profile)) {
        router.replace('/(tabs)');
        return;
      }

      setBusinessName(profile.businessName);
      setPhone(formatPhoneInput(profile.phone));
      setEmail(profile.email);
      setAddress(profile.address);
      setStructuredAddress(toStructuredAddressRecord(profile.address, profile));
      setNextInvoiceNumber(String(profile.nextInvoiceNumber || DEFAULT_INVOICE_NUMBER));
      setDefaultTaxEnabled(profile.defaultTaxEnabled);
      setDefaultTaxRate(String(profile.defaultTaxRate));
      setDefaultLaborRate(
        profile.defaultLaborRate === null ? '' : String(profile.defaultLaborRate)
      );
      setPaymentTerms(profile.paymentTerms);
      setCurrency(profile.currency);
      setTaxLabor(profile.taxLabor);
      setTaxMaterials(profile.taxMaterials);
      setShowJobAddress(profile.showJobAddress);
      setShowNotes(profile.showNotes);
      setIsLoading(false);
    };

    void loadDefaults();

    return () => {
      isActive = false;
    };
  }, [db, router]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step === 0) {
          return false;
        }

        setError('');
        setStep((currentStep) => (currentStep > 0 ? ((currentStep - 1) as Step) : currentStep));
        return true;
      });

      return () => subscription.remove();
    }, [step])
  );

  const normalizedPhone = normalizePhoneValue(phone);
  const businessStepValid = businessName.trim().length > 0 && isPhoneValid(normalizedPhone);
  const parsedInvoiceNumber = parseWholeNumber(nextInvoiceNumber);
  const parsedTaxRate = parseNumberValue(defaultTaxRate);
  const parsedLaborRate = parseOptionalNumberValue(defaultLaborRate);
  const invoiceStepValid =
    parsedInvoiceNumber !== null &&
    parsedTaxRate !== null &&
    parsedTaxRate >= 0 &&
    parsedTaxRate <= 100 &&
    parsedLaborRate !== undefined &&
    isCurrencyCode(currency);

  const goNext = () => {
    setError('');
    setStep((currentStep) => (currentStep < 3 ? ((currentStep + 1) as Step) : currentStep));
  };

  const goBack = () => {
    if (step === 0) {
      return;
    }

    setError('');
    setStep((currentStep) => (currentStep > 0 ? ((currentStep - 1) as Step) : currentStep));
  };

  const openLegalLink = React.useCallback((url: string) => {
    void Linking.openURL(url);
  }, []);

  const handleComplete = async () => {
    if (isSaving || !businessStepValid || !invoiceStepValid || parsedInvoiceNumber === null) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await completeBusinessOnboarding(db, {
        businessName: businessName.trim(),
        phone: normalizedPhone,
        email: email.trim(),
        address: address.trim(),
        street1: isStructuredAddressMatch(address, structuredAddress) ? structuredAddress.street1 : '',
        city: isStructuredAddressMatch(address, structuredAddress) ? structuredAddress.city : '',
        state: isStructuredAddressMatch(address, structuredAddress) ? structuredAddress.state : '',
        postalCode: isStructuredAddressMatch(address, structuredAddress)
          ? structuredAddress.postalCode
          : '',
        formattedAddress: address.trim(),
        nextInvoiceNumber: parsedInvoiceNumber,
        currency: currency.trim().toUpperCase(),
        defaultTaxEnabled,
        defaultTaxRate: parsedTaxRate ?? 0,
        defaultLaborRate: parsedLaborRate ?? null,
        paymentTerms: paymentTerms.trim() || DEFAULT_PAYMENT_TERMS,
        taxLabor,
        taxMaterials,
        showJobAddress,
        showNotes,
      });
      const savedProfile = await getBusinessProfile(db);
      const rawOnboardingFlag = await db.getFirstAsync<{ value: string | null }>(
        `SELECT value
         FROM settings
         WHERE key = 'onboarding_complete'
         LIMIT 1`
      );

      fieldBillDebugLog('onboarding.complete.saved', {
        businessName: businessName.trim(),
        nextInvoiceNumber: parsedInvoiceNumber,
        currency: currency.trim().toUpperCase(),
        onboardingComplete: savedProfile.onboardingComplete,
        rawOnboardingComplete: rawOnboardingFlag?.value ?? null,
      });

      router.replace('/start-job');
    } catch {
      setError('Could not save your setup. Try again.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingBlock}>
          <Text style={styles.loadingTitle}>Loading onboarding...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
            {step > 0 ? (
              <Pressable onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.backButtonSpacer} />
            )}
            <Text style={styles.progressText}>Step {step + 1} of 4</Text>
            </View>
            <Text style={styles.progressHint}>
              {step === 0
                ? 'A quick setup and you are ready to invoice.'
                : step === 1
                  ? 'Just the business basics customers need to see.'
                  : step === 2
                    ? 'Set defaults once so every invoice starts cleaner.'
                    : 'Review what customers will see before you begin.'}
            </Text>
          </View>

          {step === 0 ? (
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>FieldBill</Text>
              <Text style={styles.heroTitle}>Create clean field invoices fast</Text>
              <Text style={styles.heroSubtitle}>
                FieldBill helps contractors make simple, professional invoices without a long
                setup.
              </Text>

              <View style={styles.heroList}>
                <Text style={styles.heroPoint}>Start jobs fast.</Text>
                <Text style={styles.heroPoint}>Add labor and materials.</Text>
                <Text style={styles.heroPoint}>Send a clean invoice right after the job.</Text>
              </View>

              <View style={styles.legalLinks}>
                <Pressable onPress={() => openLegalLink(FieldBillLegal.privacyUrl)} style={styles.legalLink}>
                  <Text style={styles.legalLinkText}>Privacy Policy</Text>
                </Pressable>
                <Pressable onPress={() => openLegalLink(FieldBillLegal.termsUrl)} style={styles.legalLink}>
                  <Text style={styles.legalLinkText}>Terms</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Business Setup</Text>
              <Text style={styles.cardSubtitle}>Enter the basics customers will see.</Text>

              <LabeledInput
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Northside Electric"
              />
              <LabeledInput
                label="Phone"
                value={phone}
                onChangeText={(value) => setPhone(formatPhoneInput(value))}
                keyboardType="phone-pad"
                placeholder="(555) 555-1212"
              />
              <LabeledInput
                label="Email (Optional)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="office@example.com"
              />
              <View style={styles.field}>
                <Text style={styles.label}>Address (Optional)</Text>
                <AddressAutocompleteInput
                  value={address}
                  onChangeText={(value) => {
                    setAddress(value);
                    if (!isStructuredAddressMatch(value, structuredAddress)) {
                      setStructuredAddress(emptyStructuredAddress());
                    }
                  }}
                  onSelectAddress={(value) => {
                    setAddress(value.formattedAddress);
                    setStructuredAddress(value);
                  }}
                  autoCapitalize="words"
                  placeholder="123 Main St"
                  multiline
                  inputStyle={styles.tallInput}
                />
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Invoice Defaults</Text>
              <Text style={styles.cardSubtitle}>
                Set simple defaults now. You can change them later.
              </Text>

              <LabeledInput
                label="Next Invoice Number"
                value={nextInvoiceNumber}
                onChangeText={setNextInvoiceNumber}
                keyboardType="number-pad"
                placeholder="1001"
              />
              <LabeledInput
                label="Currency"
                value={currency}
                onChangeText={(value) => setCurrency(value.replace(/[^a-z]/gi, '').toUpperCase())}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={3}
                placeholder="USD"
              />
              <ToggleRow
                label="Default Tax"
                value={defaultTaxEnabled}
                onValueChange={setDefaultTaxEnabled}
              />
              <LabeledInput
                label="Default Tax Rate"
                value={defaultTaxRate}
                onChangeText={setDefaultTaxRate}
                keyboardType="decimal-pad"
                placeholder="0"
                editable={defaultTaxEnabled}
                style={!defaultTaxEnabled ? styles.inputDisabled : undefined}
              />
              <LabeledInput
                label="Default Labor Rate (Optional)"
                value={defaultLaborRate}
                onChangeText={setDefaultLaborRate}
                keyboardType="decimal-pad"
                placeholder="125"
              />
              <LabeledInput
                label="Payment Terms"
                value={paymentTerms}
                onChangeText={setPaymentTerms}
                placeholder="Due on receipt"
              />
              <ToggleRow label="Tax Labor" value={taxLabor} onValueChange={setTaxLabor} />
              <ToggleRow
                label="Tax Materials"
                value={taxMaterials}
                onValueChange={setTaxMaterials}
              />
              <ToggleRow
                label="Show Job Address"
                value={showJobAddress}
                onValueChange={setShowJobAddress}
              />
              <ToggleRow label="Show Notes" value={showNotes} onValueChange={setShowNotes} />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Ready</Text>
              <Text style={styles.cardSubtitle}>One more tap and the first invoice is ready.</Text>

              <View style={styles.summaryCard}>
                <SummaryRow label="Business" value={businessName.trim()} />
                <SummaryRow label="Phone" value={normalizedPhone} />
                <SummaryRow label="Email" value={email.trim() || 'Not shown'} />
                <SummaryRow label="Address" value={address.trim() || 'Not shown'} />
                <SummaryRow label="Invoice Start" value={`#${parsedInvoiceNumber ?? DEFAULT_INVOICE_NUMBER}`} />
                <SummaryRow label="Currency" value={currency.trim().toUpperCase() || DEFAULT_CURRENCY} />
                <SummaryRow
                  label="Tax"
                  value={formatTaxSummary(defaultTaxEnabled, parsedTaxRate ?? 0, taxLabor, taxMaterials)}
                />
                <SummaryRow
                  label="Labor Rate"
                  value={defaultLaborRate.trim() ? `$${defaultLaborRate.trim()}/hr` : 'Set per job'}
                />
                <SummaryRow label="Terms" value={paymentTerms.trim() || DEFAULT_PAYMENT_TERMS} />
                <SummaryRow
                  label="Invoice View"
                  value={`${showJobAddress ? 'Address on' : 'Address off'} • ${showNotes ? 'Notes on' : 'Notes off'}`}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {step === 0 ? (
            <>
              <FieldBillButton label="SET UP" onPress={goNext} primary />
              <Pressable onPress={goNext} style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Skip intro</Text>
              </Pressable>
            </>
          ) : null}

          {step === 1 ? (
            <FieldBillButton
              label="NEXT"
              onPress={goNext}
              primary
              disabled={!businessStepValid}
            />
          ) : null}

          {step === 2 ? (
            <FieldBillButton
              label="REVIEW"
              onPress={goNext}
              primary
              disabled={!invoiceStepValid}
            />
          ) : null}

          {step === 3 ? (
            <FieldBillButton
              label={isSaving ? 'SAVING...' : 'CREATE FIRST INVOICE'}
              onPress={() => void handleComplete()}
              primary
              disabled={isSaving || !businessStepValid || !invoiceStepValid}
            />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function LabeledInput({
  label,
  style,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#7b877c"
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.toggleValue}>{value ? 'On' : 'Off'}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#c8c1b3', true: '#5f8b68' }}
        thumbColor={FieldBillColors.surface}
      />
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function normalizePhoneValue(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('1')) {
    const local = digits.slice(1);
    return `+1 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6, 10)}`;
  }

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  return `+${digits}`;
}

function formatPhoneInput(value: string): string {
  return normalizePhoneValue(value);
}

function isPhoneValid(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function parseWholeNumber(value: string): number | null {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue >= 1 ? parsedValue : null;
}

function parseNumberValue(value: string): number | null {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseOptionalNumberValue(value: string): number | null | undefined {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function isCurrencyCode(value: string): boolean {
  return /^[A-Z]{3}$/.test(value.trim().toUpperCase());
}

function formatTaxSummary(
  defaultTaxEnabled: boolean,
  taxRate: number,
  taxLabor: boolean,
  taxMaterials: boolean
): string {
  if (!defaultTaxEnabled) {
    return 'Off by default';
  }

  const targets = [taxLabor ? 'labor' : '', taxMaterials ? 'materials' : ''].filter(Boolean);
  return targets.length > 0 ? `${taxRate}% on ${targets.join(' + ')}` : `${taxRate}% with no taxable items`;
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
    paddingTop: 20,
    paddingBottom: 150,
    gap: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  progressCard: {
    borderRadius: 20,
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    padding: 16,
    gap: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
  },
  progressHint: {
    fontSize: 16,
    lineHeight: 22,
    color: FieldBillColors.text,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  backButtonSpacer: {
    width: 52,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: FieldBillColors.primaryStrong,
  },
  heroCard: {
    backgroundColor: '#e7efe6',
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: FieldBillColors.primaryStrong,
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  heroSubtitle: {
    fontSize: 19,
    lineHeight: 28,
    color: FieldBillColors.mutedText,
  },
  heroList: {
    gap: 8,
    paddingTop: 8,
  },
  heroPoint: {
    fontSize: 18,
    color: FieldBillColors.text,
  },
  legalLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
  },
  legalLink: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  legalLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: FieldBillColors.primaryStrong,
  },
  formCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 16,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  cardSubtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: FieldBillColors.mutedText,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: FieldBillColors.mutedText,
  },
  input: {
    minHeight: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 21,
    color: FieldBillColors.text,
  },
  inputDisabled: {
    opacity: 0.55,
  },
  tallInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  toggleRow: {
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  toggleValue: {
    fontSize: 18,
    color: FieldBillColors.text,
  },
  summaryCard: {
    borderRadius: 18,
    backgroundColor: '#f0eadf',
    padding: 18,
    gap: 14,
  },
  summaryRow: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: FieldBillColors.mutedText,
  },
  summaryValue: {
    fontSize: 18,
    lineHeight: 25,
    color: FieldBillColors.text,
  },
  footer: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: FieldBillColors.background,
  },
  secondaryAction: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  secondaryActionText: {
    fontSize: 16,
    color: FieldBillColors.mutedText,
  },
  errorText: {
    fontSize: 16,
    color: '#8a2d2d',
  },
  loadingBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    color: FieldBillColors.mutedText,
  },
});
