import { Zalo, LoginQRCallbackEventType, type API } from "zca-js";
import type { LoginQRCallbackEvent } from "zca-js";
import {
  saveCredentials,
  loadCredentials,
  deleteCredentials,
  hasCredentials,
} from "./credentials.js";

let apiInstance: API | null = null;
let currentUid: string | null = null;

export type QrCallback = (event: LoginQRCallbackEvent) => unknown;

export async function loginWithQR(callback?: QrCallback): Promise<API> {
  const zalo = new Zalo({ logging: false });
  const api = await zalo.loginQR(undefined, (event) => {
    if (event.type === LoginQRCallbackEventType.GotLoginInfo && event.data) {
      saveCredentials({
        imei: event.data.imei,
        cookie: event.data.cookie,
        userAgent: event.data.userAgent,
      });
    }
    callback?.(event);
  });
  apiInstance = api;
  try {
    const info = await api.fetchAccountInfo();
    currentUid = info?.userId ?? null;
  } catch {
    // non-critical
  }
  return api;
}

export async function loginWithCredentials(): Promise<API> {
  const creds = loadCredentials();
  if (!creds) {
    throw new Error("No saved credentials found. Login with QR first.");
  }
  const zalo = new Zalo({ logging: false });
  const api = await zalo.login({
    imei: creds.imei,
    cookie: creds.cookie as any,
    userAgent: creds.userAgent,
    language: creds.language,
  });
  apiInstance = api;
  try {
    const info = await api.fetchAccountInfo();
    currentUid = info?.userId ?? null;
  } catch {
    // non-critical
  }
  return api;
}

export async function getApi(): Promise<API> {
  if (apiInstance) {
    return apiInstance;
  }
  if (hasCredentials()) {
    return loginWithCredentials();
  }
  throw new Error("Not authenticated. Login with QR first.");
}

export function getApiSync(): API | null {
  return apiInstance;
}

export function getCurrentUid(): string | null {
  return currentUid;
}

export function isAuthenticated(): boolean {
  return apiInstance !== null;
}

export function hasStoredCredentials(): boolean {
  return hasCredentials();
}

export async function logout(): Promise<void> {
  apiInstance = null;
  currentUid = null;
  deleteCredentials();
}

export async function ensureAuthenticated(): Promise<API> {
  if (apiInstance) {
    return apiInstance;
  }
  return loginWithCredentials();
}
