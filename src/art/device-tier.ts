/**
 * Detects budget/low-end mobile hardware (e.g. <= 4 CPU cores, <= 4 GB RAM, or Save-Data mode)
 * so we can reduce canvas DPR & frame rate without altering the experience on iPhones or desktops.
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) {
    return true;
  }
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) {
    return true;
  }
  return false;
}
