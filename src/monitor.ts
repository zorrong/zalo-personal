import type { OpenClawConfig, MarkdownTableMode, RuntimeEnv } from "openclaw/plugin-sdk";
import { createReplyPrefixOptions, mergeAllowlist, summarizeMapping } from "openclaw/plugin-sdk";
import { ThreadType, type API, type Message, type UserMessage, type GroupMessage } from "zca-js";
import type { ResolvedZaloPersonalAccount, ZaloPersonalFriend, ZaloPersonalGroup, ZaloPersonalMessage } from "./types.js";
import { getZaloPersonalRuntime } from "./runtime.js";
import { sendMessageZaloPersonal } from "./send.js";
import { getApi, getCurrentUid } from "./zalo-client.js";

export type ZaloPersonalMonitorOptions = {
  account: ResolvedZaloPersonalAccount;
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  abortSignal: AbortSignal;
  statusSink?: (patch: { lastInboundAt?: number; lastOutboundAt?: number }) => void;
};

export type ZaloPersonalMonitorResult = {
  stop: () => void;
};

const ZALOJS_TEXT_LIMIT = 2000;

function normalizeZaloPersonalEntry(entry: string): string {
  return entry.replace(/^(zalo-personal|zp):/i, "").trim();
}

function buildNameIndex<T>(items: T[], nameFn: (item: T) => string | undefined): Map<string, T[]> {
  const index = new Map<string, T[]>();
  for (const item of items) {
    const name = nameFn(item)?.trim().toLowerCase();
    if (!name) {
      continue;
    }
    const list = index.get(name) ?? [];
    list.push(item);
    index.set(name, list);
  }
  return index;
}

type ZaloPersonalCoreRuntime = ReturnType<typeof getZaloPersonalRuntime>;

function logVerbose(core: ZaloPersonalCoreRuntime, runtime: RuntimeEnv, message: string): void {
  if (core.logging.shouldLogVerbose()) {
    runtime.log(`[zalo-personal] ${message}`);
  }
}

function isSenderAllowed(senderId: string, allowFrom: string[]): boolean {
  if (allowFrom.includes("*")) {
    return true;
  }
  const normalizedSenderId = senderId.toLowerCase();
  return allowFrom.some((entry) => {
    const normalized = entry.toLowerCase().replace(/^(zalo-personal|zp):/i, "");
    return normalized === normalizedSenderId;
  });
}

function normalizeGroupSlug(raw?: string | null): string {
  const trimmed = raw?.trim().toLowerCase() ?? "";
  if (!trimmed) {
    return "";
  }
  return trimmed
    .replace(/^#/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isGroupAllowed(params: {
  groupId: string;
  groupName?: string | null;
  groups: Record<string, { allow?: boolean; enabled?: boolean }>;
}): boolean {
  const groups = params.groups ?? {};
  const keys = Object.keys(groups);
  if (keys.length === 0) {
    return false;
  }
  const candidates = [
    params.groupId,
    `group:${params.groupId}`,
    params.groupName ?? "",
    normalizeGroupSlug(params.groupName ?? ""),
  ].filter(Boolean);
  for (const candidate of candidates) {
    const entry = groups[candidate];
    if (!entry) {
      continue;
    }
    return entry.allow !== false && entry.enabled !== false;
  }
  const wildcard = groups["*"];
  if (wildcard) {
    return wildcard.allow !== false && wildcard.enabled !== false;
  }
  return false;
}

function convertToZaloPersonalMessage(msg: Message): ZaloPersonalMessage | null {
  const data = msg.data;
  const content = typeof data.content === "string" ? data.content : "";
  if (!content.trim()) {
    return null;
  }

  const isGroup = msg.type === ThreadType.Group;
  const threadId = msg.threadId;
  // For DMs, if uidFrom is not numeric (obfuscated ID), use threadId instead
  const rawSenderId = data.uidFrom;
  const senderId = !isGroup && !/^\d+$/.test(rawSenderId)
    ? threadId  // DM: use threadId as user ID when uidFrom is not numeric
    : rawSenderId;
  const senderName = data.dName ?? "";
  const timestamp = data.ts ? parseInt(data.ts, 10) : Math.floor(Date.now() / 1000);

  return {
    threadId,
    msgId: data.msgId,
    cliMsgId: data.cliMsgId,
    type: isGroup ? 1 : 0,
    content,
    timestamp,
    metadata: {
      isGroup,
      threadName: isGroup ? (data as any).idTo ?? threadId : undefined,
      senderName,
      fromId: senderId,
    },
  };
}

