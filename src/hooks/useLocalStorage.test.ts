import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('cities', ['Taupō']));
    expect(result.current[0]).toEqual(['Taupō']);
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('cities', JSON.stringify(['Auckland', 'Wellington']));
    const { result } = renderHook(() => useLocalStorage('cities', ['Taupō']));
    expect(result.current[0]).toEqual(['Auckland', 'Wellington']);
  });

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('cities', ['Taupō']));

    act(() => {
      result.current[1](['Taupō', 'Christchurch']);
    });

    expect(result.current[0]).toEqual(['Taupō', 'Christchurch']);
    expect(JSON.parse(localStorage.getItem('cities')!)).toEqual(['Taupō', 'Christchurch']);
  });
});
