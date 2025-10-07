import { z } from 'zod';
import { ServerContext } from '../types.js';
import { zUser } from '../utils/user.js';
import { getIssues, zIssue } from '../utils/issue.js';
import { ApiFactory } from '@tigerdata/mcp-boilerplate';

const inputSchema = {
  user_id: z.string().nullable().describe('Filter issues by assignee user ID'),
  project_id: z.string().nullable().describe('Filter issues by project ID'),
  updated_after: z
    .string()
    .datetime()
    .describe(
      'Filter issues that have been updated at or after this date (ISO 8601 format).',
    )
    .default(() => {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      return date.toISOString();
    }),
} as const;

const outputSchema = {
  issues: z.array(zIssue),
  involvedUsers: z.array(zUser),
} as const;

export const getIssuesFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ linear }) => ({
  name: 'get_issues',
  method: 'get',
  route: '/issues',
  config: {
    title: 'Get Issues',
    description: 'Fetches issues filtered by user ID and/or project ID.',
    inputSchema,
    outputSchema,
  },
  fn: async ({ user_id, project_id, updated_after }) => {
    const result = await getIssues(linear, {
      userId: user_id,
      projectId: project_id,
      updatedAfter: updated_after,
    });

    return result;
  },
});
