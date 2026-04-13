import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { formatStructuredAddressLines } from '@/lib/address';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import { listInvoiceHistory, type InvoiceSummary } from '@/lib/fieldbill-db';
import { formatDate, formatMoney } from '@/lib/fieldbill-format';

export default function HistoryScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const [invoices, setInvoices] = React.useState<InvoiceSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        setIsLoading(true);
        const items = await listInvoiceHistory(db);

        if (!isActive) {
          return;
        }

        setInvoices(items);
        setIsLoading(false);
        fieldBillDebugLog('history.focus', {
          invoices: items.length,
        });
      };

      void loadHistory();

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

        fieldBillDebugLog('history.back.home');
        router.replace('/');
        return true;
      });

      return () => subscription.remove();
    }, [router])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={styles.emptyText}>Loading invoices...</Text>
        ) : invoices.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>No invoices yet.</Text>
            <Text style={styles.emptyText}>Finished invoices show up here.</Text>
            <FieldBillButton label="START JOB" onPress={() => router.push('/start-job')} primary />
          </View>
        ) : (
          invoices.map((invoice) => (
            <InvoiceHistoryCard
              key={invoice.id}
              invoice={invoice}
              onPress={() =>
                router.push({
                  pathname: '/send-last-bill',
                  params: { invoiceId: invoice.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatStatus(status: InvoiceSummary['status']): string {
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

function InvoiceHistoryCard({
  invoice,
  onPress,
}: {
  invoice: InvoiceSummary;
  onPress: () => void;
}) {
  const addressLines = formatStructuredAddressLines({
    formattedAddress: invoice.address,
    street1: invoice.street1,
    city: invoice.city,
    state: invoice.state,
    postalCode: invoice.postal_code,
  });

  return (
    <Pressable onPress={onPress} style={styles.invoiceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerBlock}>
          <Text style={styles.metaLabel}>Invoice</Text>
          <Text style={styles.invoiceNumber}>{invoice.invoice_number ?? 'Pending'}</Text>
        </View>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{formatStatus(invoice.status)}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{invoice.customer_name}</Text>
      {addressLines[0] ? <Text style={styles.addressText}>{addressLines[0]}</Text> : null}

      <View style={styles.footerRow}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.footerValue}>{formatDate(invoice.created_at)}</Text>
        </View>
        <View style={styles.totalPill}>
          <Text style={styles.totalPillLabel}>Total</Text>
          <Text style={styles.totalPillValue}>{formatMoney(invoice.total, invoice.currency)}</Text>
        </View>
      </View>
    </Pressable>
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
    gap: 16,
  },
  invoiceCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerBlock: {
    gap: 4,
    flex: 1,
  },
  customerName: {
    fontSize: 26,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  addressText: {
    fontSize: 17,
    color: FieldBillColors.mutedText,
    lineHeight: 24,
  },
  metaRow: {
    gap: 4,
  },
  metaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  statusChip: {
    borderRadius: 999,
    backgroundColor: '#e6efe4',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: FieldBillColors.primaryStrong,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  totalPill: {
    borderRadius: 18,
    backgroundColor: '#f1eadf',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'flex-end',
    gap: 2,
  },
  totalPillLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  totalPillValue: {
    fontSize: 19,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  emptyBlock: {
    gap: 16,
    paddingTop: 12,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  emptyText: {
    fontSize: 18,
    color: FieldBillColors.mutedText,
    lineHeight: 26,
  },
});
