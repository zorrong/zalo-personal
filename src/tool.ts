import { Type } from "@sinclair/typebox";
import { ThreadType } from "zca-js";
import { getApi } from "./zalo-client.js";
import {
  readOpenClawConfig,
  writeOpenClawConfig,
  addToDenyFrom,
  removeFromDenyFrom,
  addToGroupDenyUsers,
  removeFromGroupDenyUsers,
  listBlockedUsers,
  listAllowedUsers,
  listBlockedUsersInGroup,
} from "./config-manager.js";

const ACTIONS = [
  "send",
  "image",
  "link",
  "friends",
  "groups",
  "me",
  "status",
  "block-user",
  "unblock-user",
  "block-user-in-group",
  "unblock-user-in-group",
  "list-blocked",
  "list-allowed",
] as const;

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
    query: Type.Optional(Type.String({ description: "Search query for users/groups" })),
    url: Type.Optional(Type.String({ description: "URL for media/link" })),
    userId: Type.Optional(Type.String({ description: "User ID or name for block/unblock operations" })),
    groupId: Type.Optional(Type.String({ description: "Group ID or name for group-specific operations" })),
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
  userId?: string;
  groupId?: string;
};

function json(payload: unknown): AgentToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    details: payload,
  };
}

/**
 * Resolve user name to ID using friend list
 */
async function resolveUserId(nameOrId: string): Promise<string> {
  // If already numeric ID, return as-is
  if (/^\d+$/.test(nameOrId)) {
    return nameOrId;
  }

  // Search in friends list
  const api = await getApi();
  const friends = await api.getAllFriends();
  const friendList = Array.isArray(friends) ? friends : [];

  const query = nameOrId.toLowerCase();
  const match = friendList.find(
    (f: any) =>
      (f.displayName ?? "").toLowerCase() === query ||
      (f.zaloName ?? "").toLowerCase() === query ||
      String(f.userId) === nameOrId,
  );

  if (match) {
    return String(match.userId);
  }

  throw new Error(`User not found: ${nameOrId}. Use numeric ID or exact display name.`);
}

/**
 * Resolve group name to ID using group list
 */
async function resolveGroupId(nameOrId: string): Promise<string> {
  // If already looks like group ID, return as-is
  if (/^\d+$/.test(nameOrId)) {
    return nameOrId;
  }

  // Search in groups list
  const api = await getApi();
  const groupsResp = await api.getAllGroups();
  const groupIds = Object.keys(groupsResp?.gridVerMap ?? {});

  if (groupIds.length === 0) {
    throw new Error("No groups found");
  }

  try {
    const infoResp = await api.getGroupInfo(groupIds);
    const gridInfoMap = infoResp?.gridInfoMap ?? {};

    const query = nameOrId.toLowerCase();
    const match = Object.entries(gridInfoMap).find(([_id, info]: [string, any]) =>
      (info.name ?? "").toLowerCase() === query,
    );

    if (match) {
      return match[0]; // Return group ID
    }
  } catch {
    // Fallback: try to match by ID directly
  }

  throw new Error(`Group not found: ${nameOrId}. Use numeric group ID or exact group name.`);
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

      case "block-user": {
        if (!params.userId) {
          throw new Error("userId required for block-user action");
        }
        const userId = await resolveUserId(params.userId);
        const config = readOpenClawConfig();
        const updated = addToDenyFrom(config, userId);
        writeOpenClawConfig(updated);
        return json({
          success: true,
          action: "blocked",
          userId,
          message: `User ${params.userId} (ID: ${userId}) has been blocked globally`,
          note: "Restart gateway for changes to take effect: openclaw gateway restart",
        });
      }

      case "unblock-user": {
        if (!params.userId) {
          throw new Error("userId required for unblock-user action");
        }
        const userId = await resolveUserId(params.userId);
        const config = readOpenClawConfig();
        const updated = removeFromDenyFrom(config, userId);
        writeOpenClawConfig(updated);
        return json({
          success: true,
          action: "unblocked",
          userId,
          message: `User ${params.userId} (ID: ${userId}) has been unblocked`,
          note: "Restart gateway for changes to take effect: openclaw gateway restart",
        });
      }

      case "block-user-in-group": {
        if (!params.userId) {
          throw new Error("userId required for block-user-in-group action");
        }
        if (!params.groupId) {
          throw new Error("groupId required for block-user-in-group action");
        }
        const userId = await resolveUserId(params.userId);
        const groupId = await resolveGroupId(params.groupId);
        const config = readOpenClawConfig();
        const updated = addToGroupDenyUsers(config, groupId, userId);
        writeOpenClawConfig(updated);
        return json({
          success: true,
          action: "blocked_in_group",
          userId,
          groupId,
          message: `User ${params.userId} (ID: ${userId}) has been blocked in group ${params.groupId} (ID: ${groupId})`,
          note: "Restart gateway for changes to take effect: openclaw gateway restart",
        });
      }

      case "unblock-user-in-group": {
        if (!params.userId) {
          throw new Error("userId required for unblock-user-in-group action");
        }
        if (!params.groupId) {
          throw new Error("groupId required for unblock-user-in-group action");
        }
        const userId = await resolveUserId(params.userId);
        const groupId = await resolveGroupId(params.groupId);
        const config = readOpenClawConfig();
        const updated = removeFromGroupDenyUsers(config, groupId, userId);
        writeOpenClawConfig(updated);
        return json({
          success: true,
          action: "unblocked_in_group",
          userId,
          groupId,
          message: `User ${params.userId} (ID: ${userId}) has been unblocked in group ${params.groupId} (ID: ${groupId})`,
          note: "Restart gateway for changes to take effect: openclaw gateway restart",
        });
      }

      case "list-blocked": {
        const config = readOpenClawConfig();
        const blocked = listBlockedUsers(config);
        return json({
          blocked,
          count: blocked.length,
          message: blocked.length > 0
            ? `Blocked users (${blocked.length}): ${blocked.join(", ")}`
            : "No users blocked globally",
        });
      }

      case "list-allowed": {
        const config = readOpenClawConfig();
        const allowed = listAllowedUsers(config);
        return json({
          allowed,
          count: allowed.length,
          message: allowed.length > 0
            ? `Allowed users (${allowed.length}): ${allowed.join(", ")}`
            : "No explicit allow list (check dmPolicy setting)",
        });
      }

      default: {
        params.action satisfies never;
        throw new Error(
          `Unknown action: ${String(params.action)}. Valid actions: ${ACTIONS.join(", ")}`,
        );
      }
    }
  } catch (err) {
    return json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
