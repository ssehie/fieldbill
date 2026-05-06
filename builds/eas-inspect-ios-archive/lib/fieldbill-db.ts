import type { SQLiteDatabase } from 'expo-sqlite';

import {
  formatStructuredAddress,
  hasStructuredAddress,
  normalizeStructuredAddress,
  type StructuredAddress,
} from '@/lib/address';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import { getElapsedHours, getLaborTotal, getLineTotal, roundMoney } from '@/lib/fieldbill-math';

type DatabaseClient = Pick<SQLiteDatabase, 'execAsync' | 'getAllAsync' | 'getFirstAsync' | 'runAsync'>;

type AddressRecord = {
  street1: string;
  city: string;
  state: string;
  postal_code: string;
};

export type JobStatus = 'active' | 'completed';
export type InvoiceStatus = 'draft' | 'ready_to_send' | 'sent' | 'paid';

export type JobRecord = AddressRecord & {
  id: string;
  customer_name: string;
  address: string;
  hourly_rate: number;
  start_time: string;
  end_time: string | null;
  status: JobStatus;
  note: string | null;
};

export type CustomerRecord = AddressRecord & {
  id: string;
  name: string;
  address: string;
  default_hourly_rate: number;
};

export type RecentCustomerOption = AddressRecord & {
  customer_name: string;
  address: string;
  hourly_rate: number;
  last_job_at: string;
};

export type JobPartRecord = {
  id: string;
  job_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type JobAudioNoteRecord = {
  id: string;
  job_id: string;
  file_uri: string;
  created_at: string;
  duration_ms: number | null;
};

export type InvoiceRecord = {
  id: string;
  job_id: string;
  total: number;
  subtotal: number;
  tax_amount: number;
  labor_total: number;
  parts_subtotal: number;
  status: InvoiceStatus;
  created_at: string;
  invoice_number: string | null;
  labor_hours: number;
  hourly_rate: number;
  discount_amount: number;
  tax_percent: number;
  currency: string;
  tax_labor: number;
  tax_materials: number;
  payment_note: string | null;
};

export type BusinessProfile = StructuredAddress & {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  invoiceStartNumber: number;
  nextInvoiceNumber: number;
  currency: string;
  defaultTaxEnabled: boolean;
  defaultTaxRate: number;
  defaultLaborRate: number | null;
  paymentTerms: string;
  taxLabor: boolean;
  taxMaterials: boolean;
  showJobAddress: boolean;
  showNotes: boolean;
  onboardingComplete: boolean;
};

export type BusinessProfileUpdate = Partial<BusinessProfile>;

type TaxPreferences = Pick<BusinessProfile, 'taxLabor' | 'taxMaterials'>;

export type BillingAccessSnapshot = {
  proAccessUnlocked: boolean;
  proAccessSyncedAt: string | null;
};

export type InvoiceAdjustments = {
  laborHours: number;
  hourlyRate: number;
  discountAmount: number;
  taxPercent: number;
};

export type JobBillingSnapshot = InvoiceAdjustments & {
  laborTotal: number;
  partsSubtotal: number;
  subtotal: number;
  taxAmount: number;
  total: number;
};

export type InvoiceSummary = InvoiceRecord &
  AddressRecord & {
  customer_name: string;
  address: string;
  start_time: string;
  end_time: string | null;
  note: string | null;
  };

export type InvoiceReview = InvoiceSummary &
  JobBillingSnapshot & {
    parts: JobPartRecord[];
  };

const DATABASE_VERSION = 7;
export const DEFAULT_INVOICE_NUMBER = 1001;
export const DEFAULT_HOURLY_RATE = 125;
export const DEFAULT_PAYMENT_TERMS = 'Due on receipt';
export const DEFAULT_PAYMENT_NOTE = DEFAULT_PAYMENT_TERMS;
export const DEFAULT_CURRENCY = 'USD';
const DEFAULT_TAX_PREFERENCES: TaxPreferences = {
  taxLabor: false,
  taxMaterials: true,
};

const BUSINESS_SETTING_KEYS = {
  businessName: 'business_name',
  phone: 'business_phone',
  email: 'business_email',
  address: 'business_address',
  street1: 'business_street1',
  city: 'business_city',
  state: 'business_state',
  postalCode: 'business_postal_code',
  invoiceStartNumber: 'invoice_start_number',
  nextInvoiceNumber: 'next_invoice_number',
  currency: 'currency',
  defaultTaxEnabled: 'default_tax_enabled',
  defaultTaxRate: 'default_tax_rate',
  defaultLaborRate: 'default_hourly_rate',
  paymentTerms: 'default_payment_note',
  taxLabor: 'tax_labor',
  taxMaterials: 'tax_materials',
  showJobAddress: 'show_job_address',
  showNotes: 'show_notes',
  onboardingComplete: 'onboarding_complete',
} as const;

const BILLING_SETTING_KEYS = {
  proAccessUnlocked: 'pro_access_unlocked',
  proAccessSyncedAt: 'pro_access_synced_at',
} as const;

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY NOT NULL,
      customer_name TEXT NOT NULL,
      address TEXT NOT NULL,
      street1 TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      postal_code TEXT NOT NULL DEFAULT '',
      hourly_rate REAL NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      status TEXT NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      street1 TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      postal_code TEXT NOT NULL DEFAULT '',
      default_hourly_rate REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      total REAL NOT NULL DEFAULT 0,
      subtotal REAL NOT NULL DEFAULT 0,
      tax_amount REAL NOT NULL DEFAULT 0,
      labor_total REAL NOT NULL DEFAULT 0,
      parts_subtotal REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      invoice_number TEXT,
      labor_hours REAL NOT NULL DEFAULT 0,
      hourly_rate REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      tax_percent REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      tax_labor INTEGER NOT NULL DEFAULT 0,
      tax_materials INTEGER NOT NULL DEFAULT 1,
      payment_note TEXT,
      FOREIGN KEY (job_id) REFERENCES jobs (id)
    );

    CREATE TABLE IF NOT EXISTS job_parts (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS job_audio_notes (
      id TEXT PRIMARY KEY NOT NULL,
      job_id TEXT NOT NULL UNIQUE,
      file_uri TEXT NOT NULL,
      created_at TEXT NOT NULL,
      duration_ms INTEGER,
      FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
    CREATE INDEX IF NOT EXISTS idx_customers_name ON customers (name);
    CREATE INDEX IF NOT EXISTS idx_invoices_status_created_at ON invoices (status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_job_parts_job_created_at ON job_parts (job_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_job_audio_notes_job_id ON job_audio_notes (job_id);
  `);

  await addColumnIfMissing(db, 'ALTER TABLE jobs ADD COLUMN note TEXT;');
  await addColumnIfMissing(db, `ALTER TABLE jobs ADD COLUMN street1 TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE jobs ADD COLUMN city TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE jobs ADD COLUMN state TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE jobs ADD COLUMN postal_code TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE customers ADD COLUMN street1 TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE customers ADD COLUMN city TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(db, `ALTER TABLE customers ADD COLUMN state TEXT NOT NULL DEFAULT '';`);
  await addColumnIfMissing(
    db,
    `ALTER TABLE customers ADD COLUMN postal_code TEXT NOT NULL DEFAULT '';`
  );
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN invoice_number TEXT;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN labor_hours REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN hourly_rate REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(
    db,
    'ALTER TABLE invoices ADD COLUMN discount_amount REAL NOT NULL DEFAULT 0;'
  );
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN tax_percent REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN subtotal REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN tax_amount REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN labor_total REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN parts_subtotal REAL NOT NULL DEFAULT 0;');
  await addColumnIfMissing(
    db,
    `ALTER TABLE invoices ADD COLUMN currency TEXT NOT NULL DEFAULT '${DEFAULT_CURRENCY}';`
  );
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN tax_labor INTEGER NOT NULL DEFAULT 0;');
  await addColumnIfMissing(
    db,
    'ALTER TABLE invoices ADD COLUMN tax_materials INTEGER NOT NULL DEFAULT 1;'
  );
  await addColumnIfMissing(db, 'ALTER TABLE invoices ADD COLUMN payment_note TEXT;');
  await db.execAsync('CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_number ON invoices (invoice_number);');

  await ensureSetting(db, BUSINESS_SETTING_KEYS.businessName, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.phone, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.email, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.address, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.street1, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.city, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.state, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.postalCode, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.invoiceStartNumber, String(DEFAULT_INVOICE_NUMBER));
  await ensureSetting(db, BUSINESS_SETTING_KEYS.nextInvoiceNumber, String(DEFAULT_INVOICE_NUMBER));
  await ensureSetting(db, BUSINESS_SETTING_KEYS.currency, DEFAULT_CURRENCY);
  await ensureSetting(db, BUSINESS_SETTING_KEYS.defaultTaxEnabled, '0');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.defaultTaxRate, '0');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.defaultLaborRate, '');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.paymentTerms, DEFAULT_PAYMENT_TERMS);
  await ensureSetting(db, BUSINESS_SETTING_KEYS.taxLabor, '0');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.taxMaterials, '1');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.showJobAddress, '1');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.showNotes, '1');
  await ensureSetting(db, BUSINESS_SETTING_KEYS.onboardingComplete, '0');
  await ensureSetting(db, BILLING_SETTING_KEYS.proAccessUnlocked, '0');
  await ensureSetting(db, BILLING_SETTING_KEYS.proAccessSyncedAt, '');

  await db.execAsync(`
    UPDATE invoices
    SET hourly_rate = CASE
          WHEN hourly_rate > 0 THEN hourly_rate
          ELSE COALESCE((SELECT jobs.hourly_rate FROM jobs WHERE jobs.id = invoices.job_id), 0)
        END,
        discount_amount = COALESCE(discount_amount, 0),
        tax_percent = COALESCE(tax_percent, 0);
  `);

  const invoicesMissingPaymentNote = await db.getAllAsync<{ id: string }>(
    `SELECT id
     FROM invoices
     WHERE payment_note IS NULL OR trim(payment_note) = ''`
  );

  for (const invoice of invoicesMissingPaymentNote) {
    const defaultPaymentNote = await getDefaultPaymentNote(db);

    await db.runAsync(
      `UPDATE invoices
       SET payment_note = ?
       WHERE id = ?`,
      defaultPaymentNote,
      invoice.id
    );
  }

  await backfillInvoiceNumbers(db);
  await backfillInvoiceFinancials(db);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
}

