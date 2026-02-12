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
        "Send messages and access data via Zalo personal account (zca-js). " +
        "Actions: send (text message), image (send image URL), link (send link), " +
        "friends (list/search friends), groups (list groups), me (profile info), status (auth check).",
      parameters: ZaloPersonalToolSchema,
      execute: executeZaloPersonalTool,
    } as AnyAgentTool);
  },
};

export default plugin;
