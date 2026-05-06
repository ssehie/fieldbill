import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressAutocompleteInput } from '@/components/address-autocomplete-input';
import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import {
  emptyStructuredAddress,
  isStructuredAddressMatch,
  toStructuredAddressRecord,
  type StructuredAddress,
} from '@/lib/address';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  createJob,
  DEFAULT_HOURLY_RATE,
  getActiveJob,
  getBusinessProfile,
  getMostRecentCustomerOption,
  isBusinessSetupComplete,
  listCustomers,
  listRecentCustomerOptions,
  saveCustomer,
  type CustomerRecord,
  type RecentCustomerOption,
} from '@/lib/fieldbill-db';
import { formatDate } from '@/lib/fieldbill-format';

type StartMode = 'saved' | 'new';

export default function StartJobScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  const [recentCustomers, setRecentCustomers] = React.useState<RecentCustomerOption[]>([]);
  const [lastCustomer, setLastCustomer] = React.useState<RecentCustomerOption | null>(null);
  const [businessDefaultHourlyRate, setBusinessDefaultHourlyRate] = React.useState(DEFAULT_HOURLY_RATE);
  const [mode, setMode] = React.useState<StartMode>('new');
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const [customerName, setCustomerName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [structuredAddress, setStructuredAddress] = React.useState<StructuredAddress>(
    emptyStructuredAddress()
  );
  const [hourlyRate, setHourlyRate] = React.useState(String(DEFAULT_HOURLY_RATE));
  const [error, setError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadCustomers = async () => {
        const [savedCustomers, recentOptions, mostRecentOption, businessProfile] = await Promise.all([
          listCustomers(db),
          listRecentCustomerOptions(db, 3),
          getMostRecentCustomerOption(db),
          getBusinessProfile(db),
        ]);

        fieldBillDebugLog('start-job.focus', {
          onboardingComplete: businessProfile.onboardingComplete,
          customers: savedCustomers.length,
          recentCustomers: recentOptions.length,
        });

        if (!isActive) {
          return;
        }

        if (!isBusinessSetupComplete(businessProfile)) {
          fieldBillDebugLog('start-job.redirect.setup', {
            onboardingComplete: businessProfile.onboardingComplete,
          });
          router.replace('/setup');
          return;
        }

        setCustomers(savedCustomers);
        setRecentCustomers(recentOptions);
        setLastCustomer(mostRecentOption);
        if (savedCustomers.length === 0) {
          setMode('new');
        }
        const defaultLaborRate = businessProfile.defaultLaborRate ?? DEFAULT_HOURLY_RATE;
        setBusinessDefaultHourlyRate(defaultLaborRate);
        setHourlyRate(String(defaultLaborRate));
      };

      void loadCustomers();

      return () => {
        isActive = false;
      };
    }, [db, router])
  );

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (router.canGoBack()) {
          return false;
        }

        router.replace('/');
        return true;
      });

      return () => subscription.remove();
    }, [router])
  );

  const applyCustomerValues = (customer: {
    customerName: string;
    address: string;
    structuredAddress?: StructuredAddress;
    hourlyRate: number;
  }) => {
    setCustomerName(customer.customerName);
    setAddress(customer.address);
    setStructuredAddress(toStructuredAddressRecord(customer.address, customer.structuredAddress));
    setHourlyRate(String(customer.hourlyRate));
    setError('');
  };

  const handleSelectCustomer = (customer: CustomerRecord) => {
    setMode('saved');
    setSelectedCustomerId(customer.id);
    applyCustomerValues({
      customerName: customer.name,
      address: customer.address,
      structuredAddress: {
        formattedAddress: customer.address,
        street1: customer.street1,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postal_code,
      },
      hourlyRate: customer.default_hourly_rate,
    });
  };

  const handleUseRecentCustomer = (customer: RecentCustomerOption) => {
    setMode('new');
    setSelectedCustomerId(null);
    applyCustomerValues({
      customerName: customer.customer_name,
      address: customer.address,
      structuredAddress: {
        formattedAddress: customer.address,
        street1: customer.street1,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postal_code,
      },
      hourlyRate: customer.hourly_rate,
    });
  };

  const handleNewCustomer = () => {
    setMode('new');
    setSelectedCustomerId(null);
    setCustomerName('');
    setAddress('');
    setStructuredAddress(emptyStructuredAddress());
    setHourlyRate(String(businessDefaultHourlyRate));
    setError('');
  };

  const handleStartJob = async () => {
    if (isSaving) {
      return;
    }

    const trimmedCustomerName = customerName.trim();
    const trimmedAddress = address.trim();
    const parsedHourlyRate = Number(hourlyRate);

    if (!trimmedCustomerName) {
      setError('Enter the customer name.');
      return;
    }

    if (!trimmedAddress) {
      setError('Enter the job address.');
      return;
    }

    if (!Number.isFinite(parsedHourlyRate) || parsedHourlyRate <= 0) {
      setError('Enter a valid hourly rate.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const currentActiveJob = await getActiveJob(db);

      if (currentActiveJob) {
        router.replace('/active-job');
        return;
      }

      await saveCustomer(db, {
        name: trimmedCustomerName,
        address: trimmedAddress,
        structuredAddress: isStructuredAddressMatch(trimmedAddress, structuredAddress)
          ? structuredAddress
          : undefined,
        defaultHourlyRate: parsedHourlyRate,
      });

      await createJob(db, {
        customerName: trimmedCustomerName,
        address: trimmedAddress,
        structuredAddress: isStructuredAddressMatch(trimmedAddress, structuredAddress)
          ? structuredAddress
          : undefined,
        hourlyRate: parsedHourlyRate,
      });

      router.replace('/active-job');
    } catch {
      setError("Couldn't start the job.");
      setIsSaving(false);
    }
  };

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
          <View style={styles.header}>
            <Text style={styles.title}>Start Job</Text>
            <Text style={styles.subtitle}>Pick someone you know or type a new one and go.</Text>
          </View>

          {lastCustomer ? (
            <Pressable onPress={() => handleUseRecentCustomer(lastCustomer)} style={styles.lastJobCard}>
              <Text style={styles.lastJobLabel}>Use Last Customer</Text>
              <Text style={styles.lastJobName}>{lastCustomer.customer_name}</Text>
              <Text style={styles.lastJobDetail}>{lastCustomer.address}</Text>
              <Text style={styles.lastJobDetail}>
                Last used {formatDate(lastCustomer.last_job_at)} at {lastCustomer.hourly_rate}/hr
              </Text>
            </Pressable>
          ) : null}

          {customers.length > 0 ? (
            <View style={styles.existingCard}>
              <Text style={styles.sectionLabel}>Choose Existing Customer</Text>
              {recentCustomers.slice(0, 3).map((customer) => (
                <Pressable
                  key={`${customer.customer_name}-${customer.address}-${customer.last_job_at}`}
                  onPress={() => handleUseRecentCustomer(customer)}
                  style={styles.recentButton}>
                  <Text style={styles.recentButtonTitle}>{customer.customer_name}</Text>
                  <Text style={styles.recentButtonDetail}>{customer.address}</Text>
                </Pressable>
              ))}

              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setMode('saved')}
                  style={[styles.modeButton, mode === 'saved' && styles.modeButtonActive]}>
                  <Text
                    style={[styles.modeButtonText, mode === 'saved' && styles.modeButtonTextActive]}>
                    Saved Customers
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleNewCustomer}
                  style={[styles.modeButton, mode === 'new' && styles.modeButtonActive]}>
                  <Text style={[styles.modeButtonText, mode === 'new' && styles.modeButtonTextActive]}>
                    New Customer
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {mode === 'saved' ? (
            <View style={styles.savedSection}>
              {customers.length === 0 ? (
                <Text style={styles.savedEmptyText}>No saved customers yet. Start with a new customer.</Text>
              ) : (
                customers.map((customer) => (
                  <Pressable
                    key={customer.id}
                    onPress={() => handleSelectCustomer(customer)}
                    style={[
                      styles.customerButton,
                      selectedCustomerId === customer.id && styles.customerButtonActive,
                    ]}>
                    <Text style={styles.customerButtonTitle}>{customer.name}</Text>
                    <Text style={styles.customerButtonDetail}>{customer.address}</Text>
                    <Text style={styles.customerButtonDetail}>
                      Default rate {customer.default_hourly_rate}/hr
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Customer Name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Customer name"
                placeholderTextColor="#7b877c"
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <AddressAutocompleteInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Job address"
                placeholderTextColor="#7b877c"
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
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Hourly Rate</Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="125"
                placeholderTextColor="#7b877c"
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <FieldBillButton
            label={isSaving ? 'STARTING...' : 'START JOB'}
            onPress={() => void handleStartJob()}
            primary
            disabled={isSaving}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    paddingBottom: 140,
    gap: 18,
  },
  footer: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingBottom: 24,
    gap: 10,
    backgroundColor: FieldBillColors.background,
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  subtitle: {
    fontSize: 19,
    color: FieldBillColors.mutedText,
  },
  existingCard: {
    borderRadius: 22,
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    padding: 16,
    gap: 12,
  },
  lastJobCard: {
    borderRadius: 22,
    backgroundColor: '#f0eadf',
    padding: 20,
    gap: 6,
  },
  lastJobLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  lastJobName: {
    fontSize: 28,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  lastJobDetail: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
  },
  recentSection: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  recentButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    padding: 16,
    gap: 2,
  },
  recentButtonTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  recentButtonDetail: {
    fontSize: 16,
    color: FieldBillColors.mutedText,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modeButtonActive: {
    backgroundColor: FieldBillColors.primaryStrong,
    borderColor: FieldBillColors.primaryStrong,
  },
  modeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: FieldBillColors.text,
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: FieldBillColors.background,
  },
  savedSection: {
    gap: 12,
  },
  savedEmptyText: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
  },
  customerButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    padding: 18,
    gap: 4,
  },
  customerButtonActive: {
    borderColor: FieldBillColors.primaryStrong,
    backgroundColor: '#edf3ee',
  },
  customerButtonTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  customerButtonDetail: {
    fontSize: 17,
    color: FieldBillColors.mutedText,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  input: {
    minHeight: 68,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    backgroundColor: FieldBillColors.surface,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 24,
    color: FieldBillColors.text,
  },
  tallInput: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 17,
    color: '#8a2d2d',
  },
});