export async function createJob(
  db: DatabaseClient,
  input: { customerName: string; address: string; hourlyRate: number; structuredAddress?: StructuredAddress }
): Promise<JobRecord> {
  const id = createId('job');
  const startTime = nowIso();
  const address = normalizeStoredAddress(input.address, input.structuredAddress);

  await db.runAsync(
    `INSERT INTO jobs (
       id, customer_name, address, street1, city, state, postal_code, hourly_rate, start_time, status, note
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NULL)`,
    id,
    input.customerName.trim(),
    address.address,
    address.street1,
    address.city,
    address.state,
    address.postal_code,
    input.hourlyRate,
    startTime
  );

  return getJobById(db, id);
}

export async function saveCustomer(
  db: DatabaseClient,
  input: {
    name: string;
    address: string;
    defaultHourlyRate: number;
    structuredAddress?: StructuredAddress;
  }
): Promise<CustomerRecord | null> {
  const trimmedName = input.name.trim();
  const normalizedAddress = normalizeStoredAddress(input.address, input.structuredAddress);
  const trimmedAddress = normalizedAddress.address;

  const existingCustomer = await db.getFirstAsync<CustomerRecord>(
    `SELECT id, name, address, street1, city, state, postal_code, default_hourly_rate
     FROM customers
     WHERE lower(name) = lower(?) AND lower(address) = lower(?)
     LIMIT 1`,
    trimmedName,
    trimmedAddress
  );

  if (existingCustomer) {
    await db.runAsync(
      `UPDATE customers
       SET address = ?,
           street1 = ?,
           city = ?,
           state = ?,
           postal_code = ?,
           default_hourly_rate = ?
       WHERE id = ?`,
      normalizedAddress.address,
      normalizedAddress.street1,
      normalizedAddress.city,
      normalizedAddress.state,
      normalizedAddress.postal_code,
      input.defaultHourlyRate,
      existingCustomer.id
    );

    return getCustomerById(db, existingCustomer.id);
  }

  const customerId = createId('customer');

  await db.runAsync(
    `INSERT INTO customers (id, name, address, street1, city, state, postal_code, default_hourly_rate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    customerId,
    trimmedName,
    normalizedAddress.address,
    normalizedAddress.street1,
    normalizedAddress.city,
    normalizedAddress.state,
    normalizedAddress.postal_code,
    input.defaultHourlyRate
  );

  return getCustomerById(db, customerId);
}

export async function listCustomers(db: DatabaseClient): Promise<CustomerRecord[]> {
  return db.getAllAsync<CustomerRecord>(
    `SELECT id, name, address, street1, city, state, postal_code, default_hourly_rate
     FROM customers
     ORDER BY name ASC, address ASC`
  );
}

export async function listRecentCustomerOptions(
  db: DatabaseClient,
  limit = 3
): Promise<RecentCustomerOption[]> {
  const jobs = await db.getAllAsync<RecentCustomerOption>(
    `SELECT customer_name, address, street1, city, state, postal_code, hourly_rate, start_time AS last_job_at
     FROM jobs
     ORDER BY start_time DESC`
  );

  const seen = new Set<string>();
  const recentCustomers: RecentCustomerOption[] = [];

  for (const job of jobs) {
    const key = `${job.customer_name.toLowerCase()}::${job.address.toLowerCase()}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    recentCustomers.push(job);

    if (recentCustomers.length >= limit) {
      break;
    }
  }

  return recentCustomers;
}

