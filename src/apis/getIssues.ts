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
    .describe(
      'Filter issues by assignee user ID. Do not use in conjunction with username.',
    ),
  project_id: z.string().nullable().describe('Filter issues by project ID'),
  updated_after: z.coerce
    .date()
    .nullable()
    .describe(
      'Filter issues that have been updated at or after this date (ISO 8601 format). Defaults to 7 days ago.',
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
  }): Promise<InferSchema<typeof outputSchema>> => {
    return getIssues(linear, {
      userId: user_id,
      projectId: project_id,
      updatedAfter: updated_after?.toISOString() || getDateTimeFromDaysAgo(7),
    });
  },
});
