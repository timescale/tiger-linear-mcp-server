import { LinearClient } from '@linear/sdk';
import { ServerContext } from './types.js';
import { Store } from './utils/store.js';
import { User } from './utils/user.js';
import { getUsers } from './utils/getUsers.js';

export const serverInfo = {
  name: 'tiger-linear',
  version: '1.0.0',
} as const;

const apiKey = process.env.LINEAR_API_KEY;
if (!apiKey) {
  throw new Error('LINEAR_API_KEY environment variable is required.');
}

const linear = new LinearClient({
  apiKey,
});

const userStore = new Store<User>({ fetch: () => getUsers(linear) });

export const context: ServerContext = { linear, userStore };
