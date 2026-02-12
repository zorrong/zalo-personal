import type { ZaloPersonalUserInfo } from "./types.js";

export interface ZaloPersonalProbeResult {
  ok: boolean;
  user?: ZaloPersonalUserInfo;
  error?: string;
}

export async function probeZaloPersonal(timeoutMs?: number): Promise<ZaloPersonalProbeResult> {
  try {
    const { getApi } = await import("./zalo-client.js");
    const api = await getApi();

    const timeoutPromise = timeoutMs
      ? new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Probe timed out")), timeoutMs),
        )
      : null;

    const infoPromise = api.fetchAccountInfo();
    const info = timeoutPromise
      ? await Promise.race([infoPromise, timeoutPromise])
      : await infoPromise;

    if (!info?.userId) {
      return { ok: false, error: "Failed to parse user info" };
    }
    return {
      ok: true,
      user: {
        userId: info.userId,
        displayName: info.displayName,
        avatar: info.avatar,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
