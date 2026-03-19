export const RATE_LIMITS = {
  upload: {
    max: 20,
    windowMs: 10 * 60 * 1000,
  },
  shareMeta: {
    max: 120,
    windowMs: 60 * 1000,
  },
  pinVerify: {
    max: 40,
    windowMs: 10 * 60 * 1000,
  },
  download: {
    max: 120,
    windowMs: 60 * 1000,
  },
  archive: {
    max: 30,
    windowMs: 60 * 1000,
  },
} as const;

export const PIN_PROTECTION = {
  maxFailedAttempts: 5,
  attemptWindowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
} as const;
