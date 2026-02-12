import { ThreadType } from "zca-js";
import { getApi } from "./zalo-client.js";

export type ZaloPersonalSendOptions = {
  mediaUrl?: string;
  caption?: string;
  isGroup?: boolean;
};

export type ZaloPersonalSendResult = {
  ok: boolean;
  messageId?: string;
  error?: string;
};

export async function sendMessageZaloPersonal(
  threadId: string,
  text: string,
  options: ZaloPersonalSendOptions = {},
): Promise<ZaloPersonalSendResult> {
  if (!threadId?.trim()) {
    return { ok: false, error: "No threadId provided" };
  }

  if (options.mediaUrl) {
    return sendMediaZaloPersonal(threadId, options.mediaUrl, {
      ...options,
      caption: text || options.caption,
    });
  }

  try {
    const api = await getApi();
    const type = options.isGroup ? ThreadType.Group : ThreadType.User;
    const result = await api.sendMessage(
      { msg: text.slice(0, 2000) },
      threadId.trim(),
      type,
    );
    const msgId = result?.message?.msgId;
    return { ok: true, messageId: msgId != null ? String(msgId) : undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendMediaZaloPersonal(
  threadId: string,
  mediaUrl: string,
  options: ZaloPersonalSendOptions = {},
): Promise<ZaloPersonalSendResult> {
  if (!threadId?.trim()) {
    return { ok: false, error: "No threadId provided" };
  }
  if (!mediaUrl?.trim()) {
    return { ok: false, error: "No media URL provided" };
  }

  try {
    const api = await getApi();
    const type = options.isGroup ? ThreadType.Group : ThreadType.User;

    // Use sendLink for URLs as zca-js doesn't support sending images by URL directly
    const result = await api.sendLink(
      {
        url: mediaUrl.trim(),
        title: options.caption || mediaUrl.trim(),
      },
      threadId.trim(),
      type,
    );
    const msgId = result?.message?.msgId;
    return { ok: true, messageId: msgId != null ? String(msgId) : undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendLinkZaloPersonal(
  threadId: string,
  url: string,
  options: ZaloPersonalSendOptions = {},
): Promise<ZaloPersonalSendResult> {
  if (!threadId?.trim()) {
    return { ok: false, error: "No threadId provided" };
  }
  if (!url?.trim()) {
    return { ok: false, error: "No URL provided" };
  }

  try {
    const api = await getApi();
    const type = options.isGroup ? ThreadType.Group : ThreadType.User;
    const result = await api.sendLink(
      { url: url.trim() },
      threadId.trim(),
      type,
    );
    const msgId = result?.message?.msgId;
    return { ok: true, messageId: msgId != null ? String(msgId) : undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
