import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import {
  deleteJobAudioNote,
  getActiveJob,
  getJobAudioNote,
  saveJobAudioNote,
  type JobAudioNoteRecord,
  type JobRecord,
} from '@/lib/fieldbill-db';
import { formatDurationMillis } from '@/lib/fieldbill-format';

type DraftRecording = {
  fileUri: string;
  durationMs: number | null;
};

export default function TalkNoteScreen() {
  const db = useFieldBillDb();
  const router = useRouter();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [job, setJob] = React.useState<JobRecord | null>(null);
  const [savedAudioNote, setSavedAudioNote] = React.useState<JobAudioNoteRecord | null>(null);
  const [draftRecording, setDraftRecording] = React.useState<DraftRecording | null>(null);
  const [isReplacingSaved, setIsReplacingSaved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isStarting, setIsStarting] = React.useState(false);
  const [isStopping, setIsStopping] = React.useState(false);
  const [permissionBlocked, setPermissionBlocked] = React.useState(false);
  const [error, setError] = React.useState('');

  const savedPreview = !isReplacingSaved ? savedAudioNote : null;
  const previewRecording = draftRecording ?? savedPreview;
  const previewUri = draftRecording?.fileUri ?? savedPreview?.file_uri ?? null;
  const previewDurationMs = draftRecording?.durationMs ?? savedPreview?.duration_ms ?? null;
  const previewSource = previewUri ? { uri: previewUri } : null;
  const player = useAudioPlayer(previewSource);
  const playerStatus = useAudioPlayerStatus(player);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadAudioNote = async () => {
        setIsLoading(true);
        const activeJob = await getActiveJob(db);

        if (!isActive) {
          return;
        }

        if (!activeJob) {
          setJob(null);
          setSavedAudioNote(null);
          setDraftRecording(null);
          setIsReplacingSaved(false);
          setIsLoading(false);
          return;
        }

        const audioNote = await getJobAudioNote(db, activeJob.id);

        if (!isActive) {
          return;
        }

        setJob(activeJob);
        setSavedAudioNote(audioNote);
        setDraftRecording(null);
        setIsReplacingSaved(false);
        setPermissionBlocked(false);
        setError('');
        setIsLoading(false);
      };

      void loadAudioNote();

      return () => {
        isActive = false;
      };
    }, [db])
  );

  React.useEffect(() => {
    void setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
    }).catch(() => {});
  }, []);

  const ensureMicrophonePermission = async () => {
    const currentPermission = await getRecordingPermissionsAsync();

    if (currentPermission.granted) {
      setPermissionBlocked(false);
      return true;
    }

    const requestedPermission = await requestRecordingPermissionsAsync();
    const granted = requestedPermission.granted;

    setPermissionBlocked(!granted);

    if (!granted) {
      setError('Microphone permission is off. Open Settings, allow microphone access, then come back here.');
    }

    return granted;
  };

  const handleOpenSettings = async () => {
    setError('');

    try {
      await Linking.openSettings();
    } catch {
      setError('Could not open Settings. Open your phone settings and allow microphone access for FieldBill.');
    }
  };

  const pausePlayback = async () => {
    if (!playerStatus.isLoaded) {
      return;
    }

    try {
      player.pause();
      await player.seekTo(0);
    } catch {
      // Ignore playback cleanup errors while moving between note states.
    }
  };

  const handleStartRecording = async () => {
    if (!job || recorderState.isRecording || isStarting || isSaving || isDeleting || isStopping) {
      return;
    }

    setIsStarting(true);
    setError('');

    try {
      const hasPermission = await ensureMicrophonePermission();

      if (!hasPermission) {
        return;
      }

      await pausePlayback();
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setError('Could not start recording. Try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopRecording = async () => {
    if (!recorderState.isRecording || isStopping) {
      return;
    }

    setIsStopping(true);
    setError('');

    try {
      await recorder.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const stoppedState = recorder.getStatus();
      const nextUri = recorder.uri ?? stoppedState.url;

      if (!nextUri) {
        throw new Error('No recording created.');
      }

      setDraftRecording({
        fileUri: nextUri,
        durationMs: stoppedState.durationMillis || recorderState.durationMillis || null,
      });
    } catch {
      setError('Could not stop recording. Try again.');
    } finally {
      setIsStopping(false);
    }
  };

  const handlePlayRecording = async () => {
    if (!previewRecording || recorderState.isRecording) {
      setError('Make a recording first.');
      return;
    }

    setError('');

    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      if (!playerStatus.isLoaded) {
        setError(
          playerStatus.isBuffering
            ? 'Recording is getting ready. Try again in a moment.'
            : 'Recording file is missing. Make a new recording.'
        );
        return;
      }

      await player.seekTo(0);
      player.play();
    } catch {
      setError('Recording file is missing. Make a new recording.');
    }
  };

  const handleSaveAudioNote = async () => {
    if (!job || !draftRecording || isSaving || isDeleting) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const savedNote = await saveJobAudioNote(db, {
        jobId: job.id,
        fileUri: draftRecording.fileUri,
        durationMs: draftRecording.durationMs,
      });

      setSavedAudioNote(savedNote);
      setDraftRecording(null);
      setIsReplacingSaved(false);
    } catch {
      setError('Could not save the audio note. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReRecord = async () => {
    if (recorderState.isRecording || isSaving || isDeleting) {
      return;
    }

    await pausePlayback();
    setDraftRecording(null);
    setIsReplacingSaved(savedAudioNote !== null);
    setError('');
  };

  const handleDelete = async () => {
    if (!job || recorderState.isRecording || isDeleting || isSaving) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await pausePlayback();

      if (draftRecording) {
        setDraftRecording(null);
        setIsReplacingSaved(false);
        return;
      }

      if (savedAudioNote) {
        await deleteJobAudioNote(db, job.id);
        setSavedAudioNote(null);
        setIsReplacingSaved(false);
      }
    } catch {
      setError('Could not delete the audio note. Try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading audio note...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No active job.</Text>
          <Text style={styles.emptyText}>Start a job before recording a note.</Text>
          <FieldBillButton label="GO HOME" onPress={() => router.replace('/')} primary />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Job Audio Note</Text>
          <Text style={styles.title}>Talk Note</Text>
          <Text style={styles.statusText}>
            {getStatusText({
              permissionBlocked,
              isRecording: recorderState.isRecording,
              isSaving,
              hasDraftRecording: draftRecording !== null,
              hasSavedAudioNote: savedAudioNote !== null && !isReplacingSaved,
            })}
          </Text>
          <Text style={styles.helperText}>
            {getHelperText({
              previewDurationMs,
              isRecording: recorderState.isRecording,
              recordingDurationMs: recorderState.durationMillis,
            })}
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {permissionBlocked ? (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Microphone access is off</Text>
            <Text style={styles.permissionText}>
              FieldBill can still finish the job without audio. To save a talk note, allow microphone
              access in Settings and return to this screen.
            </Text>
            <FieldBillButton label="OPEN SETTINGS" onPress={() => void handleOpenSettings()} />
          </View>
        ) : null}

        <View style={styles.stateCard}>
          <Text style={styles.stateLabel}>Current State</Text>
          <Text style={styles.stateValue}>
            {recorderState.isRecording
              ? 'Recording live'
              : draftRecording
                ? 'Draft recorded'
                : savedAudioNote && !isReplacingSaved
                  ? 'Saved note ready'
                  : 'No note saved'}
          </Text>
        </View>

        <View style={styles.actions}>
          {!recorderState.isRecording && (!savedAudioNote || isReplacingSaved) ? (
            <FieldBillButton
              label={isStarting ? 'STARTING...' : 'START RECORDING'}
              onPress={() => void handleStartRecording()}
              primary
              disabled={isStarting || isSaving || isDeleting}
            />
          ) : null}

          {recorderState.isRecording ? (
            <FieldBillButton
              label={isStopping ? 'STOPPING...' : 'STOP RECORDING'}
              onPress={() => void handleStopRecording()}
              primary
              disabled={isStopping}
            />
          ) : null}

          {previewRecording ? (
            <FieldBillButton
              label={playerStatus.playing ? 'PLAYING...' : 'PLAY RECORDING'}
              onPress={() => void handlePlayRecording()}
              disabled={isSaving || isDeleting}
            />
          ) : null}

          {draftRecording ? (
            <FieldBillButton
              label={isSaving ? 'SAVING...' : 'SAVE AUDIO NOTE'}
              onPress={() => void handleSaveAudioNote()}
              disabled={isSaving || isDeleting}
            />
          ) : null}

          {(draftRecording || savedAudioNote) && !recorderState.isRecording ? (
            <FieldBillButton
              label="RE-RECORD"
              onPress={() => void handleReRecord()}
              disabled={isSaving || isDeleting}
            />
          ) : null}

          {(draftRecording || savedAudioNote) && !recorderState.isRecording ? (
            <FieldBillButton
              label={isDeleting ? 'DELETING...' : 'DELETE'}
              onPress={() => void handleDelete()}
              disabled={isSaving || isDeleting}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusText(input: {
  permissionBlocked: boolean;
  isRecording: boolean;
  isSaving: boolean;
  hasDraftRecording: boolean;
  hasSavedAudioNote: boolean;
}) {
  if (input.isRecording) {
    return 'Recording...';
  }

  if (input.isSaving) {
    return 'Saving...';
  }

  if (input.hasDraftRecording) {
    return 'Recorded, ready to save';
  }

  if (input.hasSavedAudioNote) {
    return 'Saved';
  }

  if (input.permissionBlocked) {
    return 'Microphone permission needed';
  }

  return 'Ready to record';
}

function getHelperText(input: {
  previewDurationMs: number | null;
  isRecording: boolean;
  recordingDurationMs: number;
}) {
  if (input.isRecording) {
    return `Recording length ${formatDurationMillis(input.recordingDurationMs)}`;
  }

  if (input.previewDurationMs && input.previewDurationMs > 0) {
    return `Length ${formatDurationMillis(input.previewDurationMs)}`;
  }

  return 'One audio note per job.';
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
  headerCard: {
    backgroundColor: '#e7efe6',
    borderRadius: 22,
    padding: 20,
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: FieldBillColors.primaryStrong,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '700',
    color: FieldBillColors.primaryStrong,
  },
  helperText: {
    minHeight: 24,
    fontSize: 18,
    color: FieldBillColors.mutedText,
  },
  stateCard: {
    borderRadius: 20,
    backgroundColor: FieldBillColors.surface,
    borderWidth: 1,
    borderColor: FieldBillColors.border,
    padding: 18,
    gap: 6,
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: FieldBillColors.mutedText,
  },
  stateValue: {
    fontSize: 24,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  actions: {
    gap: FieldBillSpacing.buttonGap,
  },
  permissionCard: {
    borderRadius: 20,
    backgroundColor: '#fff8df',
    borderWidth: 1,
    borderColor: '#e3c761',
    padding: 18,
    gap: 10,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: FieldBillColors.text,
  },
  permissionText: {
    fontSize: 16,
    lineHeight: 22,
    color: FieldBillColors.mutedText,
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
});
