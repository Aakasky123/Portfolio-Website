import { useSyncExternalStore } from "react";

// A tiny global store. The only shared state on the page is whether the
// agent's view is showing, so this stays deliberately small.
//
// vision: "boot" (first paint, scanning into the human view) | "off" | "on"

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let state = { vision: reduced ? "off" : "boot" };
const subscribers = new Set();

export const store = {
  get: () => state,
  set(patch) {
    state = { ...state, ...patch };
    subscribers.forEach((fn) => fn());
  },
  subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
};

export function useStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}

export function toggleVision() {
  const { vision } = store.get();
  store.set({ vision: vision === "on" ? "off" : "on" });
}
