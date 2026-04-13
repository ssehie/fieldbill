import { Platform } from 'react-native';

const QA_LOGGING_ENABLED = Platform.OS === 'android';

export function fieldBillDebugLog(event: string, details?: Record<string, unknown>) {
  if (!QA_LOGGING_ENABLED) {
    return;
  }

  if (details) {
    console.log(`[FieldBill QA] ${event}`, JSON.stringify(details));
    return;
  }

  console.log(`[FieldBill QA] ${event}`);
}