export async function getMostRecentCustomerOption(
  db: DatabaseClient
): Promise<RecentCustomerOption | null> {
  const [recentCustomer] = await listRecentCustomerOptions(db, 1);
  return recentCustomer ?? null;
}

export async function createPart(
  db: DatabaseClient,
  input: { jobId: string; name: string; quantity: number; unitPrice: number }
): Promise<JobPartRecord | null> {
  const id = createId('part');
  const createdAt = nowIso();

  await db.runAsync(
    `INSERT INTO job_parts (id, job_id, name, quantity, unit_price, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.jobId,
    input.name.trim(),
    input.quantity,
    input.unitPrice,
    createdAt
  );

  return (
    (await db.getFirstAsync<JobPartRecord>(
      `SELECT id, job_id, name, quantity, unit_price, created_at
       FROM job_parts
       WHERE id = ?
       LIMIT 1`,
      id
    )) ?? null
  );
}

export async function listPartsForJob(db: DatabaseClient, jobId: string): Promise<JobPartRecord[]> {
  return db.getAllAsync<JobPartRecord>(
    `SELECT id, job_id, name, quantity, unit_price, created_at
     FROM job_parts
     WHERE job_id = ?
     ORDER BY created_at ASC`,
    jobId
  );
}

export async function getPartsSubtotalForJob(db: DatabaseClient, jobId: string): Promise<number> {
  const result = await db.getFirstAsync<{ subtotal: number | null }>(
    `SELECT COALESCE(SUM(quantity * unit_price), 0) AS subtotal
     FROM job_parts
     WHERE job_id = ?`,
    jobId
  );

  return roundMoney(result?.subtotal ?? 0);
}

export async function saveNoteForJob(
  db: DatabaseClient,
  jobId: string,
  note: string
): Promise<JobRecord | null> {
  await db.runAsync(
    `UPDATE jobs
     SET note = ?
     WHERE id = ?`,
    normalizeNote(note),
    jobId
  );

  return getJobById(db, jobId);
}

export async function getNoteForJob(db: DatabaseClient, jobId: string): Promise<string | null> {
  const result = await db.getFirstAsync<{ note: string | null }>(
    `SELECT note
     FROM jobs
     WHERE id = ?
     LIMIT 1`,
    jobId
  );

  return result?.note ?? null;
}

export async function getJobAudioNote(
  db: DatabaseClient,
  jobId: string
): Promise<JobAudioNoteRecord | null> {
  return (
    (await db.getFirstAsync<JobAudioNoteRecord>(
      `SELECT id, job_id, file_uri, created_at, duration_ms
       FROM job_audio_notes
       WHERE job_id = ?
       LIMIT 1`,
      jobId
    )) ?? null
  );
}

export async function saveJobAudioNote(
  db: DatabaseClient,
  input: { jobId: string; fileUri: string; durationMs?: number | null }
): Promise<JobAudioNoteRecord | null> {
  const createdAt = nowIso();
  const existingAudioNote = await getJobAudioNote(db, input.jobId);
  const id = existingAudioNote?.id ?? createId('audio');

  await db.runAsync(
    `INSERT INTO job_audio_notes (id, job_id, file_uri, created_at, duration_ms)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(job_id) DO UPDATE SET
       id = excluded.id,
       file_uri = excluded.file_uri,
       created_at = excluded.created_at,
       duration_ms = excluded.duration_ms`,
    id,
    input.jobId,
    input.fileUri,
    createdAt,
    input.durationMs ?? null
  );

  return getJobAudioNote(db, input.jobId);
}

export async function deleteJobAudioNote(db: DatabaseClient, jobId: string): Promise<void> {
  await db.runAsync(
    `DELETE FROM job_audio_notes
     WHERE job_id = ?`,
    jobId
  );
}

export async function getActiveJob(db: DatabaseClient): Promise<JobRecord | null> {
  return (
    (await db.getFirstAsync<JobRecord>(
      `SELECT id, customer_name, address, street1, city, state, postal_code, hourly_rate, start_time, end_time, status, note
       FROM jobs
       WHERE status = 'active'
       ORDER BY start_time DESC
       LIMIT 1`
    )) ?? null
  );
}

export async function completeJob(db: DatabaseClient, jobId: string): Promise<JobRecord | null> {
  const endTime = nowIso();

  await db.runAsync(
    `UPDATE jobs
     SET end_time = ?, status = 'completed'
     WHERE id = ? AND status = 'active'`,
    endTime,
    jobId
  );

  return getJobById(db, jobId);
}

export async function createInvoiceDraftForCompletedJob(
  db: DatabaseClient,
  jobId: string,
  adjustments?: Partial<InvoiceAdjustments>
): Promise<InvoiceRecord | null> {
  const job = await getJobById(db, jobId);
  if (!job || job.status !== 'completed') {
    return null;
  }

  const billing = await getJobBillingSnapshot(db, job, adjustments);
  const businessProfile = await getBusinessProfile(db);
  const existingInvoice = await db.getFirstAsync<InvoiceRecord>(
    `SELECT id, job_id, total, subtotal, tax_amount, labor_total, parts_subtotal, status, created_at, invoice_number,
            labor_hours, hourly_rate, discount_amount, tax_percent, currency, tax_labor, tax_materials, payment_note
     FROM invoices
     WHERE job_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    jobId
  );

  const invoiceNumber = existingInvoice?.invoice_number ?? (await getNextInvoiceNumberLabel(db));
  const paymentNote = normalizePaymentNote(existingInvoice?.payment_note, await getDefaultPaymentNote(db));

  if (existingInvoice) {
    await db.runAsync(
      `UPDATE invoices
       SET total = ?,
           subtotal = ?,
           tax_amount = ?,
           labor_total = ?,
           parts_subtotal = ?,
           invoice_number = ?,
           labor_hours = ?,
           hourly_rate = ?,
           discount_amount = ?,
           tax_percent = ?,
           currency = ?,
           tax_labor = ?,
           tax_materials = ?,
           payment_note = ?,
           status = CASE
             WHEN status IN ('sent', 'paid') THEN status
             ELSE 'ready_to_send'
           END
       WHERE id = ?`,
      billing.total,
      billing.subtotal,
      billing.taxAmount,
      billing.laborTotal,
      billing.partsSubtotal,
      invoiceNumber,
      billing.laborHours,
      billing.hourlyRate,
      billing.discountAmount,
      billing.taxPercent,
      existingInvoice.currency,
      existingInvoice.tax_labor,
      existingInvoice.tax_materials,
      paymentNote,
      existingInvoice.id
    );
    fieldBillDebugLog('invoice.persist.update', {
      invoiceId: existingInvoice.id,
      total: billing.total,
      subtotal: billing.subtotal,
      taxAmount: billing.taxAmount,
    });

    return getInvoiceById(db, existingInvoice.id);
  }

  const invoiceId = createId('invoice');
  const createdAt = nowIso();

  await db.runAsync(
    `INSERT INTO invoices (
       id, job_id, total, subtotal, tax_amount, labor_total, parts_subtotal, status, created_at, invoice_number,
       labor_hours, hourly_rate, discount_amount, tax_percent, currency, tax_labor, tax_materials, payment_note
     ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ready_to_send', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    invoiceId,
    job.id,
    billing.total,
    billing.subtotal,
    billing.taxAmount,
    billing.laborTotal,
    billing.partsSubtotal,
    createdAt,
    invoiceNumber,
    billing.laborHours,
    billing.hourlyRate,
    billing.discountAmount,
    billing.taxPercent,
    businessProfile.currency,
    businessProfile.taxLabor ? 1 : 0,
    businessProfile.taxMaterials ? 1 : 0,
    paymentNote
  );
  fieldBillDebugLog('invoice.persist.create', {
    invoiceId,
    jobId: job.id,
    total: billing.total,
    subtotal: billing.subtotal,
    taxAmount: billing.taxAmount,
  });

  return getInvoiceById(db, invoiceId);
}

export async function getLatestUnsentInvoice(db: DatabaseClient): Promise<InvoiceSummary | null> {
  return (
    (await db.getFirstAsync<InvoiceSummary>(
      `SELECT invoices.id, invoices.job_id, invoices.total, invoices.subtotal, invoices.tax_amount, invoices.labor_total, invoices.parts_subtotal,
              invoices.status, invoices.created_at, invoices.invoice_number, invoices.labor_hours, invoices.hourly_rate,
              invoices.discount_amount, invoices.tax_percent, invoices.currency, invoices.tax_labor, invoices.tax_materials, invoices.payment_note,
              jobs.customer_name, jobs.address, jobs.street1, jobs.city, jobs.state,
              jobs.postal_code, jobs.start_time, jobs.end_time, jobs.note
       FROM invoices
       INNER JOIN jobs ON jobs.id = invoices.job_id
       WHERE invoices.status IN ('draft', 'ready_to_send')
       ORDER BY invoices.created_at DESC
       LIMIT 1`
    )) ?? null
  );
}

export async function getInvoiceReviewById(
  db: DatabaseClient,
  invoiceId: string
): Promise<InvoiceReview | null> {
  const invoice = await db.getFirstAsync<InvoiceSummary>(
    `SELECT invoices.id, invoices.job_id, invoices.total, invoices.subtotal, invoices.tax_amount, invoices.labor_total, invoices.parts_subtotal,
            invoices.status, invoices.created_at, invoices.invoice_number, invoices.labor_hours, invoices.hourly_rate,
            invoices.discount_amount, invoices.tax_percent, invoices.currency, invoices.tax_labor, invoices.tax_materials, invoices.payment_note,
            jobs.customer_name, jobs.address, jobs.street1, jobs.city, jobs.state,
            jobs.postal_code, jobs.start_time, jobs.end_time, jobs.note
     FROM invoices
     INNER JOIN jobs ON jobs.id = invoices.job_id
     WHERE invoices.id = ?
     LIMIT 1`,
    invoiceId
  );

  if (!invoice) {
    return null;
  }

  return buildInvoiceReview(db, invoice);
}

export async function getLatestUnsentInvoiceReview(
  db: DatabaseClient
): Promise<InvoiceReview | null> {
  const latestInvoice = await getLatestUnsentInvoice(db);

  if (!latestInvoice) {
    return null;
  }

  return buildInvoiceReview(db, latestInvoice);
}

export async function updateInvoiceAdjustments(
  db: DatabaseClient,
  invoiceId: string,
  adjustments: Partial<InvoiceAdjustments> & { paymentNote?: string }
): Promise<InvoiceRecord | null> {
  const existingInvoice = await getInvoiceById(db, invoiceId);

  if (!existingInvoice) {
    return null;
  }

  const nextAdjustments = normalizeAdjustments({
    laborHours: adjustments.laborHours ?? existingInvoice.labor_hours,
    hourlyRate: adjustments.hourlyRate ?? existingInvoice.hourly_rate,
    discountAmount: adjustments.discountAmount ?? existingInvoice.discount_amount,
    taxPercent: adjustments.taxPercent ?? existingInvoice.tax_percent,
  });

  const partsSubtotal = await getPartsSubtotalForJob(db, existingInvoice.job_id);
  const totals = buildTotals(nextAdjustments, partsSubtotal, {
    taxLabor: existingInvoice.tax_labor === 1,
    taxMaterials: existingInvoice.tax_materials === 1,
  });
  const paymentNote = normalizePaymentNote(adjustments.paymentNote ?? existingInvoice.payment_note);

  await db.runAsync(
    `UPDATE invoices
     SET labor_hours = ?,
         hourly_rate = ?,
         discount_amount = ?,
         tax_percent = ?,
         payment_note = ?,
         labor_total = ?,
         parts_subtotal = ?,
         subtotal = ?,
         tax_amount = ?,
         total = ?
     WHERE id = ?`,
    nextAdjustments.laborHours,
    nextAdjustments.hourlyRate,
    nextAdjustments.discountAmount,
    nextAdjustments.taxPercent,
    paymentNote,
    totals.laborTotal,
    partsSubtotal,
    totals.subtotal,
    totals.taxAmount,
    totals.total,
    invoiceId
  );
  fieldBillDebugLog('invoice.persist.edit', {
    invoiceId,
    total: totals.total,
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
  });

  return getInvoiceById(db, invoiceId);
}

export async function listInvoiceHistory(db: DatabaseClient): Promise<InvoiceSummary[]> {
  return db.getAllAsync<InvoiceSummary>(
    `SELECT invoices.id, invoices.job_id, invoices.total, invoices.subtotal, invoices.tax_amount, invoices.labor_total, invoices.parts_subtotal,
            invoices.status, invoices.created_at, invoices.invoice_number, invoices.labor_hours, invoices.hourly_rate,
            invoices.discount_amount, invoices.tax_percent, invoices.currency, invoices.tax_labor, invoices.tax_materials, invoices.payment_note,
            jobs.customer_name, jobs.address, jobs.street1, jobs.city, jobs.state,
            jobs.postal_code, jobs.start_time, jobs.end_time, jobs.note
     FROM invoices
     INNER JOIN jobs ON jobs.id = invoices.job_id
     ORDER BY invoices.created_at DESC`
  );
}

export async function countInvoices(db: DatabaseClient): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM invoices`
  );

  return Number(result?.count ?? 0);
}