async function processMessage(
  message: ZaloPersonalMessage,
  account: ResolvedZaloPersonalAccount,
  config: OpenClawConfig,
  core: ZaloPersonalCoreRuntime,
  runtime: RuntimeEnv,
  statusSink?: (patch: { lastInboundAt?: number; lastOutboundAt?: number }) => void,
): Promise<void> {
  const { threadId, content, timestamp, metadata } = message;
  if (!content?.trim()) {
    return;
  }

  const isGroup = metadata?.isGroup ?? false;
  const senderId = metadata?.fromId ?? threadId;
  const senderName = metadata?.senderName ?? "";
  const groupName = metadata?.threadName ?? "";
  const chatId = threadId;

  const defaultGroupPolicy = config.channels?.defaults?.groupPolicy;
  const groupPolicy = account.config.groupPolicy ?? defaultGroupPolicy ?? "open";
  const groups = account.config.groups ?? {};
  if (isGroup) {
    if (groupPolicy === "disabled") {
      logVerbose(core, runtime, `'zalo-personal': drop group ${chatId} (groupPolicy=disabled)`);
      return;
    }
    if (groupPolicy === "allowlist") {
      const allowed = isGroupAllowed({ groupId: chatId, groupName, groups });
      if (!allowed) {
        logVerbose(core, runtime, `'zalo-personal': drop group ${chatId} (not allowlisted)`);
        return;
      }
    }
  }

  const dmPolicy = account.config.dmPolicy ?? "pairing";
  const configAllowFrom = (account.config.allowFrom ?? []).map((v) => String(v));
  const rawBody = content.trim();
  const shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
  const storeAllowFrom =
    !isGroup && (dmPolicy !== "open" || shouldComputeAuth)
      ? await core.channel.pairing.readAllowFromStore("zalo-personal").catch(() => [])
      : [];
  const effectiveAllowFrom = [...configAllowFrom, ...storeAllowFrom];
  const useAccessGroups = config.commands?.useAccessGroups !== false;
  const senderAllowedForCommands = isSenderAllowed(senderId, effectiveAllowFrom);
  const commandAuthorized = shouldComputeAuth
    ? core.channel.commands.resolveCommandAuthorizedFromAuthorizers({
        useAccessGroups,
        authorizers: [
          { configured: effectiveAllowFrom.length > 0, allowed: senderAllowedForCommands },
        ],
      })
    : undefined;

  if (!isGroup) {
    if (dmPolicy === "disabled") {
      logVerbose(core, runtime, `Blocked zalo-personal DM from ${senderId} (dmPolicy=disabled)`);
      return;
    }

    if (dmPolicy !== "open") {
      const allowed = senderAllowedForCommands;

      if (!allowed) {
        if (dmPolicy === "pairing") {
          const { code, created } = await core.channel.pairing.upsertPairingRequest({
            channel: "zalo-personal",
            id: senderId,
            meta: { name: senderName || undefined },
          });

          if (created) {
            logVerbose(core, runtime, `zalo-personal pairing request sender=${senderId}`);
            try {
              await sendMessageZaloPersonal(
                chatId,
                core.channel.pairing.buildPairingReply({
                  channel: "zalo-personal",
                  idLine: `Your Zalo user id: ${senderId}`,
                  code,
                }),
              );
              statusSink?.({ lastOutboundAt: Date.now() });
            } catch (err) {
              logVerbose(
                core,
                runtime,
                `zalo-personal pairing reply failed for ${senderId}: ${String(err)}`,
              );
            }
          }
        } else {
          logVerbose(
            core,
            runtime,
            `Blocked unauthorized zalo-personal sender ${senderId} (dmPolicy=${dmPolicy})`,
          );
        }
        return;
      }
    }
  }

  if (
    isGroup &&
    core.channel.commands.isControlCommandMessage(rawBody, config) &&
    commandAuthorized !== true
  ) {
    logVerbose(
      core,
      runtime,
      `'zalo-personal': drop control command from unauthorized sender ${senderId}`,
    );
    return;
  }

  const peer = isGroup
    ? { kind: "group" as const, id: chatId }
    : { kind: "group" as const, id: senderId };

  const route = core.channel.routing.resolveAgentRoute({
    cfg: config,
    channel: "zalo-personal",
    accountId: account.accountId,
    peer: {
      kind: peer.kind,
      id: peer.id,
    },
  });

  const fromLabel = isGroup ? `group:${chatId}` : senderName || `user:${senderId}`;
  const storePath = core.channel.session.resolveStorePath(config.session?.store, {
    agentId: route.agentId,
  });
  const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(config);
  const previousTimestamp = core.channel.session.readSessionUpdatedAt({
    storePath,
    sessionKey: route.sessionKey,
  });
  const body = core.channel.reply.formatAgentEnvelope({
    channel: "Zalo JS",
    from: fromLabel,
    timestamp: timestamp ? timestamp * 1000 : undefined,
    previousTimestamp,
    envelope: envelopeOptions,
    body: rawBody,
  });

  const ctxPayload = core.channel.reply.finalizeInboundContext({
    Body: body,
    RawBody: rawBody,
    CommandBody: rawBody,
    From: isGroup ? `'zalo-personal':group:${chatId}` : `'zalo-personal':${senderId}`,
    To: `'zalo-personal':${chatId}`,
    SessionKey: route.sessionKey,
    AccountId: route.accountId,
    ChatType: isGroup ? "group" : "direct",
    ConversationLabel: fromLabel,
    SenderName: senderName || undefined,
    SenderId: senderId,
    CommandAuthorized: commandAuthorized,
    Provider: "zalo-personal",
    Surface: "zalo-personal",
    MessageSid: message.msgId ?? `${timestamp}`,
    OriginatingChannel: "zalo-personal",
    OriginatingTo: `'zalo-personal':${chatId}`,
  });

  await core.channel.session.recordInboundSession({
    storePath,
    sessionKey: ctxPayload.SessionKey ?? route.sessionKey,
    ctx: ctxPayload,
    onRecordError: (err) => {
      runtime.error?.(`'zalo-personal': failed updating session meta: ${String(err)}`);
    },
  });

  const { onModelSelected, ...prefixOptions } = createReplyPrefixOptions({
    cfg: config,
    agentId: route.agentId,
    channel: "zalo-personal",
    accountId: account.accountId,
  });

  await core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
    ctx: ctxPayload,
    cfg: config,
    dispatcherOptions: {
      ...prefixOptions,
      deliver: async (payload) => {
        await deliverZaloPersonalReply({
          payload: payload as { text?: string; mediaUrls?: string[]; mediaUrl?: string },
          chatId,
          isGroup,
          runtime,
          core,
          config,
          accountId: account.accountId,
          statusSink,
          tableMode: core.channel.text.resolveMarkdownTableMode({
            cfg: config,
            channel: "zalo-personal",
            accountId: account.accountId,
          }),
        });
      },
      onError: (err, info) => {
        runtime.error(`[${account.accountId}] ZaloPersonal ${info.kind} reply failed: ${String(err)}`);
      },
    },
    replyOptions: {
      onModelSelected,
    },
  });
}

