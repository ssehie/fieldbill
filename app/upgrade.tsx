import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillBilling } from '@/lib/fieldbill-billing';
import { countInvoices } from '@/lib/fieldbill-db';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import {
  FIELD_BILL_FREE_INVOICE_LIMIT,
  getFreeInvoicesRemaining,
  needsProToCreateInvoice,
} from '@/lib/fieldbill-monetization';

export default function UpgradeScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const {
    isReady,
    isConfigured,
    isBillingEnabled,
    canGateInvoices,
    hasProAccess,
    priceLabel,
    packageToPurchase,
    error,
    isPurchasing,
    isRestoring,
    refresh,
    purchasePro,
    restorePurchases,
  } = useFieldBillBilling();
  const [invoiceCount, setInvoiceCount] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadUpgradeState = async () => {
        const [nextInvoiceCount] = await Promise.all([countInvoices(db), refresh()]);

        if (!isActive) {
          return;
        }

        setInvoiceCount(nextInvoiceCount);
      };

      void loadUpgradeState();

      return () => {
        isActive = false;
      };
    }, [db, refresh])
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

  const freeInvoicesRemaining = getFreeInvoicesRemaining(invoiceCount);
  const invoiceLimitReached = canGateInvoices && needsProToCreateInvoice(invoiceCount, hasProAccess);
  const purchaseUnavailable = !hasProAccess && (!isBillingEnabled || !packageToPurchase);
  const monetizationUnavailable = !hasProAccess && !isConfigured;

  const handlePurchase = async () => {
    const unlocked = await purchasePro();

    if (unlocked && router.canGoBack()) {
      router.back();
    }
  };

  const handleRestore = async () => {
    const restored = await restorePurchases();

    if (restored && router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>FieldBill Pro</Text>
          <Text style={styles.title}>
            {hasProAccess
              ? 'Unlimited invoices are unlocked.'
              : monetizationUnavailable
                ? 'FieldBill is free in this build.'
                : 'Keep invoicing without a subscription.'}
          </Text>
          <Text style={styles.body}>
            {hasProAccess
              ? 'This device already has Pro access. You can create as many invoices as you need.'
              : monetizationUnavailable
                ? 'The paid unlock is not enabled for this release, so invoice creation stays open while the store product is prepared.'
              : `Your first ${FIELD_BILL_FREE_INVOICE_LIMIT} invoices are free. Unlock unlimited invoices with one payment.`}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Invoices Created</Text>
            <Text style={styles.statusValue}>{invoiceCount}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Free Invoices Left</Text>
            <Text style={styles.statusValue}>{freeInvoicesRemaining}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Pro Unlock</Text>
            <Text style={styles.statusValue}>
              {hasProAccess ? 'Active' : monetizationUnavailable ? 'Not enabled' : priceLabel}
            </Text>
          </View>
        </View>

        {!hasProAccess && !monetizationUnavailable ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>
              {invoiceLimitReached ? 'You have used the free trial.' : 'You can unlock Pro any time.'}
            </Text>
            <Text style={styles.noteText}>
              {invoiceLimitReached
                ? 'Unlock Pro to create the next invoice. Your active job stays in place until you are ready.'
                : 'Unlock once and keep every future invoice, without a monthly plan.'}
            </Text>
          </View>
        ) : null}

        {purchaseUnavailable && !monetizationUnavailable ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Purchases are not ready yet.</Text>
            <Text style={styles.noteText}>
              You can keep creating invoices in this test build. Add the RevenueCat key and product before testing payment.
            </Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          {!hasProAccess && !monetizationUnavailable ? (
            <FieldBillButton
              label={isPurchasing ? 'Unlocking...' : `Unlock Pro ${priceLabel}`}
              detail="One-time purchase for unlimited invoices."
              onPress={() => void handlePurchase()}
              primary
              disabled={!isReady || !isBillingEnabled || !packageToPurchase || isPurchasing || isRestoring}
            />
          ) : null}

          {!monetizationUnavailable ? (
            <FieldBillButton
              label={isRestoring ? 'Restoring...' : 'Restore Purchase'}
              detail="Use this if you already bought Pro on this store account."
              onPress={() => void handleRestore()}
              disabled={!isReady || !isBillingEnabled || isPurchasing || isRestoring}
            />
          ) : null}

          <FieldBillButton
            label={hasProAccess ? 'Back' : invoiceLimitReached ? 'Maybe Later' : 'Keep Free Trial'}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }

              router.replace('/');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FieldBillColors.background,
  },
  content: {
    paddingHorizontal: FieldBillSpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },
  heroCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 24,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
  },
  kicker: {
    fontSize: 15,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  body: {
    fontSize: 18,
    lineHeight: 26,
    color: FieldBillColors.mutedText,
  },
  statusCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: FieldBillColors.mutedText,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 18,
    color: FieldBillColors.text,
    fontWeight: '800',
  },
  noteCard: {
    backgroundColor: '#efe8d7',
    borderRadius: 20,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: '#d8ccb2',
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 23,
    color: FieldBillColors.mutedText,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#8a2d2d',
  },
  actions: {
    gap: FieldBillSpacing.buttonGap,
  },
});
