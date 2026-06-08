const STORAGE_PREFIX = "twins:guard:";

function readBucket(key) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : { attempts: [], lockedUntil: 0 };
  } catch {
    return { attempts: [], lockedUntil: 0 };
  }
}

function writeBucket(key, bucket) {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(bucket));
}

export function checkRateLimit(
  key,
  { maxAttempts = 5, windowMs = 15 * 60 * 1000, lockoutMs = 5 * 60 * 1000 } = {},
) {
  const now = Date.now();
  const bucket = readBucket(key);

  if (bucket.lockedUntil > now) {
    const minutes = Math.ceil((bucket.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Слишком много попыток. Повторите через ${minutes} мин.`,
      retryAfterMs: bucket.lockedUntil - now,
    };
  }

  const recent = bucket.attempts.filter((time) => now - time < windowMs);
  if (recent.length >= maxAttempts) {
    bucket.lockedUntil = now + lockoutMs;
    bucket.attempts = recent;
    writeBucket(key, bucket);
    const minutes = Math.ceil(lockoutMs / 60000);
    return {
      allowed: false,
      message: `Лимит попыток исчерпан. Подождите ${minutes} мин.`,
      retryAfterMs: lockoutMs,
    };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key, { windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const bucket = readBucket(key);
  bucket.attempts = [...bucket.attempts.filter((time) => now - time < windowMs), now];
  writeBucket(key, bucket);
}

export function resetRateLimit(key) {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .trim();
}

export function sanitizeText(
  value = "",
  { maxLength = 200, allowNewlines = false } = {},
) {
  let result = stripHtml(value).replace(/[\u0000-\u001F\u007F]/g, "");
  if (!allowNewlines) result = result.replace(/\s+/g, " ");
  return result.slice(0, maxLength).trim();
}

const actionTimestamps = new Map();

export function throttleAction(key, minIntervalMs = 800) {
  const now = Date.now();
  const last = actionTimestamps.get(key) ?? 0;
  if (now - last < minIntervalMs) {
    return {
      allowed: false,
      message: "Подождите секунду перед повторным действием.",
    };
  }
  actionTimestamps.set(key, now);
  return { allowed: true };
}

export function limitListSize(list, max = 100) {
  return Array.isArray(list) ? list.slice(0, max) : [];
}
