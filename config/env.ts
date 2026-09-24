import "dotenv/config";

/*===== Environment =====*/

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

const databaseUrl = requiredEnvironmentVariable("DATABASE_URL");

export const env = {
  databaseUrl,
  get altchaHmacSecret() {
    return requiredEnvironmentVariable("ALTCHA_HMAC_SECRET");
  },
} as const;
