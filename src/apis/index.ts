import { getIssueFactory } from './getIssue.js';
import { getUsersFactory } from './getUsers.js';

export const apiFactories = [getIssueFactory, getUsersFactory] as const;
