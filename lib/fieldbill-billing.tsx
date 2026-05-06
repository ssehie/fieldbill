import React from 'react';
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  type PurchasesError,
} from 'react-native-purchases';

import {
  getBillingAccessSnapshot,
  saveBillingAccessSnapshot,
} from '@/lib/fieldbill-db';
import { useFieldBillDb } from '@/lib/fieldbill-db-provider';
import { fieldBillDebugLog } from '@/lib/fieldbill-debug';
import {
  FIELD_BILL_PRO_ENTITLEMENT_ID,
  FIELD_BILL_PRO_FALLBACK_PRICE,
} from '@/lib/fieldbill-monetization';

type FieldBillBillingContextValue = {
  isReady: boolean;
  isConfigured: boolean;
  isBillingEnabled: boolean;
  canGateInvoices: boolean;
  hasProAccess: boolean;
  priceLabel: string;
  packageToPurchase: PurchasesPackage | null;
  error: string;
  isPurchasing: boolean;
  isRestoring: boolean;
  refresh: () => Promise<void>;
  purchasePro: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
};

const FieldBillBillingContext = React.createContext<FieldBillBillingContextValue | null>(null);

export function FieldBillBillingProvider({ children }: { children: React.ReactNode }) {
  const db = useFieldBillDb();
  const [isReady, setIsReady] = React.useState(false);
  const [hasProAccess, setHasProAccess] = React.useState(false);
  const [packageToPurchase, setPackageToPurchase] = React.useState<PurchasesPackage | null>(null);
  const [priceLabel, setPriceLabel] = React.useState(FIELD_BILL_PRO_FALLBACK_PRICE);
  const [error, setError] = React.useState('');
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [nativeRuntimeAvailable, setNativeRuntimeAvailable] = React.useState(true);
  const configuredRef = React.useRef(false);
  const customerInfoListenerRef = React.useRef<((customerInfo: CustomerInfo) => void) | null>(null);

  const platformApiKey = React.useMemo(() => getRevenueCatApiKey(), []);
  const entitlementId = React.useMemo(
    () => process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID?.trim() || FIELD_BILL_PRO_ENTITLEMENT_ID,
    []
  );
  const preferredOfferingId = React.useMemo(
    () => process.env.EXPO_PUBLIC_REVENUECAT_OFFERING_ID?.trim() || null,
    []
  );
  const preferredPackageId = React.useMemo(
    () => process.env.EXPO_PUBLIC_REVENUECAT_PACKAGE_ID?.trim() || null,
    []
  );
  const isConfigured = Boolean(platformApiKey);
  const isBillingEnabled = isConfigured && nativeRuntimeAvailable;
  const canGateInvoices = isBillingEnabled && (hasProAccess || packageToPurchase !== null);

  const applyCustomerInfo = React.useCallback(
    async (customerInfo: CustomerInfo) => {
      const nextHasProAccess = hasActiveEntitlement(customerInfo, entitlementId);

      await saveBillingAccessSnapshot(db, {
        proAccessUnlocked: nextHasProAccess,
        proAccessSyncedAt: new Date().toISOString(),
      });

      setHasProAccess(nextHasProAccess);
      fieldBillDebugLog('billing.customer_info', {
        entitlementId,
        hasProAccess: nextHasProAccess,
        originalAppUserId: customerInfo.originalAppUserId,
      });
    },
    [db, entitlementId]
  );

  const refresh = React.useCallback(async () => {
    if (!isBillingEnabled) {
      setError('');
      setPackageToPurchase(null);
      setPriceLabel(FIELD_BILL_PRO_FALLBACK_PRICE);
      setIsReady(true);
      return;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      await applyCustomerInfo(customerInfo);

      const offerings = await Purchases.getOfferings();
      const selectedOffering = preferredOfferingId
        ? offerings.all[preferredOfferingId] ?? offerings.current
        : offerings.current;
      const nextPackage = selectPurchasePackage(selectedOffering, preferredPackageId);

      setPackageToPurchase(nextPackage);
      setPriceLabel(nextPackage?.product.priceString ?? FIELD_BILL_PRO_FALLBACK_PRICE);
      setError(nextPackage ? '' : 'Pro purchase is not configured yet.');
      setIsReady(true);
      fieldBillDebugLog('billing.refresh', {
        configured: true,
        hasProAccess: hasActiveEntitlement(customerInfo, entitlementId),
        offeringId: nextPackage?.presentedOfferingContext.offeringIdentifier ?? null,
        packageId: nextPackage?.identifier ?? null,
      });
    } catch (billingError) {
      setError(normalizeBillingError(billingError, 'Could not load Pro access.'));
      setPackageToPurchase(null);
      setPriceLabel(FIELD_BILL_PRO_FALLBACK_PRICE);
      setIsReady(true);
      fieldBillDebugLog('billing.refresh.failed', {
        message: billingError instanceof Error ? billingError.message : String(billingError),
      });
    }
  }, [applyCustomerInfo, entitlementId, isBillingEnabled, preferredOfferingId, preferredPackageId]);

  React.useEffect(() => {
    let isActive = true;

    const bootstrapBilling = async () => {
      const localSnapshot = await getBillingAccessSnapshot(db);

      if (!isActive) {
        return;
      }

      setHasProAccess(localSnapshot.proAccessUnlocked);

      if (!isConfigured) {
        setIsReady(true);
        fieldBillDebugLog('billing.disabled', {
          platform: Platform.OS,
          reason: 'missing_api_key',
        });
        return;
      }

      try {
        if (!configuredRef.current) {
          if (__DEV__) {
            Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
          }

          Purchases.configure({ apiKey: platformApiKey });
          configuredRef.current = true;
          customerInfoListenerRef.current = (customerInfo) => {
            void applyCustomerInfo(customerInfo);
          };
          Purchases.addCustomerInfoUpdateListener(customerInfoListenerRef.current);
          fieldBillDebugLog('billing.configure.success', {
            platform: Platform.OS,
          });
        }

        setNativeRuntimeAvailable(true);
        await refresh();
      } catch (billingError) {
        setNativeRuntimeAvailable(false);
        setError('');
        setPackageToPurchase(null);
        setPriceLabel(FIELD_BILL_PRO_FALLBACK_PRICE);
        setIsReady(true);
        fieldBillDebugLog('billing.disabled', {
          platform: Platform.OS,
          reason: 'runtime_unavailable',
          message: billingError instanceof Error ? billingError.message : String(billingError),
        });
      }
    };

    void bootstrapBilling();

    return () => {
      isActive = false;

      if (customerInfoListenerRef.current) {
        Purchases.removeCustomerInfoUpdateListener(customerInfoListenerRef.current);
        customerInfoListenerRef.current = null;
      }
    };
  }, [applyCustomerInfo, db, isConfigured, platformApiKey, refresh]);

  const purchasePro = React.useCallback(async (): Promise<boolean> => {
    if (!isBillingEnabled || !packageToPurchase) {
      setError('Pro purchase is not ready yet.');
      return false;
    }

    setIsPurchasing(true);
    setError('');

    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      await applyCustomerInfo(customerInfo);

      if (!hasActiveEntitlement(customerInfo, entitlementId)) {
        throw new Error('Purchase completed but Pro did not unlock.');
      }

      fieldBillDebugLog('billing.purchase.success', {
        entitlementId,
        packageId: packageToPurchase.identifier,
      });
      return true;
    } catch (billingError) {
      if (isUserCancelledPurchase(billingError)) {
        fieldBillDebugLog('billing.purchase.cancelled', {
          packageId: packageToPurchase.identifier,
        });
        return false;
      }

      setError(normalizeBillingError(billingError, 'Could not complete the purchase.'));
      fieldBillDebugLog('billing.purchase.failed', {
        message: billingError instanceof Error ? billingError.message : String(billingError),
      });
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [applyCustomerInfo, entitlementId, isBillingEnabled, packageToPurchase]);

  const restorePurchases = React.useCallback(async (): Promise<boolean> => {
    if (!isBillingEnabled) {
      setError('Restore is not ready yet.');
      return false;
    }

    setIsRestoring(true);
    setError('');

    try {
      const customerInfo = await Purchases.restorePurchases();
      await applyCustomerInfo(customerInfo);

      const restoredProAccess = hasActiveEntitlement(customerInfo, entitlementId);
      fieldBillDebugLog('billing.restore.completed', {
        entitlementId,
        restoredProAccess,
      });

      if (!restoredProAccess) {
        setError('No Pro purchase was found.');
      }

      return restoredProAccess;
    } catch (billingError) {
      setError(normalizeBillingError(billingError, 'Could not restore purchases.'));
      fieldBillDebugLog('billing.restore.failed', {
        message: billingError instanceof Error ? billingError.message : String(billingError),
      });
      return false;
    } finally {
      setIsRestoring(false);
    }
  }, [applyCustomerInfo, entitlementId, isBillingEnabled]);

  const value = React.useMemo<FieldBillBillingContextValue>(
    () => ({
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
    }),
    [
      error,
      canGateInvoices,
      hasProAccess,
      isBillingEnabled,
      isConfigured,
      isPurchasing,
      isReady,
      isRestoring,
      packageToPurchase,
      priceLabel,
      purchasePro,
      refresh,
      restorePurchases,
    ]
  );

  return <FieldBillBillingContext.Provider value={value}>{children}</FieldBillBillingContext.Provider>;
}

export function useFieldBillBilling(): FieldBillBillingContextValue {
  const value = React.useContext(FieldBillBillingContext);

  if (!value) {
    throw new Error('useFieldBillBilling must be used within FieldBillBillingProvider.');
  }

  return value;
}

function getRevenueCatApiKey(): string {
  if (Platform.OS === 'ios') {
    if (__DEV__) {
      const testApiKey = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_TEST_API_KEY?.trim();
      if (testApiKey) {
        return testApiKey;
      }
    }

    return process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY?.trim() ?? '';
  }

  if (Platform.OS === 'android') {
    if (__DEV__) {
      const testApiKey = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_TEST_API_KEY?.trim();
      if (testApiKey) {
        return testApiKey;
      }
    }

    return process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY?.trim() ?? '';
  }

  return '';
}

function hasActiveEntitlement(customerInfo: CustomerInfo, entitlementId: string): boolean {
  return typeof customerInfo.entitlements.active[entitlementId] !== 'undefined';
}

function selectPurchasePackage(
  offering: PurchasesOffering | null,
  preferredPackageId: string | null
): PurchasesPackage | null {
  if (!offering) {
    return null;
  }

  if (preferredPackageId) {
    const preferredPackage = offering.availablePackages.find((item) => item.identifier === preferredPackageId);
    if (preferredPackage) {
      return preferredPackage;
    }
  }

  return (
    offering.lifetime
    ?? offering.availablePackages.find((item) => item.packageType === PACKAGE_TYPE.LIFETIME)
    ?? offering.availablePackages.find((item) => item.product.price > 0)
    ?? offering.availablePackages[0]
    ?? null
  );
}

function isUserCancelledPurchase(error: unknown): boolean {
  const purchasesError = error as Partial<PurchasesError> | null;

  return purchasesError?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

function normalizeBillingError(error: unknown, fallbackMessage: string): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return fallbackMessage;
}
