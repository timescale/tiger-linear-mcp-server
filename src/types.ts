import type { LinearClient } from '@linear/sdk';
import { Store } from './utils/store.js';
import { User } from './utils/user.js';
import { Project } from './utils/project.js';

export interface ServerContext extends Record<string, unknown> {
  linear: LinearClient;
  userStore: Store<User>;
  projectStore: Store<Project>;
}
