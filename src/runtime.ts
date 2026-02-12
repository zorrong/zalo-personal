import type { PluginRuntime } from "openclaw/plugin-sdk";

let runtime: PluginRuntime | null = null;

export function setZaloPersonalRuntime(next: PluginRuntime): void {
  runtime = next;
}

export function getZaloPersonalRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("ZaloPersonal runtime not initialized");
  }
  return runtime;
}