async function deliverZaloPersonalReply(params: {
  payload: { text?: string; mediaUrls?: string[]; mediaUrl?: string };
  chatId: string;
  isGroup: boolean;
  runtime: RuntimeEnv;
  core: ZaloPersonalCoreRuntime;
  config: OpenClawConfig;
  accountId?: string;
  statusSink?: (patch: { lastInboundAt?: number; lastOutboundAt?: number }) => void;
  tableMode?: MarkdownTableMode;
}): Promise<void> {
  const { payload, chatId, isGroup, runtime, core, config, accountId, statusSink } = params;
  const tableMode = params.tableMode ?? "code";
  const text = core.channel.text.convertMarkdownTables(payload.text ?? "", tableMode);

  const mediaList = payload.mediaUrls?.length
    ? payload.mediaUrls
    : payload.mediaUrl
      ? [payload.mediaUrl]
      : [];

  if (mediaList.length > 0) {
    let first = true;
    for (const mediaUrl of mediaList) {
      const caption = first ? text : undefined;
      first = false;
      try {
        logVerbose(core, runtime, `Sending media to ${chatId}`);
        await sendMessageZaloPersonal(chatId, caption ?? "", {
          mediaUrl,
          isGroup,
        });
        statusSink?.({ lastOutboundAt: Date.now() });
      } catch (err) {
        runtime.error(`ZaloPersonal media send failed: ${String(err)}`);
      }
    }
    return;
  }

  if (text) {
    const chunkMode = core.channel.text.resolveChunkMode(config, "zalo-personal", accountId);
    const chunks = core.channel.text.chunkMarkdownTextWithMode(
      text,
      ZALOJS_TEXT_LIMIT,
      chunkMode,
    );
    logVerbose(core, runtime, `Sending ${chunks.length} text chunk(s) to ${chatId}`);
    for (const chunk of chunks) {
      try {
        await sendMessageZaloPersonal(chatId, chunk, { isGroup });
        statusSink?.({ lastOutboundAt: Date.now() });
      } catch (err) {
        runtime.error(`ZaloPersonal message send failed: ${String(err)}`);
      }
    }
  }
}

