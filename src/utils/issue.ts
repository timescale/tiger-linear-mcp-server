import type { LinearClient } from '@linear/sdk';
import { getUser, User } from './user.js';
import { getTeam } from './team.js';
import { getWorkflowState } from './workflowState.js';
import { getProject, zProject } from './project.js';
import { simplifyComment, Comment, zComment } from './comment.js';
import { getIssueLabel } from './issueLabel.js';
import { simplifyAttachment, Attachment, zAttachment } from './attachment.js';
import z from 'zod';
import { fetchAll } from './linear.js';

export const zIssue = z.object({
  assignee: z.string().optional(),
  comments: z.array(zComment),
  createdAt: z.string(),
  creator: z.string().optional(),
  description: z.string(),
  dueDate: z.string().nullable(),
  estimate: z.number().nullable(),
  id: z.string(),
  identifier: z.string(),
  labels: z.array(z.string()),
  parentId: z.string().optional(),
  priority: z.string(),
  project: zProject.nullable(),
  state: z.string().nullable(),
  team: z.string().nullable(),
  title: z.string(),
  url: z.string(),
  attachments: z.array(zAttachment),
});
export type Issue = z.infer<typeof zIssue>;

export interface IssueFilters {
  userId: string | null;
  projectId: string | null;
  updatedAfter: string;
}

export interface GetIssuesResult {
  issues: Issue[];
  involvedUsers: User[];
}

export const getIssues = async (
  linear: LinearClient,
  filters: IssueFilters,
): Promise<GetIssuesResult> => {
  const { userId, projectId, updatedAfter } = filters;

  const linearIssues = await fetchAll(() =>
    linear.issues({
      filter: {
        ...(userId ? { assignee: { id: { eq: userId } } } : {}),
        ...(projectId ? { project: { id: { eq: projectId } } } : {}),
        updatedAt: { gte: updatedAfter },
      },
      first: 250,
    }),
  );

  const issues: Issue[] = [];
  const involvedUserIds = new Set<string>();

  for (const issue of linearIssues) {
    if (issue.assigneeId) {
      involvedUserIds.add(issue.assigneeId);
    }
    if (issue.creatorId) {
      involvedUserIds.add(issue.creatorId);
    }

    const commentsConnection = await issue.comments();
    const comments: Comment[] = [];
    for (const c of commentsConnection.nodes) {
      if (c.userId) {
        involvedUserIds.add(c.userId);
      }
      comments.push(simplifyComment(c));
    }

    const attachmentsConnection = await issue.attachments();
    const attachments =
      attachmentsConnection.nodes.map<Attachment>(simplifyAttachment);

    issues.push({
      assignee: issue.assigneeId,
      comments,
      createdAt: issue.createdAt.toISOString(),
      creator: issue.creatorId,
      description: issue.description || '',
      dueDate: issue.dueDate ? issue.dueDate.toISOString() : null,
      estimate: issue.estimate ? issue.estimate.toString() : null,
      id: issue.id,
      identifier: issue.identifier,
      labels: (
        await Promise.all(issue.labelIds.map((id) => getIssueLabel(linear, id)))
      ).filter((label): label is string => !!label),
      parentId: issue.parentId,
      priority: issue.priorityLabel,
      project: await getProject(linear, issue.projectId),
      state: await getWorkflowState(linear, issue.stateId),
      team: await getTeam(linear, issue.teamId),
      title: issue.title,
      url: issue.url,
      attachments,
    });
  }

  const involvedUsers = (
    await Promise.all(
      Array.from(involvedUserIds).map(async (id) => getUser(linear, id)),
    )
  ).filter((u): u is User => !!u);

  return {
    issues,
    involvedUsers,
  };
};
