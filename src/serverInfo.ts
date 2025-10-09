import { LinearClient } from '@linear/sdk';
import { ServerContext } from './types.js';
import { Store } from './utils/store.js';
import { User } from './utils/user.js';
import { Project } from './utils/project.js';
import { getUsers } from './utils/getUsers.js';
import { getProjects } from './utils/getProjects.js';
import { log } from '@tigerdata/mcp-boilerplate';

const USER_CACHE_TTL = 1000 * 60 * 60; // one hour
const PROJECTS_CACHE_TTL = 1000 * 60 * 60; // one hour

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

const userStore = new Store<User>({
  fetch: () => getUsers(linear),
  ttl: USER_CACHE_TTL,
});
const projectStore = new Store<Project>({
  fetch: () => getProjects(linear),
  ttl: PROJECTS_CACHE_TTL,
});

projectStore
  .get()
  .catch((e) => log.error('Failed to fetch projects on init', e));

userStore.get().catch((e) => log.error('Failed to fetch users on init', e));

export const context: ServerContext = { linear, userStore, projectStore };
