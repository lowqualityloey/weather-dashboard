import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEnvVar, env } from './env';

describe('env utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('returns the value when environment variable is present and valid', () => {
    vi.stubEnv('VITE_TEST_API_KEY', 'valid-api-key-123');
    expect(getEnvVar('VITE_TEST_API_KEY')).toBe('valid-api-key-123');
  });

  it('warns and returns empty string when environment variable is missing / undefined', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const value = getEnvVar('VITE_NON_EXISTENT_VAR');

    expect(value).toBe('');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `[Env Warning] Missing required environment variable: "VITE_NON_EXISTENT_VAR". API requests will fail until you define VITE_NON_EXISTENT_VAR in your .env file.`,
    );
  });

  it('warns and returns empty string when environment variable is empty or whitespace only', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.stubEnv('VITE_EMPTY_VAR', '   ');
    const value = getEnvVar('VITE_EMPTY_VAR');

    expect(value).toBe('');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `[Env Warning] Missing required environment variable: "VITE_EMPTY_VAR". API requests will fail until you define VITE_EMPTY_VAR in your .env file.`,
    );
  });

  it('exports env object with OPENWEATHER_API_KEY', () => {
    expect(env).toHaveProperty('OPENWEATHER_API_KEY');
    expect(typeof env.OPENWEATHER_API_KEY).toBe('string');
  });
});
