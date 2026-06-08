'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

/** Same-tab + cross-tab listeners per localStorage key. */
const listenersByKey = new Map<string, Set<() => void>>();

function subscribeKey(key: string, onStoreChange: () => void) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    set?.delete(onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

function notifyKey(key: string) {
  listenersByKey.get(key)?.forEach((listener) => listener());
}

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

function readRaw(key: string): string | null {
  return window.localStorage.getItem(key);
}

function writeRaw(key: string, value: unknown) {
  const stringified = JSON.stringify(value);
  window.localStorage.setItem(key, stringified);
  dispatchStorageEvent(key, stringified);
  notifyKey(key);
}

function removeRaw(key: string) {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
  notifyKey(key);
}

function parseSnapshot<T>(raw: string | null, initialValue: T): T {
  if (raw === null) {
    return initialValue;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
}

/**
 * localStorage state safe for Next.js SSR.
 * All hook instances with the same `key` stay in sync (same tab and other tabs).
 * First SSR/hydration paint uses `initialValue`; stored value applies on the client.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeKey(key, onStoreChange),
    [key],
  );

  const getSnapshot = useCallback(() => readRaw(key), [key]);

  const getServerSnapshot = useCallback(() => null as string | null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = parseSnapshot(raw, initialValue);

  useEffect(() => {
    try {
      if (readRaw(key) === null) {
        writeRaw(key, initialValue);
      }
    } catch {
      // private mode / quota
    }
  }, [key, initialValue]);

  const setPersisted = useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const current = parseSnapshot(readRaw(key), initialValue);
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(current) : next;

        if (resolved === undefined || resolved === null) {
          removeRaw(key);
        } else {
          writeRaw(key, resolved);
        }
      } catch {
        // ignore
      }
    },
    [key, initialValue],
  );

  return [value, setPersisted];
}
