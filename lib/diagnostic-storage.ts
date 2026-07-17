import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type DiagnosticStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function normalizeKey(key: string) {
  const trimmed = key.trim();
  if (!trimmed) return "default";

  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
}

const nativeStorage: DiagnosticStorage = {
  async getItem(key: string) {
    const normalizedKey = normalizeKey(key);

    try {
      return await SecureStore.getItemAsync(normalizedKey);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    const normalizedKey = normalizeKey(key);

    try {
      await SecureStore.setItemAsync(normalizedKey, value);
    } catch {
      // Ignora falhas de armazenamento em ambientes não suportados.
    }
  },
  async removeItem(key: string) {
    const normalizedKey = normalizeKey(key);

    try {
      await SecureStore.deleteItemAsync(normalizedKey);
    } catch {
      // Ignora falhas de armazenamento em ambientes não suportados.
    }
  },
};

const webStorage: DiagnosticStorage = {
  async getItem(key: string) {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
  },
};

export const diagnosticStorage: DiagnosticStorage =
  Platform.OS === "web" ? webStorage : nativeStorage;
