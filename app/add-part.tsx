import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  createPart,
  deletePart,
  getActiveJob,
  getPartForJob,
  updatePart,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatMoney } from '@/lib/fieldbill-format';

const QUICK_PARTS = ['Outlet', 'GFCI', 'Breaker', 'Switch', 'Wire', 'Service Call'];

export default function AddPartScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const params = useLocalSearchParams<{ partId?: string }>();
  const partId = typeof params.partId === 'string' ? params.partId : '';
  const isEditing = Boolean(partId);
  const hasSubmittedRef = React.useRef(false);
  const [job, setJob] = React.useState<JobRecord | null>(null);
  const [partName, setPartName] = React.useState('');
  const [quantity, setQuantity] = React.useState('1');
  const [unitPrice, setUnitPrice] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;

    const loadJob = async () => {
      const activeJob = await getActiveJob(db);

      if (!isActive) {
        return;
      }

      setJob(activeJob);
      if (activeJob && partId) {
        const part = await getPartForJob(db, activeJob.id, partId);

        if (!isActive) {
          return;
        }

        if (!part) {
          setError('That part is not on the active job anymore.');
          return;
        }

        setPartName(part.name);
        setQuantity(String(part.quantity));
        setUnitPrice(String(part.unit_price));
      } else if (!partId) {
        setPartName('');
        setQuantity('1');
        setUnitPrice('');
        setError('');
      }
      fieldBillDebugLog('add-part.focus', {
        jobId: activeJob?.id ?? null,
        hasActiveJob: Boolean(activeJob),
        editPartId: partId || null,
      });
    };

    void loadJob();

    return () => {
      isActive = false;
    };
  }, [db, partId]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (router.canGoBack()) {
          return false;
        }

        fieldBillDebugLog('add-part.back.active-job');
        router.replace('/active-job');
        return true;
      });

      return () => subscription.remove();
    }, [router])
  );

  const handleSavePart = async () => {
    if (!job || isSaving || hasSubmittedRef.current) {
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedUnitPrice = Number(unitPrice);

    if (!partName.trim()) {
      setError('Enter part name.');
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError('Enter a good quantity.');
      return;
    }

    if (!Number.isFinite(parsedUnitPrice) || parsedUnitPrice < 0) {
      setError('Enter a good unit price.');
      return;
    }

    setError('');
    hasSubmittedRef.current = true;
    setIsSaving(true);

    try {
      if (isEditing) {
        const updatedPart = await updatePart(db, {
          jobId: job.id,
          partId,
          name: partName,
          quantity: parsedQuantity,
          unitPrice: parsedUnitPrice,
        });

        if (!updatedPart) {
          throw new Error('Part not updated.');
        }
      } else {
        await createPart(db, {
          jobId: job.id,
          name: partName,
          quantity: parsedQuantity,
          unitPrice: parsedUnitPrice,
        });
      }

      router.replace('/active-job');
    } catch {
      hasSubmittedRef.current = false;
      setError("Couldn't save part.");
      setIsSaving(false);
    }
  };

  const deletePartNow = async () => {
    if (!job || !partId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deletePart(db, job.id, partId);
      router.replace('/active-job');
    } catch {
      setError("Couldn't delete part.");
      setIsDeleting(false);
    }
  };

  const handleDeletePart = () => {
    Alert.alert('Delete part?', 'Remove this part from the active job.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deletePartNow();
        },
      },
    ]);
  };

  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No active job.</Text>
          <Text style={styles.emptyText}>Start a job before adding parts.</Text>
          <FieldBillButton label="GO HOME" onPress={() => router.replace('/')} primary />
        </View>
      </SafeAreaView>
    );
  }

  const parsedQuantity = Number(quantity || '0');
  const parsedUnitPrice = Number(unitPrice || '0');
  const lineTotal =
    Number.isFinite(parsedQuantity) && Number.isFinite(parsedUnitPrice)
      ? parsedQuantity * parsedUnitPrice
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit Part' : 'Add Part'}</Text>
            <Text style={styles.subtitle}>{job.customer_name}</Text>
          </View>

          <View style={styles.quickAddCard}>
            <Text style={styles.quickAddTitle}>Quick Add</Text>
            <View style={styles.quickAddGrid}>
              {QUICK_PARTS.map((part) => (
                <Pressable key={part} onPress={() => setPartName(part)} style={styles.quickAddButton}>
                  <Text style={styles.quickAddButtonText}>{part}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Part Name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                placeholder="Part name"
                placeholderTextColor="#7b877c"
                style={styles.input}
                value={partName}
                onChangeText={setPartName}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, styles.compactField]}>
                <Text style={styles.label}>Qty</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="1"
                  placeholderTextColor="#7b877c"
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.field, styles.compactField]}>
                <Text style={styles.label}>Unit Price</Text>
                <TextInput
                  blurOnSubmit
                  keyboardType="decimal-pad"
                  onSubmitEditing={() => void handleSavePart()}
                  placeholder="0"
                  placeholderTextColor="#7b877c"
                  returnKeyType="done"
                  style={styles.input}
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                />
              </View>
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Line Total</Text>
              <Text style={styles.totalValue}>{formatMoney(lineTotal, 'USD')}</Text>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <FieldBillButton
            label={isSaving ? 'SAVING...' : isEditing ? 'SAVE CHANGES' : 'SAVE PART'}
            onPress={() => void handleSavePart()}
            primary
            disabled={isSaving || isDeleting}
          />
          {isEditing ? (
            <Pressable
              disabled={isSaving || isDeleting}
              onPress={handleDeletePart}
              style={[styles.deleteButton, (isSaving || isDeleting) && styles.deleteButtonDisabled]}>
              <Text style={styles.deleteButtonText}>{isDeleting ? 'DELETING...' : 'DELETE PART'}</Text>
            </Pressable>
          ) : null}
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
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: FieldBillColors.background,
    gap: 10,
  },
  header: {
    gap: 8,
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
  quickAddCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 12,
  },
  quickAddTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAddButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#edf3ee',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: FieldBillColors.primaryStrong,
  },
  form: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  compactField: {
    flex: 1,
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
  totalCard: {
    borderRadius: 18,
    backgroundColor: '#1f472b',
    padding: 18,
    gap: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#d6e6d7',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fffdf7',
  },
  errorText: {
    fontSize: 17,
    color: '#8a2d2d',
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
  deleteButton: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b96a5f',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FieldBillColors.surface,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#8a2d2d',
  },
});
