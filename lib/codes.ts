import crypto from 'crypto';

export function generateCode(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function generateExpiry(minutes = 15): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