export async function markInvoiceSent(
  db: DatabaseClient,
  invoiceId: string
): Promise<InvoiceRecord | null> {
  await db.runAsync(
    `UPDATE invoices
     SET status = 'sent'
     WHERE id = ? AND status IN ('draft', 'ready_to_send')`,
    invoiceId
  );

  return getInvoiceById(db, invoiceId);
}

export async function markInvoicePaid(
  db: DatabaseClient,
  invoiceId: string
): Promise<InvoiceRecord | null> {
  await db.runAsync(
    `UPDATE invoices
     SET status = 'paid'
     WHERE id = ? AND status IN ('draft', 'ready_to_send', 'sent')`,
    invoiceId
  );

  return getInvoiceById(db, invoiceId);
}

export async function getBusinessProfile(db: DatabaseClient): Promise<BusinessProfile> {
  const settings = await db.getAllAsync<{ key: string; value: string | null }>(
    `SELECT key, value
     FROM settings
     WHERE key IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    BUSINESS_SETTING_KEYS.businessName,
    BUSINESS_SETTING_KEYS.phone,
    BUSINESS_SETTING_KEYS.email,
    BUSINESS_SETTING_KEYS.address,
    BUSINESS_SETTING_KEYS.street1,
    BUSINESS_SETTING_KEYS.city,
    BUSINESS_SETTING_KEYS.state,
    BUSINESS_SETTING_KEYS.postalCode,
    BUSINESS_SETTING_KEYS.invoiceStartNumber,
    BUSINESS_SETTING_KEYS.nextInvoiceNumber,
    BUSINESS_SETTING_KEYS.currency,
    BUSINESS_SETTING_KEYS.defaultTaxEnabled,
    BUSINESS_SETTING_KEYS.defaultTaxRate,
    BUSINESS_SETTING_KEYS.defaultLaborRate,
    BUSINESS_SETTING_KEYS.paymentTerms,
    BUSINESS_SETTING_KEYS.taxLabor,
    BUSINESS_SETTING_KEYS.taxMaterials,
    BUSINESS_SETTING_KEYS.showJobAddress,
    BUSINESS_SETTING_KEYS.showNotes,
    BUSINESS_SETTING_KEYS.onboardingComplete
  );

  const values = new Map(settings.map((setting) => [setting.key, setting.value ?? '']));

  return {
    businessName: values.get(BUSINESS_SETTING_KEYS.businessName) ?? '',
    phone: values.get(BUSINESS_SETTING_KEYS.phone) ?? '',
    email: values.get(BUSINESS_SETTING_KEYS.email) ?? '',
    address: values.get(BUSINESS_SETTING_KEYS.address) ?? '',
    formattedAddress: values.get(BUSINESS_SETTING_KEYS.address) ?? '',
    street1: values.get(BUSINESS_SETTING_KEYS.street1) ?? '',
    city: values.get(BUSINESS_SETTING_KEYS.city) ?? '',
    state: values.get(BUSINESS_SETTING_KEYS.state) ?? '',
    postalCode: values.get(BUSINESS_SETTING_KEYS.postalCode) ?? '',
    invoiceStartNumber: normalizeInvoiceNumberValue(
      values.get(BUSINESS_SETTING_KEYS.invoiceStartNumber) ?? null
    ),
    nextInvoiceNumber: normalizeInvoiceNumberValue(
      values.get(BUSINESS_SETTING_KEYS.nextInvoiceNumber) ?? null
    ),
    currency: normalizeCurrencyValue(values.get(BUSINESS_SETTING_KEYS.currency) ?? null),
    defaultTaxEnabled: normalizeBooleanValue(values.get(BUSINESS_SETTING_KEYS.defaultTaxEnabled) ?? null),
    defaultTaxRate: normalizeTaxRateValue(values.get(BUSINESS_SETTING_KEYS.defaultTaxRate) ?? null),
    defaultLaborRate: normalizeOptionalMoneyValue(
      values.get(BUSINESS_SETTING_KEYS.defaultLaborRate) ?? null
    ),
    paymentTerms: normalizePaymentNote(values.get(BUSINESS_SETTING_KEYS.paymentTerms) ?? null),
    taxLabor: normalizeBooleanValue(values.get(BUSINESS_SETTING_KEYS.taxLabor) ?? null),
    taxMaterials: normalizeBooleanValue(values.get(BUSINESS_SETTING_KEYS.taxMaterials) ?? '1'),
    showJobAddress: normalizeBooleanValue(values.get(BUSINESS_SETTING_KEYS.showJobAddress) ?? '1'),
    showNotes: normalizeBooleanValue(values.get(BUSINESS_SETTING_KEYS.showNotes) ?? '1'),
    onboardingComplete: normalizeBooleanValue(
      values.get(BUSINESS_SETTING_KEYS.onboardingComplete) ?? null
    ),
  };
}

export async function saveBusinessProfile(
  db: DatabaseClient,
  input: BusinessProfileUpdate
): Promise<BusinessProfile> {
  const existingProfile = await getBusinessProfile(db);
  const normalizedProfile = normalizeBusinessProfile({
    ...existingProfile,
    ...input,
  });

  const settingsToSave: Array<[string, string]> = [
    [BUSINESS_SETTING_KEYS.businessName, normalizedProfile.businessName],
    [BUSINESS_SETTING_KEYS.phone, normalizedProfile.phone],
    [BUSINESS_SETTING_KEYS.email, normalizedProfile.email],
    [BUSINESS_SETTING_KEYS.address, normalizedProfile.address],
    [BUSINESS_SETTING_KEYS.street1, normalizedProfile.street1],
    [BUSINESS_SETTING_KEYS.city, normalizedProfile.city],
    [BUSINESS_SETTING_KEYS.state, normalizedProfile.state],
    [BUSINESS_SETTING_KEYS.postalCode, normalizedProfile.postalCode],
    [BUSINESS_SETTING_KEYS.invoiceStartNumber, String(normalizedProfile.invoiceStartNumber)],
    [BUSINESS_SETTING_KEYS.nextInvoiceNumber, String(normalizedProfile.nextInvoiceNumber)],
    [BUSINESS_SETTING_KEYS.currency, normalizedProfile.currency],
    [BUSINESS_SETTING_KEYS.defaultTaxEnabled, normalizedProfile.defaultTaxEnabled ? '1' : '0'],
    [BUSINESS_SETTING_KEYS.defaultTaxRate, String(normalizedProfile.defaultTaxRate)],
    [
      BUSINESS_SETTING_KEYS.defaultLaborRate,
      normalizedProfile.defaultLaborRate === null ? '' : String(normalizedProfile.defaultLaborRate),
    ],
    [BUSINESS_SETTING_KEYS.paymentTerms, normalizedProfile.paymentTerms],
    [BUSINESS_SETTING_KEYS.taxLabor, normalizedProfile.taxLabor ? '1' : '0'],
    [BUSINESS_SETTING_KEYS.taxMaterials, normalizedProfile.taxMaterials ? '1' : '0'],
    [BUSINESS_SETTING_KEYS.showJobAddress, normalizedProfile.showJobAddress ? '1' : '0'],
    [BUSINESS_SETTING_KEYS.showNotes, normalizedProfile.showNotes ? '1' : '0'],
    [BUSINESS_SETTING_KEYS.onboardingComplete, normalizedProfile.onboardingComplete ? '1' : '0'],
  ];

  for (const [key, value] of settingsToSave) {
    await setSetting(db, key, value);
  }

  return normalizedProfile;
}

export async function getBillingAccessSnapshot(db: DatabaseClient): Promise<BillingAccessSnapshot> {
  const settings = await db.getAllAsync<{ key: string; value: string | null }>(
    `SELECT key, value
     FROM settings
     WHERE key IN (?, ?)`,
    BILLING_SETTING_KEYS.proAccessUnlocked,
    BILLING_SETTING_KEYS.proAccessSyncedAt
  );

  const values = new Map(settings.map((setting) => [setting.key, setting.value ?? '']));

  return {
    proAccessUnlocked: normalizeBooleanValue(values.get(BILLING_SETTING_KEYS.proAccessUnlocked) ?? '0'),
    proAccessSyncedAt: normalizeOptionalText(values.get(BILLING_SETTING_KEYS.proAccessSyncedAt) ?? ''),
  };
}

export async function saveBillingAccessSnapshot(
  db: DatabaseClient,
  input: Partial<BillingAccessSnapshot>
): Promise<BillingAccessSnapshot> {
  const existingSnapshot = await getBillingAccessSnapshot(db);
  const nextSnapshot: BillingAccessSnapshot = {
    proAccessUnlocked: input.proAccessUnlocked ?? existingSnapshot.proAccessUnlocked,
    proAccessSyncedAt: input.proAccessSyncedAt ?? existingSnapshot.proAccessSyncedAt,
  };

  await setSetting(
    db,
    BILLING_SETTING_KEYS.proAccessUnlocked,
    nextSnapshot.proAccessUnlocked ? '1' : '0'
  );
  await setSetting(db, BILLING_SETTING_KEYS.proAccessSyncedAt, nextSnapshot.proAccessSyncedAt ?? '');

  return nextSnapshot;
}

export async function completeBusinessOnboarding(
  db: DatabaseClient,
  input: Omit<BusinessProfile, 'invoiceStartNumber' | 'onboardingComplete'> & { onboardingComplete?: boolean }
): Promise<BusinessProfile> {
  const invoiceStartNumber = normalizeInvoiceNumberValue(String(input.nextInvoiceNumber));
  const onboardingComplete = input.onboardingComplete ?? true;

  await saveBusinessProfile(db, {
    ...input,
    invoiceStartNumber,
    nextInvoiceNumber: invoiceStartNumber,
    onboardingComplete,
  });

  await setSetting(
    db,
    BUSINESS_SETTING_KEYS.onboardingComplete,
    onboardingComplete ? '1' : '0'
  );

  return getBusinessProfile(db);
}

export function isBusinessSetupComplete(profile: BusinessProfile): boolean {
  return profile.onboardingComplete;
}

export async function getJobBillingSnapshot(
  db: DatabaseClient,
  job: Pick<JobRecord, 'id' | 'hourly_rate' | 'start_time' | 'end_time'>,
  adjustments?: Partial<InvoiceAdjustments>
): Promise<JobBillingSnapshot> {
  const [partsSubtotal, businessProfile] = await Promise.all([
    getPartsSubtotalForJob(db, job.id),
    getBusinessProfile(db),
  ]);
  const normalizedAdjustments = normalizeAdjustments({
    laborHours: adjustments?.laborHours ?? getElapsedHours(job.start_time, job.end_time ?? Date.now()),
    hourlyRate: adjustments?.hourlyRate ?? businessProfile.defaultLaborRate ?? job.hourly_rate,
    discountAmount: adjustments?.discountAmount ?? 0,
    taxPercent:
      adjustments?.taxPercent ??
      (businessProfile.defaultTaxEnabled ? businessProfile.defaultTaxRate : 0),
  });

  return {
    ...normalizedAdjustments,
    ...getInvoicePreviewFromAdjustments(
      partsSubtotal,
      normalizedAdjustments,
      pickTaxPreferences(businessProfile)
    ),
    partsSubtotal,
  };
}

export function getDefaultInvoiceAdjustments(
  job: Pick<JobRecord, 'hourly_rate' | 'start_time' | 'end_time'>,
  businessProfile?: Pick<BusinessProfile, 'defaultLaborRate' | 'defaultTaxEnabled' | 'defaultTaxRate'>
): InvoiceAdjustments {
  return normalizeAdjustments({
    laborHours: getElapsedHours(job.start_time, job.end_time ?? Date.now()),
    hourlyRate: businessProfile?.defaultLaborRate ?? job.hourly_rate,
    discountAmount: 0,
    taxPercent: businessProfile?.defaultTaxEnabled ? businessProfile.defaultTaxRate : 0,
  });
}

export function getInvoicePreviewFromAdjustments(
  partsSubtotal: number,
  adjustments: InvoiceAdjustments,
  taxPreferences: TaxPreferences = DEFAULT_TAX_PREFERENCES
): Omit<JobBillingSnapshot, 'partsSubtotal'> {
  const normalizedAdjustments = normalizeAdjustments(adjustments);

  return {
    ...normalizedAdjustments,
    ...buildTotals(normalizedAdjustments, partsSubtotal, taxPreferences),
  };
}

async function buildInvoiceReview(
  db: DatabaseClient,
  invoice: InvoiceSummary
): Promise<InvoiceReview> {
  const [parts, livePartsSubtotal] = await Promise.all([
    listPartsForJob(db, invoice.job_id),
    getPartsSubtotalForJob(db, invoice.job_id),
  ]);
  const partsSubtotal = shouldUsePersistedInvoiceFinancials(invoice)
    ? invoice.parts_subtotal
    : livePartsSubtotal;
  const laborTotal = shouldUsePersistedInvoiceFinancials(invoice)
    ? invoice.labor_total
    : getLaborTotal(invoice.hourly_rate, invoice.labor_hours);
  const subtotal = shouldUsePersistedInvoiceFinancials(invoice)
    ? invoice.subtotal
    : Math.max(0, roundMoney(laborTotal + partsSubtotal - invoice.discount_amount));
  const taxAmount = shouldUsePersistedInvoiceFinancials(invoice)
    ? invoice.tax_amount
    : roundMoney(invoice.total - subtotal);
  const total = shouldUsePersistedInvoiceFinancials(invoice)
    ? invoice.total
    : roundMoney(subtotal + taxAmount);

  return {
    ...invoice,
    laborHours: invoice.labor_hours,
    hourlyRate: invoice.hourly_rate,
    discountAmount: invoice.discount_amount,
    taxPercent: invoice.tax_percent,
    laborTotal,
    partsSubtotal,
    subtotal,
    taxAmount,
    total,
    parts,
  };
}

async function getJobById(db: DatabaseClient, jobId: string): Promise<JobRecord> {
  const job = await db.getFirstAsync<JobRecord>(
    `SELECT id, customer_name, address, street1, city, state, postal_code, hourly_rate, start_time, end_time, status, note
     FROM jobs
     WHERE id = ?
     LIMIT 1`,
    jobId
  );

  if (!job) {
    throw new Error(`Job ${jobId} was not found.`);
  }

  return job;
}

async function getCustomerById(
  db: DatabaseClient,
  customerId: string
): Promise<CustomerRecord | null> {
  return (
    (await db.getFirstAsync<CustomerRecord>(
      `SELECT id, name, address, street1, city, state, postal_code, default_hourly_rate
       FROM customers
       WHERE id = ?
       LIMIT 1`,
      customerId
    )) ?? null
  );
}

async function getInvoiceById(db: DatabaseClient, invoiceId: string): Promise<InvoiceRecord | null> {
  return (
    (await db.getFirstAsync<InvoiceRecord>(
      `SELECT id, job_id, total, subtotal, tax_amount, labor_total, parts_subtotal, status, created_at, invoice_number,
              labor_hours, hourly_rate, discount_amount, tax_percent, currency, tax_labor, tax_materials, payment_note
       FROM invoices
       WHERE id = ?
       LIMIT 1`,
      invoiceId
    )) ?? null
  );
}

function buildTotals(
  adjustments: InvoiceAdjustments,
  partsSubtotal: number,
  taxPreferences: TaxPreferences = DEFAULT_TAX_PREFERENCES
) {
  const laborTotal = getLaborTotal(adjustments.hourlyRate, adjustments.laborHours);
  const subtotal = Math.max(0, roundMoney(laborTotal + partsSubtotal - adjustments.discountAmount));
  const taxableSubtotal = Math.max(
    0,
    roundMoney(
      (taxPreferences.taxLabor ? laborTotal : 0) +
        (taxPreferences.taxMaterials ? partsSubtotal : 0) -
        adjustments.discountAmount
    )
  );
  const taxAmount = roundMoney(taxableSubtotal * (adjustments.taxPercent / 100));

  return {
    laborTotal,
    subtotal,
    taxAmount,
    total: roundMoney(subtotal + taxAmount),
  };
}

function normalizeAdjustments(input: InvoiceAdjustments): InvoiceAdjustments {
  return {
    laborHours: Math.max(0, roundMoney(input.laborHours)),
    hourlyRate: Math.max(0, roundMoney(input.hourlyRate)),
    discountAmount: Math.max(0, roundMoney(input.discountAmount)),
    taxPercent: Math.min(100, Math.max(0, roundMoney(input.taxPercent))),
  };
}

function normalizeBusinessProfile(input: BusinessProfile): BusinessProfile {
  const invoiceStartNumber = normalizeInvoiceNumberValue(input.invoiceStartNumber);
  const nextInvoiceNumber = Math.max(
    invoiceStartNumber,
    normalizeInvoiceNumberValue(input.nextInvoiceNumber)
  );
  const normalizedAddress = normalizeStructuredAddress({
    formattedAddress: input.address,
    street1: input.street1,
    city: input.city,
    state: input.state,
    postalCode: input.postalCode,
  });
  const address = formatStructuredAddress(normalizedAddress);

  return {
    businessName: input.businessName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    address,
    formattedAddress: address,
    street1: normalizedAddress.street1,
    city: normalizedAddress.city,
    state: normalizedAddress.state,
    postalCode: normalizedAddress.postalCode,
    invoiceStartNumber,
    nextInvoiceNumber,
    currency: normalizeCurrencyValue(input.currency),
    defaultTaxEnabled: Boolean(input.defaultTaxEnabled),
    defaultTaxRate: normalizeTaxRateValue(String(input.defaultTaxRate)),
    defaultLaborRate: normalizeOptionalMoneyValue(input.defaultLaborRate),
    paymentTerms: normalizePaymentNote(input.paymentTerms, DEFAULT_PAYMENT_TERMS),
    taxLabor: Boolean(input.taxLabor),
    taxMaterials: Boolean(input.taxMaterials),
    showJobAddress: input.showJobAddress !== false,
    showNotes: input.showNotes !== false,
    onboardingComplete: Boolean(input.onboardingComplete),
  };
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeNote(note: string): string | null {
  const trimmedNote = note.trim();
  return trimmedNote ? trimmedNote : null;
}

function normalizeStoredAddress(
  address: string,
  structuredAddress?: StructuredAddress
): { address: string; street1: string; city: string; state: string; postal_code: string } {
  const normalizedStructuredAddress = normalizeStructuredAddress(structuredAddress);
  const normalizedAddress = hasStructuredAddress(normalizedStructuredAddress)
    ? formatStructuredAddress(normalizedStructuredAddress)
    : address.trim();

  return {
    address: normalizedAddress,
    street1: normalizedStructuredAddress.street1,
    city: normalizedStructuredAddress.city,
    state: normalizedStructuredAddress.state,
    postal_code: normalizedStructuredAddress.postalCode,
  };
}

function normalizePaymentNote(
  paymentNote: string | null | undefined,
  fallback = DEFAULT_PAYMENT_NOTE
): string {
  const trimmedPaymentNote = paymentNote?.trim();
  return trimmedPaymentNote ? trimmedPaymentNote : fallback;
}

function normalizeInvoiceNumberValue(value: string | number | null | undefined): number {
  const parsedValue =
    typeof value === 'number' ? Math.trunc(value) : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsedValue) && parsedValue >= 1 ? parsedValue : DEFAULT_INVOICE_NUMBER;
}

function normalizeTaxRateValue(value: string | number | null | undefined): number {
  const parsedValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsedValue) ? Math.min(100, Math.max(0, roundMoney(parsedValue))) : 0;
}

function normalizeOptionalMoneyValue(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsedValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? roundMoney(parsedValue) : null;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

function normalizeCurrencyValue(value: string | null | undefined): string {
  const trimmedValue = value?.trim().toUpperCase();
  return trimmedValue && /^[A-Z]{3}$/.test(trimmedValue) ? trimmedValue : DEFAULT_CURRENCY;
}

function normalizeBooleanValue(value: string | number | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return value === '1' || value === 'true';
}

function pickTaxPreferences(profile: Pick<BusinessProfile, 'taxLabor' | 'taxMaterials'>): TaxPreferences {
  return {
    taxLabor: profile.taxLabor,
    taxMaterials: profile.taxMaterials,
  };
}

function shouldUsePersistedInvoiceFinancials(
  invoice: Pick<
    InvoiceRecord,
    'total' | 'subtotal' | 'tax_amount' | 'labor_total' | 'parts_subtotal'
  >
): boolean {
  return (
    invoice.total === 0 ||
    invoice.subtotal > 0 ||
    invoice.tax_amount > 0 ||
    invoice.labor_total > 0 ||
    invoice.parts_subtotal > 0
  );
}

async function addColumnIfMissing(db: SQLiteDatabase, statement: string) {
  try {
    await db.execAsync(statement);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';

    if (!message.includes('duplicate column name')) {
      throw error;
    }
  }
}

async function ensureSetting(db: DatabaseClient, key: string, value: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO NOTHING`,
    key,
    value
  );
}

