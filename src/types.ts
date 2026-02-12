export type ZaloPersonalAccountConfig = {
  enabled?: boolean;
  name?: string;
  dmPolicy?: "pairing" | "allowlist" | "open" | "disabled";
  allowFrom?: Array<string | number>;
  groupPolicy?: "open" | "allowlist" | "disabled";
  groups?: Record<
    string,
    { allow?: boolean; enabled?: boolean; tools?: { allow?: string[]; deny?: string[] } }
  >;
  messagePrefix?: string;
  responsePrefix?: string;
};

export type ZaloPersonalConfig = {
  enabled?: boolean;
  name?: string;
  defaultAccount?: string;
  dmPolicy?: "pairing" | "allowlist" | "open" | "disabled";
  allowFrom?: Array<string | number>;
  groupPolicy?: "open" | "allowlist" | "disabled";
  groups?: Record<
    string,
    { allow?: boolean; enabled?: boolean; tools?: { allow?: string[]; deny?: string[] } }
  >;
  messagePrefix?: string;
  responsePrefix?: string;
  accounts?: Record<string, ZaloPersonalAccountConfig>;
};

export type ResolvedZaloPersonalAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  authenticated: boolean;
  config: ZaloPersonalAccountConfig;
};

export type ZaloPersonalUserInfo = {
  userId: string;
  displayName: string;
  avatar?: string;
};

export type ZaloPersonalFriend = {
  userId: string;
  displayName: string;
  avatar?: string;
};

export type ZaloPersonalGroup = {
  groupId: string;
  name: string;
  memberCount?: number;
};

export type ZaloPersonalMessage = {
  threadId: string;
  msgId?: string;
  cliMsgId?: string;
  type: number;
  content: string;
  timestamp: number;
  metadata?: {
    isGroup: boolean;
    threadName?: string;
    senderName?: string;
    fromId?: string;
  };
};
