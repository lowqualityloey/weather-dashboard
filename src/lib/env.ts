// src/lib/env.ts
function getOptionalEnvVar(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  return value?.trim() ?? '';
}

export const env = {
  OPENWEATHER_API_KEY: getOptionalEnvVar('VITE_OPENWEATHER_API_KEY'),
};
