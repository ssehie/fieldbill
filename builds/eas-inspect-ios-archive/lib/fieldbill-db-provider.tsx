import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldBillButton } from '@/components/fieldbill-button';
import { FieldBillColors, FieldBillSpacing } from '@/constants/fieldbill';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import { initializeDatabase } from '@/lib/fieldbill-db';

type DatabaseBootstrapPhase = 'idle' | 'opening' | 'initializing' | 'ready' | 'error';

type DatabaseBootstrapError = Error & {
  phase: Exclude<DatabaseBootstrapPhase, 'idle' | 'ready'>;
};

type DatabaseBootstrapSnapshot = {
  phase: DatabaseBootstrapPhase;
  attempt: number;
  error: DatabaseBootstrapError | null;
};

const DatabaseContext = React.createContext<SQLiteDatabase | null>(null);

let sharedDatabase: SQLiteDatabase | null = null;
let bootstrapPromise: Promise<SQLiteDatabase> | null = null;
let bootstrapSnapshot: DatabaseBootstrapSnapshot = {
  phase: 'idle',
  attempt: 0,
  error: null,
};
const bootstrapListeners = new Set<(snapshot: DatabaseBootstrapSnapshot) => void>();

export function FieldBillDatabaseProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = React.useState<DatabaseBootstrapSnapshot>(bootstrapSnapshot);

  React.useEffect(() => subscribeToBootstrap(setSnapshot), []);

  React.useEffect(() => {
    void ensureDatabaseReady();
  }, []);

  const handleRetry = React.useCallback(() => {
    void retryDatabaseBootstrap();
  }, []);

  if (snapshot.phase !== 'ready' || !sharedDatabase) {
    return (
      <DatabaseBootstrapScreen
        phase={snapshot.phase}
        error={snapshot.error}
        onRetry={handleRetry}
      />
    );
  }

  return <DatabaseContext.Provider value={sharedDatabase}>{children}</DatabaseContext.Provider>;
}

export function useFieldBillDb(): SQLiteDatabase {
  const database = React.useContext(DatabaseContext);

  if (!database) {
    throw new Error('useFieldBillDb must be used after database startup completes.');
  }

  return database;
}

function subscribeToBootstrap(listener: (snapshot: DatabaseBootstrapSnapshot) => void) {
  bootstrapListeners.add(listener);
  listener(bootstrapSnapshot);

  return () => {
    bootstrapListeners.delete(listener);
  };
}

function publishBootstrapSnapshot(nextSnapshot: DatabaseBootstrapSnapshot) {
  bootstrapSnapshot = nextSnapshot;

  bootstrapListeners.forEach((listener) => {
    listener(nextSnapshot);
  });
}

async function ensureDatabaseReady(forceRetry = false): Promise<SQLiteDatabase> {
  if (sharedDatabase && !forceRetry) {
    publishBootstrapSnapshot({
      phase: 'ready',
      attempt: bootstrapSnapshot.attempt,
      error: null,
    });
    return sharedDatabase;
  }

  if (bootstrapPromise && !forceRetry) {
    return bootstrapPromise;
  }

  if (forceRetry) {
    bootstrapPromise = null;

    if (sharedDatabase) {
      await closeDatabaseSafely(sharedDatabase, 'db.init.retry.close.before_retry');
      sharedDatabase = null;
    }
  }

  const attempt = bootstrapSnapshot.attempt + 1;
  publishBootstrapSnapshot({
    phase: 'opening',
    attempt,
    error: null,
  });
  fieldBillDebugLog('db.init.open.start', { attempt });

  bootstrapPromise = (async () => {
    let database: SQLiteDatabase | null = null;

    try {
      database = await openDatabaseAsync('fieldbill.db');
      fieldBillDebugLog('db.init.open.success', { attempt });

      publishBootstrapSnapshot({
        phase: 'initializing',
        attempt,
        error: null,
      });
      fieldBillDebugLog('db.init.initialize.start', { attempt });

      await initializeDatabase(database);

      sharedDatabase = database;
      publishBootstrapSnapshot({
        phase: 'ready',
        attempt,
        error: null,
      });
      fieldBillDebugLog('db.init.initialize.success', { attempt });

      return database;
    } catch (error) {
      const wrappedError = createDatabaseBootstrapError(
        bootstrapSnapshot.phase === 'initializing' ? 'initializing' : 'opening',
        error
      );

      fieldBillDebugLog('db.init.failed', {
        attempt,
        phase: wrappedError.phase,
        message: wrappedError.message,
      });

      publishBootstrapSnapshot({
        phase: 'error',
        attempt,
        error: wrappedError,
      });

      if (database) {
        await closeDatabaseSafely(database, 'db.init.close.after_failure');
      }

      sharedDatabase = null;
      bootstrapPromise = null;
      throw wrappedError;
    }
  })();

  return bootstrapPromise;
}

async function retryDatabaseBootstrap(): Promise<void> {
  fieldBillDebugLog('db.init.retry.requested', {
    previousAttempt: bootstrapSnapshot.attempt,
    previousPhase: bootstrapSnapshot.phase,
  });

  try {
    await ensureDatabaseReady(true);
  } catch {
    // The bootstrap snapshot already contains the error state.
  }
}

async function closeDatabaseSafely(database: SQLiteDatabase, event: string) {
  try {
    await database.closeAsync();
    fieldBillDebugLog(`${event}.success`);
  } catch (error) {
    fieldBillDebugLog(`${event}.failed`, {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function createDatabaseBootstrapError(
  phase: Exclude<DatabaseBootstrapPhase, 'idle' | 'ready'>,
  error: unknown
): DatabaseBootstrapError {
  const databaseError =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown database startup error.');

  return Object.assign(new Error(databaseError.message), {
    name: databaseError.name,
    phase,
  });
}

function DatabaseBootstrapScreen({
  phase,
  error,
  onRetry,
}: {
  phase: DatabaseBootstrapPhase;
  error: DatabaseBootstrapError | null;
  onRetry: () => void;
}) {
  const isError = phase === 'error';
  const title = isError ? 'Could not open local data.' : 'Opening local data...';
  const detail = isError
    ? 'Retry startup. If it fails again, test the release-style APK.'
    : phase === 'initializing'
      ? 'Preparing the local database...'
      : 'Starting the local database...';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
        {isError ? (
          <>
            <Text style={styles.phaseLabel}>Init phase: {error?.phase ?? 'unknown'}</Text>
            {error?.message ? <Text style={styles.errorText}>{error.message}</Text> : null}
            <FieldBillButton label="RETRY" onPress={onRetry} primary />
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FieldBillColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: FieldBillSpacing.screenPadding,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: FieldBillColors.text,
    textAlign: 'center',
  },
  detail: {
    fontSize: 17,
    color: FieldBillColors.mutedText,
    textAlign: 'center',
  },
  phaseLabel: {
    fontSize: 15,
    color: FieldBillColors.mutedText,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#8a2d2d',
    textAlign: 'center',
  },
});
