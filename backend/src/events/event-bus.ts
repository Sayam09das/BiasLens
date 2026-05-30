import { EventEmitter } from "node:events";

class BiasLensEventBus extends EventEmitter {}

declare global {
  // eslint-disable-next-line no-var
  var __biaslensEventBus__: BiasLensEventBus | undefined;
}

export const eventBus =
  globalThis.__biaslensEventBus__ ?? new BiasLensEventBus();

if (process.env.NODE_ENV !== "production") {
  globalThis.__biaslensEventBus__ = eventBus;
}