export async function monitorZaloPersonalProvider(
  options: ZaloPersonalMonitorOptions,
): Promise<ZaloPersonalMonitorResult> {
  let { account, config } = options;
  const { abortSignal, statusSink, runtime } = options;

  const core = getZaloPersonalRuntime();
  let stopped = false;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;
  let resolveRunning: (() => void) | null = null;

  // Resolve allowFrom name→id mappings using zca-js API
  try {
    const allowFromEntries = (account.config.allowFrom ?? [])
      .map((entry) => normalizeZaloPersonalEntry(String(entry)))
      .filter((entry) => entry && entry !== "*");

    if (allowFromEntries.length > 0) {
      try {
        const api = await getApi();
        const friends = await api.getAllFriends();
        const friendList: ZaloPersonalFriend[] = Array.isArray(friends)
          ? friends.map((f: any) => ({
              userId: String(f.userId),
              displayName: f.displayName ?? f.zaloName ?? "",
              avatar: f.avatar,
            }))
          : [];
        const byName = buildNameIndex(friendList, (friend) => friend.displayName);
        const additions: string[] = [];
        const mapping: string[] = [];
        const unresolved: string[] = [];
        for (const entry of allowFromEntries) {
          if (/^\d+$/.test(entry)) {
            additions.push(entry);
            continue;
          }
          const matches = byName.get(entry.toLowerCase()) ?? [];
          const match = matches[0];
          const id = match?.userId ? String(match.userId) : undefined;
          if (id) {
            additions.push(id);
            mapping.push(`${entry}→${id}`);
          } else {
            unresolved.push(entry);
          }
        }
        const allowFrom = mergeAllowlist({ existing: account.config.allowFrom, additions });
        account = {
          ...account,
          config: {
            ...account.config,
            allowFrom,
          },
        };
        summarizeMapping("zalo-personal users", mapping, unresolved, runtime);
      } catch (err) {
        runtime.log?.(`zalo-personal user resolve failed; using config entries. ${String(err)}`);
      }
    }

    // Resolve group name→id mappings
    const groupsConfig = account.config.groups ?? {};
    const groupKeys = Object.keys(groupsConfig).filter((key) => key !== "*");
    if (groupKeys.length > 0) {
      try {
        const api = await getApi();
        const groupsResp = await api.getAllGroups();
        const groupIds = Object.keys(groupsResp?.gridVerMap ?? {});
        let groupList: ZaloPersonalGroup[] = [];
        if (groupIds.length > 0) {
          try {
            const infoResp = await api.getGroupInfo(groupIds);
            const gridInfoMap = infoResp?.gridInfoMap ?? {};
            groupList = Object.entries(gridInfoMap).map(([id, info]: [string, any]) => ({
              groupId: id,
              name: info.name ?? "",
              memberCount: info.totalMember,
            }));
          } catch {
            groupList = groupIds.map((id) => ({ groupId: id, name: "", memberCount: 0 }));
          }
        }
        const byName = buildNameIndex(groupList, (group) => group.name);
        const mapping: string[] = [];
        const unresolved: string[] = [];
        const nextGroups = { ...groupsConfig };
        for (const entry of groupKeys) {
          const cleaned = normalizeZaloPersonalEntry(entry);
          if (/^\d+$/.test(cleaned)) {
            if (!nextGroups[cleaned]) {
              nextGroups[cleaned] = groupsConfig[entry];
            }
            mapping.push(`${entry}→${cleaned}`);
            continue;
          }
          const matches = byName.get(cleaned.toLowerCase()) ?? [];
          const match = matches[0];
          const id = match?.groupId ? String(match.groupId) : undefined;
          if (id) {
            if (!nextGroups[id]) {
              nextGroups[id] = groupsConfig[entry];
            }
            mapping.push(`${entry}→${id}`);
          } else {
            unresolved.push(entry);
          }
        }
        account = {
          ...account,
          config: {
            ...account.config,
            groups: nextGroups,
          },
        };
        summarizeMapping("zalo-personal groups", mapping, unresolved, runtime);
      } catch (err) {
        runtime.log?.(`zalo-personal group resolve failed; using config entries. ${String(err)}`);
      }
    }
  } catch (err) {
    runtime.log?.(`zalo-personal resolve failed; using config entries. ${String(err)}`);
  }

  const stop = () => {
    stopped = true;
    if (restartTimer) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }
    resolveRunning?.();
  };

  const startListener = async () => {
    if (stopped || abortSignal.aborted) {
      resolveRunning?.();
      return;
    }

    logVerbose(core, runtime, `[${account.accountId}] starting zca-js listener`);

    try {
      const api = await getApi();
      const selfUid = getCurrentUid();

      // Register event handlers only once before starting
      api.listener.on("message", (msg: Message) => {
        // Skip self messages
        if (msg.isSelf) {
          return;
        }
        // Skip messages from our own UID
        if (selfUid && msg.data.uidFrom === selfUid) {
          return;
        }

        const converted = convertToZaloPersonalMessage(msg);
        if (!converted) {
          return;
        }

        logVerbose(core, runtime, `[${account.accountId}] inbound message`);
        statusSink?.({ lastInboundAt: Date.now() });
        processMessage(converted, account, config, core, runtime, statusSink).catch((err) => {
          runtime.error(`[${account.accountId}] Failed to process message: ${String(err)}`);
        });
      });

      api.listener.on("error", (err: unknown) => {
        const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
        runtime.error(`[${account.accountId}] zca-js listener error: ${errMsg}`);
      });

      api.listener.on("closed", (code: number, reason: string) => {
        runtime.log?.(`[${account.accountId}] zca-js listener closed: code=${code} reason=${reason}`);
        // Let retryOnClose handle reconnection automatically; only resolve if stopped
        if (stopped || abortSignal.aborted) {
          resolveRunning?.();
        }
      });

      // Use retryOnClose to let zca-js handle reconnection — do NOT also restart manually
      api.listener.start({ retryOnClose: true });
    } catch (err) {
      runtime.error(`[${account.accountId}] zca-js listener start failed: ${String(err)}`);
      if (!stopped && !abortSignal.aborted) {
        logVerbose(core, runtime, `[${account.accountId}] retrying listener in 10s...`);
        restartTimer = setTimeout(startListener, 10000);
      } else {
        resolveRunning?.();
      }
    }
  };

  const runningPromise = new Promise<void>((resolve) => {
    resolveRunning = resolve;
    abortSignal.addEventListener("abort", () => {
      stop();
      resolve();
    }, { once: true });
  });

  await startListener();
  await runningPromise;

  return { stop };
}
