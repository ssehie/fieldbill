import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  getActiveJob,
  getBusinessProfile,
  getJobAudioNote,
  getPartsSubtotalForJob,
  type JobAudioNoteRecord,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatDurationMillis, formatElapsed, formatHours, formatMoney } from '@/lib/fieldbill-format';
import { getElapsedHours, getLaborTotal, roundMoney } from '@/lib/fieldbill-math';

export default function ActiveJobScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const [job, setJob] = React.useState<JobRecord | null>(null);
  const [audioNote, setAudioNote] = React.useState<JobAudioNoteRecord | null>(null);
  const [currency, setCurrency] = React.useState('USD');
  const [partsSubtotal, setPartsSubtotal] = React.useState(0);
  const [now, setNow] = React.useState(Date.now());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isStopping, setIsStopping] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadJob = async () => {
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
          setIsLoading(false);
          return;
        }

        const [nextPartsSubtotal, nextAudioNote] = await Promise.all([
          getPartsSubtotalForJob(db, activeJob.id),
          getJobAudioNote(db, activeJob.id),
        ]);

        if (!isActive) {
          return;
        }

        setJob(activeJob);
        setPartsSubtotal(nextPartsSubtotal);
        setAudioNote(nextAudioNote);
        setCurrency(businessProfile.currency);
        setIsLoading(false);
        fieldBillDebugLog('active-job.focus', {
          jobId: activeJob.id,
          hasAudioNote: Boolean(nextAudioNote),
          partsSubtotal: nextPartsSubtotal,
        });
      };

      void loadJob();

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

        fieldBillDebugLog('active-job.back.home');
        router.replace('/');
        return true;
      });

      return () => subscription.remove();
    }, [router])
  );

  React.useEffect(() => {
    if (!job) {
      return;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [job]);

  const handleStopJob = async () => {
    if (!job || isStopping) {
      return;
    }

    setIsStopping(true);
    router.push('/finish-job');
    setIsStopping(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading job...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No active job.</Text>
          <Text style={styles.emptyText}>Start a new one from home.</Text>
          <FieldBillButton label="GO HOME" onPress={() => router.replace('/')} primary />
        </View>
      </SafeAreaView>
    );
  }

  const laborHours = getElapsedHours(job.start_time, now);
  const laborTotal = getLaborTotal(job.hourly_rate, laborHours);
  const totalSoFar = roundMoney(laborTotal + partsSubtotal);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.jobCard}>
          <Text style={styles.kicker}>On the clock</Text>
          <Text style={styles.customerName}>{job.customer_name}</Text>
          <Text style={styles.address}>{job.address}</Text>
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.infoLabel}>Elapsed</Text>
          <Text style={styles.elapsedValue}>{formatElapsed(job.start_time, now)}</Text>
          <Text style={styles.timerSupport}>{formatMoney(job.hourly_rate, currency)}/hr</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryTile}>
            <Text style={styles.infoLabel}>Labor</Text>
            <Text style={styles.infoValue}>
              {formatMoney(laborTotal, currency)} ({formatHours(laborHours)})
            </Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.infoLabel}>Parts</Text>
            <Text style={styles.infoValue}>{formatMoney(partsSubtotal, currency)}</Text>
          </View>
          <View style={[styles.summaryTile, styles.totalTile]}>
            <Text style={styles.infoLabel}>Total So Far</Text>
            <Text style={styles.totalValue}>{formatMoney(totalSoFar, currency)}</Text>
          </View>
          <View style={styles.summaryTile}>
            <Text style={styles.infoLabel}>Audio Note</Text>
            <Text style={styles.infoValue}>
              {audioNote
                ? `Saved${audioNote.duration_ms ? ` • ${formatDurationMillis(audioNote.duration_ms)}` : ''}`
                : 'No note yet'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <FieldBillButton label="ADD PART" onPress={() => router.push('/add-part')} />
          <FieldBillButton
            label="TALK NOTE"
            detail="Capture the work details while you're still on site."
            onPress={() => router.push('/talk-note')}
          />
          <FieldBillButton
            label={isStopping ? 'STOPPING...' : 'STOP JOB'}
            onPress={() => void handleStopJob()}
            primary
            disabled={isStopping}
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
    paddingBottom: 24,
    gap: 18,
  },
  jobCard: {
    backgroundColor: FieldBillColors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    gap: 10,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    color: FieldBillColors.mutedText,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 30,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  address: {
    fontSize: 20,
    lineHeight: 28,
    color: FieldBillColors.mutedText,
  },
  timerCard: {
    backgroundColor: '#1f472b',
    borderRadius: 22,
    padding: 20,
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: FieldBillColors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: FieldBillColors.text,
  },
  timerSupport: {
    fontSize: 18,
    lineHeight: 26,
    color: '#d7e7d8',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryTile: {
    minWidth: 150,
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#f0eadf',
    padding: 18,
    gap: 6,
  },
  totalTile: {
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
  },
  elapsedValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fffdf7',
    letterSpacing: -1,
  },
  totalValue: {
    fontSize: 34,
    fontWeight: '800',
    color: FieldBillColors.primaryStrong,
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
