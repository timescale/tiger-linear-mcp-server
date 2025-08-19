#!/usr/bin/env node
import { apiFactories } from './apis/index.js';
import { context, serverInfo } from './serverInfo.js';
import { stdioServerFactory } from './shared/boilerplate/src/stdio.js';

stdioServerFactory({
  ...serverInfo,
  context,
  apiFactories,
});
