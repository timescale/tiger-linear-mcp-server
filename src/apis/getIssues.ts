import { z } from 'zod';
import { ServerContext } from '../types.js';
import { zUser } from '../utils/user.js';
import { getIssues, zIssue } from '../utils/issue.js';
import { ApiFactory, InferSchema } from '@tigerdata/mcp-boilerplate';
import { getDateTimeFromDaysAgo } from '../utils/date.js';

const inputSchema = {
  user_id: z
    .string()
    .nullable()
    .describe('Filter issues by assignee user ID. Use this or project_id.'),
  project_id: z
    .string()
    .nullable()
    .describe('Filter issues by project ID. Use this or user_id.'),
  updated_after: z.coerce
    .date()
    .nullable()
    .describe(
      'Filter issues that have been updated at or after this date. Defaults to 7 days ago.',
    ),
  updated_before: z.coerce
    .date()
    .nullable()
    .describe(
      'Filter issues that have been updated at or before this date. Defaults to current time.',
    ),
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
  fn: async ({
    user_id,
    project_id,
    updated_after,
    updated_before,
  }): Promise<InferSchema<typeof outputSchema>> => {
    if (!user_id && !project_id) {
      throw new Error('You must specify a user_id or a project_id.');
    }
    return getIssues(linear, {
      userId: user_id,
      projectId: project_id,
      updatedAfter: updated_after?.toISOString() || getDateTimeFromDaysAgo(7),
      updatedBefore: updated_before?.toISOString() || new Date().toISOString(),
    });
  },
});