async function setSetting(db: DatabaseClient, key: string, value: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    value
  );
}

async function getSetting(db: DatabaseClient, key: string): Promise<string | null> {
  const result = await db.getFirstAsync<{ value: string | null }>(
    `SELECT value
     FROM settings
     WHERE key = ?
     LIMIT 1`,
    key
  );

  return result?.value ?? null;
}

async function getDefaultPaymentNote(db: DatabaseClient): Promise<string> {
  return normalizePaymentNote(await getSetting(db, BUSINESS_SETTING_KEYS.paymentTerms));
}

async function getNextInvoiceNumberLabel(db: DatabaseClient): Promise<string> {
  const nextInvoiceNumberSetting = await getSetting(db, BUSINESS_SETTING_KEYS.nextInvoiceNumber);
  const nextInvoiceNumber = Math.max(
    DEFAULT_INVOICE_NUMBER,
    Number.parseInt(nextInvoiceNumberSetting ?? String(DEFAULT_INVOICE_NUMBER), 10) ||
      DEFAULT_INVOICE_NUMBER
  );

  await setSetting(db, BUSINESS_SETTING_KEYS.nextInvoiceNumber, String(nextInvoiceNumber + 1));

  return `FB-${nextInvoiceNumber}`;
}

async function backfillInvoiceNumbers(db: DatabaseClient): Promise<void> {
  const invoices = await db.getAllAsync<{ id: string; invoice_number: string | null }>(
    `SELECT id, invoice_number
     FROM invoices
     ORDER BY created_at ASC`
  );

  let highestExistingNumber = DEFAULT_INVOICE_NUMBER - 1;

  invoices.forEach((invoice) => {
    const parsedNumber = parseInvoiceNumber(invoice.invoice_number);

    if (parsedNumber !== null) {
      highestExistingNumber = Math.max(highestExistingNumber, parsedNumber);
    }
  });

  let nextInvoiceNumber = Math.max(
    highestExistingNumber + 1,
    Number.parseInt(
      (await getSetting(db, BUSINESS_SETTING_KEYS.nextInvoiceNumber)) ??
        String(DEFAULT_INVOICE_NUMBER),
      10
    ) || DEFAULT_INVOICE_NUMBER
  );

  for (const invoice of invoices) {
    if (invoice.invoice_number) {
      continue;
    }

    await db.runAsync(
      `UPDATE invoices
       SET invoice_number = ?
       WHERE id = ?`,
      `FB-${nextInvoiceNumber}`,
      invoice.id
    );
    nextInvoiceNumber += 1;
  }

  await setSetting(db, BUSINESS_SETTING_KEYS.nextInvoiceNumber, String(nextInvoiceNumber));
}

