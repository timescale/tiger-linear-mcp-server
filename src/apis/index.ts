import { getIssueFactory } from './getIssue.js';
import { getIssuesFactory } from './getIssues.js';
import { getUsersFactory } from './getUsers.js';
import { getProjectsFactory } from './getProjects.js';

export const apiFactories = [getIssueFactory, getIssuesFactory, getUsersFactory, getProjectsFactory] as const;
