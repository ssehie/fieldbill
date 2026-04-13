export function roundMoney(value: number): number {
  return Number(value.toFixed(2));
}

export function getElapsedHours(
  startTime: string,
  endTime: string | number | null | undefined = Date.now()
): number {
  const startMs = new Date(startTime).getTime();
  const endMs = typeof endTime === 'number' ? endTime : new Date(endTime ?? Date.now()).getTime();

  return Math.max(0, (endMs - startMs) / (1000 * 60 * 60));
}

export function getLaborTotal(hourlyRate: number, hours: number): number {
  return roundMoney(hourlyRate * hours);
}

export function getLineTotal(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}
