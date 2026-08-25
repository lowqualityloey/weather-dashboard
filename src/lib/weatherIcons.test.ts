import { describe, it, expect } from 'vitest';
import { getIconUrl, getWindDirection } from './weatherIcons';

describe('weatherIcons utilities', () => {
  describe('getIconUrl', () => {
    it('returns correct openweathermap icon URL for valid icon codes', () => {
      expect(getIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png');
      expect(getIconUrl('10n')).toBe('https://openweathermap.org/img/wn/10n@2x.png');
    });

    it('handles empty or custom string inputs', () => {
      expect(getIconUrl('')).toBe('https://openweathermap.org/img/wn/@2x.png');
      expect(getIconUrl('custom')).toBe('https://openweathermap.org/img/wn/custom@2x.png');
    });
  });

  describe('getWindDirection', () => {
    it('maps cardinal and intercardinal direction exact degree values correctly', () => {
      expect(getWindDirection(0)).toBe('N');
      expect(getWindDirection(45)).toBe('NE');
      expect(getWindDirection(90)).toBe('E');
      expect(getWindDirection(135)).toBe('SE');
      expect(getWindDirection(180)).toBe('S');
      expect(getWindDirection(225)).toBe('SW');
      expect(getWindDirection(270)).toBe('W');
      expect(getWindDirection(315)).toBe('NW');
      expect(getWindDirection(360)).toBe('N');
    });

    it('rounds intermediate degree values to the nearest direction', () => {
      // 0 deg boundary: 0 - 22 deg => N (round(22/45) = 0 => N)
      expect(getWindDirection(22)).toBe('N');
      // 45 deg boundary: 23 - 67 deg => NE (round(23/45) = 1 => NE)
      expect(getWindDirection(23)).toBe('NE');
      expect(getWindDirection(67)).toBe('NE');
      expect(getWindDirection(68)).toBe('E');

      // 360/0 deg wrap boundary: 337 deg => NW (337/45 = 7.488 => 7 => NW), 338 deg => N (338/45 = 7.511 => 8 => 8%8=0 => N)
      expect(getWindDirection(337)).toBe('NW');
      expect(getWindDirection(338)).toBe('N');
    });

    it('handles angles over 360 degrees or negative angles using modulo arithmetic', () => {
      expect(getWindDirection(405)).toBe('NE'); // 405 % 360 = 45 -> NE
      expect(getWindDirection(720)).toBe('N'); // 720 % 360 = 0 -> N
    });
  });
});
