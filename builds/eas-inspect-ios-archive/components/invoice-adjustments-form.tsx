import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FieldBillColors } from '@/constants/fieldbill';

type InvoiceAdjustmentsFormProps = {
  laborHours: string;
  hourlyRate: string;
  discountAmount: string;
  taxPercent: string;
  onLaborHoursChange: (value: string) => void;
  onHourlyRateChange: (value: string) => void;
  onDiscountAmountChange: (value: string) => void;
  onTaxPercentChange: (value: string) => void;
};

export function InvoiceAdjustmentsForm({
  laborHours,
  hourlyRate,
  discountAmount,
  taxPercent,
  onLaborHoursChange,
  onHourlyRateChange,
  onDiscountAmountChange,
  onTaxPercentChange,
}: InvoiceAdjustmentsFormProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Adjust Invoice</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Labor Hours</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#7b877c"
          style={styles.input}
          value={laborHours}
          onChangeText={onLaborHoursChange}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Hourly Rate</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#7b877c"
          style={styles.input}
          value={hourlyRate}
          onChangeText={onHourlyRateChange}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Discount</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#7b877c"
          style={styles.input}
          value={discountAmount}
          onChangeText={onDiscountAmountChange}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tax Rate (%)</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#7b877c"
          style={styles.input}
          value={taxPercent}
          onChangeText={onTaxPercentChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 14,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
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
    backgroundColor: FieldBillColors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 22,
    color: FieldBillColors.text,
  },
});
