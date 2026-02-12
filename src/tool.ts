import { Type } from "@sinclair/typebox";
import { ThreadType } from "zca-js";
import { getApi } from "./zalo-client.js";

const ACTIONS = ["send", "image", "link", "friends", "groups", "me", "status"] as const;

type AgentToolResult = {
  content: Array<{ type: string; text: string }>;
  details?: unknown;
};

function stringEnum<T extends readonly string[]>(
  values: T,
  options: { description?: string } = {},
) {
  return Type.Unsafe<T[number]>({
    type: "string",
    enum: [...values],
    ...options,
  });
}

export const ZaloPersonalToolSchema = Type.Object(
  {
    action: stringEnum(ACTIONS, { description: `Action to perform: ${ACTIONS.join(", ")}` }),
    threadId: Type.Optional(Type.String({ description: "Thread ID for messaging" })),
    message: Type.Optional(Type.String({ description: "Message text" })),
    isGroup: Type.Optional(Type.Boolean({ description: "Is group chat" })),
    query: Type.Optional(Type.String({ description: "Search query" })),
    url: Type.Optional(Type.String({ description: "URL for media/link" })),
  },
  { additionalProperties: false },
);

type ToolParams = {
  action: (typeof ACTIONS)[number];
  threadId?: string;
  message?: string;
  isGroup?: boolean;
  query?: string;
  url?: string;
};

function json(payload: unknown): AgentToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  };
}

export async function executeZaloPersonalTool(
  _toolCallId: string,
  params: ToolParams,
  _signal?: AbortSignal,
  _onUpdate?: unknown,
): Promise<AgentToolResult> {
  try {
    switch (params.action) {
      case "send": {
        if (!params.threadId || !params.message) {
          throw new Error("threadId and message required for send action");
        }
        const api = await getApi();
        const type = params.isGroup ? ThreadType.Group : ThreadType.User;
        const result = await api.sendMessage(
          { msg: params.message },
          params.threadId,
          type,
        );
        return json({ success: true, messageId: result?.message?.msgId });
      }

      case "image": {
        if (!params.threadId) {
          throw new Error("threadId required for image action");
        }
        if (!params.url) {
          throw new Error("url required for image action");
        }
        const api = await getApi();
        const type = params.isGroup ? ThreadType.Group : ThreadType.User;
        const result = await api.sendLink(
          { url: params.url, title: params.message || params.url },
          params.threadId,
          type,
        );
        return json({ success: true, messageId: result?.message?.msgId });
      }

      case "link": {
        if (!params.threadId || !params.url) {
          throw new Error("threadId and url required for link action");
        }
        const api = await getApi();
        const type = params.isGroup ? ThreadType.Group : ThreadType.User;
        const result = await api.sendLink(
          { url: params.url },
          params.threadId,
          type,
        );
        return json({ success: true, messageId: result?.message?.msgId });
      }

      case "friends": {
        const api = await getApi();
        const friends = await api.getAllFriends();
        let friendList = Array.isArray(friends) ? friends : [];
        if (params.query?.trim()) {
          const q = params.query.trim().toLowerCase();
          friendList = friendList.filter(
            (f: any) =>
              (f.displayName ?? "").toLowerCase().includes(q) ||
              (f.zaloName ?? "").toLowerCase().includes(q),
          );
        }
        const mapped = friendList.map((f: any) => ({
          userId: f.userId,
          displayName: f.displayName,
          avatar: f.avatar,
        }));
        return json(mapped);
      }

      case "groups": {
        const api = await getApi();
        const groupsResp = await api.getAllGroups();
        const groupIds = Object.keys(groupsResp?.gridVerMap ?? {});
        if (groupIds.length === 0) {
          return json([]);
        }
        try {
          const infoResp = await api.getGroupInfo(groupIds);
          const gridInfoMap = infoResp?.gridInfoMap ?? {};
          const groups = Object.entries(gridInfoMap).map(([id, info]: [string, any]) => ({
            groupId: id,
            name: info.name,
            totalMember: info.totalMember,
          }));
          return json(groups);
        } catch {
          return json(groupIds.map((id) => ({ groupId: id })));
        }
      }

      case "me": {
        const api = await getApi();
        const info = await api.fetchAccountInfo();
        return json(info ? {
          userId: info.userId,
          displayName: info.displayName,
          avatar: info.avatar,
        } : null);
      }

      case "status": {
        const { isAuthenticated, hasStoredCredentials } = await import("./zalo-client.js");
        return json({
          authenticated: isAuthenticated(),
          hasCredentials: hasStoredCredentials(),
        });
      }

      default: {
        params.action satisfies never;
        throw new Error(
          `Unknown action: ${String(params.action)}. Valid actions: send, image, link, friends, groups, me, status`,
        );
      }
    }
  } catch (err) {
    return json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
