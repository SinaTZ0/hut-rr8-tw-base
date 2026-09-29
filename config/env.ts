import "dotenv/config";

/*===== Environment =====*/

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function resolveDatabaseUrl() {
  const databaseUrl = requiredEnvironmentVariable("DATABASE_URL");
  if (process.env.NODE_ENV !== "test") return databaseUrl;

  const testDatabaseUrl = requiredEnvironmentVariable("TEST_DATABASE_URL");
  const applicationUrl = new URL(databaseUrl);
  const testUrl = new URL(testDatabaseUrl);

  // Test requests and cleanup must never point at the application database.
  if (applicationUrl.host === testUrl.host && applicationUrl.pathname === testUrl.pathname) {
    throw new Error("TEST_DATABASE_URL must use a different database from DATABASE_URL.");
  }

  return testDatabaseUrl;
}

export const env = {
  databaseUrl: resolveDatabaseUrl(),
  get altchaHmacSecret() {
    return requiredEnvironmentVariable("ALTCHA_HMAC_SECRET");
  },
} as const;
