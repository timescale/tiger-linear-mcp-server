import { LinearClient } from '@linear/sdk';
import { ServerContext } from './types.js';
import { Store } from './utils/store.js';
import { User } from './utils/user.js';
import { Project } from './utils/project.js';
import { getUsers } from './utils/getUsers.js';
import { getProjects } from './utils/getProjects.js';
import { log } from './shared/boilerplate/src/logger.js';

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
const projectStore = new Store<Project>({ fetch: () => getProjects(linear) });

projectStore
  .get()
  .catch((e) => log.error('Failed to fetch projects on init', e));

userStore.get().catch((e) => log.error('Failed to fetch users on init', e));

export const context: ServerContext = { linear, userStore, projectStore };
