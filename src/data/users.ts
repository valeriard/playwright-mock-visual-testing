export interface Credentials {
  email: string;
  password: string;
}

/** Reads a required environment variable; fails fast with a clear message if it is missing. */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const VALID_USER: Credentials = {
  email: requireEnv('CUSTOMER_EMAIL'),
  password: requireEnv('CUSTOMER_PASSWORD'),
};

export const INVALID_USER: Credentials = {
  email: requireEnv('CUSTOMER_EMAIL'),
  password: requireEnv('CUSTOMER_INVALID_PASSWORD'),
};

/** Dedicated account for hybrid tests (real API). Kept apart from the customer used in negative tests, which can get locked. */
export function hybridUser(): Credentials {
  return { email: requireEnv('HYBRID_USER_EMAIL'), password: requireEnv('HYBRID_USER_PASSWORD') };
}
