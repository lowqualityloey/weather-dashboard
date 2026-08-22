import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherProvider } from '../context/WeatherContext';
import { SearchBar } from './SearchBar';
import { geocodeCity, fetchWeather, reverseGeocode } from '../lib/openWeather';
import type { WeatherData } from '../types/weather';

vi.mock('../lib/openWeather', () => ({
  geocodeCity: vi.fn(),
  fetchWeather: vi.fn(),
  reverseGeocode: vi.fn(),
}));

const geocodeMock = vi.mocked(geocodeCity);
const fetchMock = vi.mocked(fetchWeather);
const reverseMock = vi.mocked(reverseGeocode);

function makeWeather(): WeatherData {
  return {
    timezone: 'UTC',
    timezone_offset: 0,
    current: {
      temp: 20,
      feels_like: 19,
      humidity: 50,
      wind_speed: 3,
      wind_deg: 0,
      weather: [{ description: 'clear sky', icon: '01d' }],
    },
    hourly: [],
    daily: [],
  };
}

function renderSearchBar() {
  return render(
    <WeatherProvider>
      <SearchBar />
    </WeatherProvider>,
  );
}

describe('SearchBar combobox', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
    geocodeMock.mockImplementation(async () => []);
    fetchMock.mockResolvedValue(makeWeather());
    reverseMock.mockResolvedValue('Unknown');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows geocoding suggestions after the debounce delay', async () => {
    geocodeMock.mockResolvedValue([
      { name: 'Auckland', country: 'NZ', state: 'Auckland', lat: -36.85, lon: 174.76 },
      { name: 'Auckland', country: 'US', state: 'California', lat: 37.8, lon: -122.2 },
    ]);

    renderSearchBar();

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Auck' } });

    // Before the 400ms debounce elapses, no suggestions should appear.
    await act(async () => {
      vi.advanceTimersByTime(399);
    });
    expect(screen.queryAllByRole('option')).toHaveLength(0);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    await act(async () => {}); // flush the geocoding microtask
    expect(screen.getAllByRole('option')).toHaveLength(2);

    expect(geocodeMock).toHaveBeenCalledWith('Auck');
  });

  it('does not query geocoding for queries shorter than 2 characters', async () => {
    renderSearchBar();
    geocodeMock.mockClear(); // clear the provider's mount seed (Taupō) call

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    await act(async () => {});

    expect(geocodeMock).not.toHaveBeenCalled();
  });
});