async function backfillInvoiceFinancials(db: DatabaseClient): Promise<void> {
  const businessProfile = await getBusinessProfile(db);
  const invoices = await db.getAllAsync<
    Pick<
      InvoiceRecord,
      | 'id'
      | 'job_id'
      | 'total'
      | 'subtotal'
      | 'tax_amount'
      | 'labor_total'
      | 'parts_subtotal'
      | 'labor_hours'
      | 'hourly_rate'
      | 'discount_amount'
      | 'tax_percent'
      | 'currency'
      | 'tax_labor'
      | 'tax_materials'
    >
  >(
    `SELECT id, job_id, total, subtotal, tax_amount, labor_total, parts_subtotal, labor_hours, hourly_rate,
            discount_amount, tax_percent, currency, tax_labor, tax_materials
     FROM invoices`
  );

  for (const invoice of invoices) {
    const partsSubtotal = await getPartsSubtotalForJob(db, invoice.job_id);
    const laborTotal = getLaborTotal(invoice.hourly_rate, invoice.labor_hours);
    const subtotal = Math.max(0, roundMoney(laborTotal + partsSubtotal - invoice.discount_amount));
    const total = roundMoney(invoice.total);
    const taxAmount = roundMoney(total - subtotal);
    const taxPreferences = inferTaxPreferences({
      laborTotal,
      partsSubtotal,
      discountAmount: invoice.discount_amount,
      taxPercent: invoice.tax_percent,
      taxAmount,
      fallback: {
        taxLabor: invoice.tax_labor === 1,
        taxMaterials: invoice.tax_materials === 1,
      },
    });

    await db.runAsync(
      `UPDATE invoices
       SET labor_total = ?,
           parts_subtotal = ?,
           subtotal = ?,
           tax_amount = ?,
           currency = ?,
           tax_labor = ?,
           tax_materials = ?
       WHERE id = ?`,
      laborTotal,
      partsSubtotal,
      subtotal,
      taxAmount,
      normalizeCurrencyValue(invoice.currency || businessProfile.currency),
      taxPreferences.taxLabor ? 1 : 0,
      taxPreferences.taxMaterials ? 1 : 0,
      invoice.id
    );
  }
}

function inferTaxPreferences(input: {
  laborTotal: number;
  partsSubtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  fallback: TaxPreferences;
}): TaxPreferences {
  if (input.taxPercent <= 0 || input.taxAmount <= 0) {
    return input.fallback;
  }

  const candidates: TaxPreferences[] = [
    { taxLabor: false, taxMaterials: false },
    { taxLabor: true, taxMaterials: false },
    { taxLabor: false, taxMaterials: true },
    { taxLabor: true, taxMaterials: true },
  ];

  let bestMatch = input.fallback;
  let smallestDiff = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const taxableSubtotal = Math.max(
      0,
      roundMoney(
        (candidate.taxLabor ? input.laborTotal : 0) +
          (candidate.taxMaterials ? input.partsSubtotal : 0) -
          input.discountAmount
      )
    );
    const candidateTaxAmount = roundMoney(taxableSubtotal * (input.taxPercent / 100));
    const diff = Math.abs(candidateTaxAmount - input.taxAmount);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

function parseInvoiceNumber(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const match = /^FB-(\d+)$/.exec(value.trim());
  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10);
}

export function getPartLineTotal(part: Pick<JobPartRecord, 'quantity' | 'unit_price'>): number {
  return getLineTotal(part.quantity, part.unit_price);
}
