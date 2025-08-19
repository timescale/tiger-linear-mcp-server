import type { LinearClient } from '@linear/sdk';

export interface ServerContext extends Record<string, unknown> {
  linear: LinearClient;
}
