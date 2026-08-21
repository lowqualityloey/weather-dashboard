// src/lib/env.ts
function getEnvVar(key: string): string {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim() === '') {
    console.warn(
      `[Env Warning] Missing required environment variable: "${key}". ` +
        `API requests will fail until you define ${key} in your .env file.`,
    );
    return '';
  }

  return value;
}

export const env = {
  OPENWEATHER_API_KEY: getEnvVar('VITE_OPENWEATHER_API_KEY'),
};
