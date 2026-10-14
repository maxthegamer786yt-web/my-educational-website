import defaultCodes from '../data/accessCodes.json';

const STORAGE_KEY_VALID_CODES = 'goon_valid_codes';
const STORAGE_KEY_USED_CODES = 'goon_used_codes';
const STORAGE_KEY_DEVICE_REMEMBERED = 'goon_device_authorized';
const STORAGE_KEY_IS_ADMIN = 'goon_is_admin';
const STORAGE_KEY_ADMIN_CODE = 'goon_admin_code';
const STORAGE_KEY_LOCKDOWN = 'goon_lockdown_active';

export const DEFAULT_ADMIN_CODE = 'MOKSH-ADMIN-777';

export function getAdminCode() {
  return localStorage.getItem(STORAGE_KEY_ADMIN_CODE) || DEFAULT_ADMIN_CODE;
}

export function setAdminCode(newCode) {
  if (!newCode || !newCode.trim()) return false;
  localStorage.setItem(STORAGE_KEY_ADMIN_CODE, newCode.trim().toUpperCase());
  return true;
}

export function isAdminUser() {
  return localStorage.getItem(STORAGE_KEY_IS_ADMIN) === 'true';
}

export function setAdminUser(val) {
  if (val) {
    localStorage.setItem(STORAGE_KEY_IS_ADMIN, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_IS_ADMIN);
  }
}

export function isLockdownActive() {
  return localStorage.getItem(STORAGE_KEY_LOCKDOWN) === 'true';
}

export function setLockdown(val) {
  localStorage.setItem(STORAGE_KEY_LOCKDOWN, val ? 'true' : 'false');
}

export function getValidCodes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VALID_CODES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return defaultCodes;
}

export function getUsedCodes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USED_CODES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

export function verifyAndConsumeCode(inputCode) {
  if (!inputCode) {
    return { success: false, message: 'Please enter an access code.' };
  }

  const clean = inputCode.trim().toUpperCase();
  const currentAdminCode = getAdminCode();

  // 1. Check if user entered the master Admin Code!
  if (clean === currentAdminCode) {
    setAdminUser(true);
    localStorage.setItem(STORAGE_KEY_DEVICE_REMEMBERED, 'true');
    localStorage.setItem('goon_device_auth_time', new Date().toISOString());
    localStorage.setItem('goon_device_activated_code', 'ADMIN-ROOT');
    return { success: true, isAdmin: true, message: 'Admin verified! Full control granted.' };
  }

  // 2. Check if arcade is currently in Admin Lockdown mode
  if (isLockdownActive()) {
    return {
      success: false,
      message: 'Arcade is in Lockdown mode by Moksh/Admin. Only Admin Code can enter.'
    };
  }

  const validCodes = getValidCodes();
  const usedCodes = getUsedCodes();

  // 3. Check if code was already consumed
  if (usedCodes.some((u) => (typeof u === 'string' ? u : u.code) === clean)) {
    return {
      success: false,
      message: 'This access code has already been used. Each code is one-time use only.'
    };
  }

  // 4. Check if code exists in valid active list
  const isMatch = validCodes.some((c) => c.toUpperCase() === clean);

  if (isMatch) {
    // Burn the code forever and track when it was used
    const record = {
      code: clean,
      usedAt: new Date().toISOString(),
    };
    const updatedUsed = [record, ...usedCodes];
    localStorage.setItem(STORAGE_KEY_USED_CODES, JSON.stringify(updatedUsed));

    // Remove from active valid pool
    const updatedValid = validCodes.filter((c) => c.toUpperCase() !== clean);
    localStorage.setItem(STORAGE_KEY_VALID_CODES, JSON.stringify(updatedValid));

    // Permanently authorize this device
    setAdminUser(false);
    localStorage.setItem(STORAGE_KEY_DEVICE_REMEMBERED, 'true');
    localStorage.setItem('goon_device_auth_time', new Date().toISOString());
    localStorage.setItem('goon_device_activated_code', clean);

    return { success: true, isAdmin: false };
  }

  return {
    success: false,
    message: 'Invalid access code. Please check your code or request a new one from the Admin.'
  };
}

export function isDeviceAuthorized() {
  if (isLockdownActive() && !isAdminUser()) {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY_DEVICE_REMEMBERED) === 'true';
}

export function lockArcade() {
  localStorage.removeItem(STORAGE_KEY_DEVICE_REMEMBERED);
}

// Admin generator utility: generates clean, readable 1-time codes
export function generateRandomCode(prefix = 'GOON') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${part1}-${part2}`;
}

export function generateBatchCodes(count = 5, prefix = 'GOON') {
  const newCodes = [];
  for (let i = 0; i < count; i++) {
    newCodes.push(generateRandomCode(prefix));
  }
  const current = getValidCodes();
  const merged = Array.from(new Set([...current, ...newCodes]));
  localStorage.setItem(STORAGE_KEY_VALID_CODES, JSON.stringify(merged));
  return newCodes;
}

export function revokeCode(codeToRevoke) {
  const current = getValidCodes();
  const filtered = current.filter((c) => c.toUpperCase() !== codeToRevoke.toUpperCase());
  localStorage.setItem(STORAGE_KEY_VALID_CODES, JSON.stringify(filtered));
  return filtered;
}

export function revokeAllAuthorizations() {
  // Clears device authorizations
  localStorage.removeItem(STORAGE_KEY_DEVICE_REMEMBERED);
}
