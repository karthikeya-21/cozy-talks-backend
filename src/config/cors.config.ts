const defaultOrigins = [
  "http://localhost:3000",
];

function normalizeOrigins(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAllowedOrigins() {
  const configuredOrigins = new Set<string>([
    ...defaultOrigins,
    ...normalizeOrigins(process.env.FRONTEND_URL),
    ...normalizeOrigins(process.env.CORS_ORIGINS),
  ]);

  return [...configuredOrigins];
}

export function isAllowedOrigin(origin?: string) {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(origin);
}

export function getCorsOptions() {
  return {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin ?? "unknown"} is not allowed by CORS.`));
    },
    credentials: true,
  };
}

export function getSocketCorsOptions() {
  return {
    origin: getAllowedOrigins(),
    credentials: true,
  };
}
