#!/usr/bin/env node
import 'dotenv/config';
import { cliEntrypoint } from '@tigerdata/mcp-boilerplate';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

cliEntrypoint(
  join(__dirname, 'stdio.js'),
  join(__dirname, 'httpServer.js'),
).catch(console.error);
