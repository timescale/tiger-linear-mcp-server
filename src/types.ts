import type { LinearClient } from '@linear/sdk';
import { Store } from './utils/store.js';
import { User } from './utils/user.js';

export interface ServerContext extends Record<string, unknown> {
  linear: LinearClient;
  userStore: Store<User>;
}
