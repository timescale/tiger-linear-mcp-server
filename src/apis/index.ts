import { getIssueFactory } from './getIssue.js';
import { getUsersFactory } from './getUsers.js';
import { getProjectsFactory } from './getProjects.js';

export const apiFactories = [getIssueFactory, getUsersFactory, getProjectsFactory] as const;
