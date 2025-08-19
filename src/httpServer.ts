#!/usr/bin/env node
import { apiFactories } from './apis/index.js';
import { httpServerFactory } from './shared/boilerplate/src/httpServer.js';
import { context, serverInfo } from './serverInfo.js';

export const { registerCleanupFn } = httpServerFactory({
  ...serverInfo,
  context,
  apiFactories,
});
