import type { AnyAgentTool, OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { zaloPersonalDock, zaloPersonalPlugin } from "./src/channel.js";
import { setZaloPersonalRuntime } from "./src/runtime.js";
import { ZaloPersonalToolSchema, executeZaloPersonalTool } from "./src/tool.js";

const plugin = {
  id: "zalo-personal",
  name: "Zalo Personal",
  description: "Zalo personal account messaging via zca-js library",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setZaloPersonalRuntime(api.runtime);
    // Register channel plugin (for onboarding & gateway)
    api.registerChannel({ plugin: zaloPersonalPlugin, dock: zaloPersonalDock });

    // Register agent tool
    api.registerTool({
      name: "zalo-personal",
      label: "Zalo Personal",
      description:
        "Send messages and manage Zalo personal account (zca-js). " +
        "Messaging: send (text), image (image URL), link (send link). " +
        "Info: friends (list/search), groups (list), me (profile), status (auth). " +
        "Blocklist: block-user (global block), unblock-user (global unblock), " +
        "block-user-in-group (block in specific group), unblock-user-in-group (unblock in group), " +
        "list-blocked (show blocked users), list-allowed (show allowed users). " +
        "Names are auto-resolved to IDs. Gateway restart required after blocklist changes.",
      parameters: ZaloPersonalToolSchema,
      execute: executeZaloPersonalTool,
    } as AnyAgentTool);
  },
};

export default plugin;
