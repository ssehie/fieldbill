export const FIELD_BILL_FREE_INVOICE_LIMIT = 3;
export const FIELD_BILL_PRO_ENTITLEMENT_ID = 'pro';
export const FIELD_BILL_PRO_FALLBACK_PRICE = '$29.99';

export function getFreeInvoicesRemaining(invoiceCount: number): number {
  return Math.max(0, FIELD_BILL_FREE_INVOICE_LIMIT - invoiceCount);
}

export function needsProToCreateInvoice(invoiceCount: number, hasProAccess: boolean): boolean {
  return !hasProAccess && invoiceCount >= FIELD_BILL_FREE_INVOICE_LIMIT;
}
