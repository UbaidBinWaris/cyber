"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-only external stores read via useSyncExternalStore. This is the
 * React-blessed way to read browser-only state (localStorage) without the
 * "setState synchronously in an effect" anti-pattern: the store is the source
 * of truth, components subscribe, and SSR gets a stable server snapshot.
 */

const PROGRESS_KEY = "cg-progress";
const PROGRESS_EVENT = "cg-progress-change";
const THEME_KEY = "cg-theme";
const THEME_EVENT = "cg-theme-change";

function subscribe(event: string) {
  return (cb: () => void) => {
    window.addEventListener(event, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(event, cb);
      window.removeEventListener("storage", cb);
    };
  };
}

// ---- Progress (set of completed chapter slugs) ----
let progressCache: { raw: string | null; value: string[] } = { raw: null, value: [] };

function getProgressSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PROGRESS_KEY);
  } catch {
    raw = null;
  }
  // Cache by raw string so the snapshot is referentially stable between reads
  // (useSyncExternalStore requires a stable snapshot to avoid infinite loops).
  if (raw !== progressCache.raw) {
    progressCache = { raw, value: raw ? (JSON.parse(raw) as string[]) : [] };
  }
  return progressCache.value;
}

const EMPTY: string[] = [];

export function useCompleted(): Set<string> {
  const slugs = useSyncExternalStore(
    subscribe(PROGRESS_EVENT),
    getProgressSnapshot,
    () => EMPTY
  );
  return new Set(slugs);
}

export function toggleCompleted(slug: string): void {
  const current = new Set(getProgressSnapshot());
  if (current.has(slug)) current.delete(slug);
  else current.add(slug);
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...current]));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    /* storage unavailable: nothing persists, UI stays in prior state */
  }
}

// ---- Theme ----
function getThemeSnapshot(): "dark" | "light" {
  try {
    return (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark";
  } catch {
    return "dark";
  }
}

export function useTheme(): "dark" | "light" {
  return useSyncExternalStore(subscribe(THEME_EVENT), getThemeSnapshot, () => "dark");
}

export function toggleTheme(): void {
  const next = getThemeSnapshot() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new Event(THEME_EVENT));
  } catch {
    window.dispatchEvent(new Event(THEME_EVENT));
  }
}
