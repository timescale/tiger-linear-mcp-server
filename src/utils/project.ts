import { z } from 'zod';
import type { LinearClient, Project as LinearProject } from '@linear/sdk';

export const zProject = z.object({
  id: z.string().describe('The unique project ID'),
  name: z.string().describe('The name of the project'),
  description: z.string().describe('The description of the project'),
  content: z.string().optional().describe('The content of the project'),
  priority: z.string().describe('The priority label of the project'),
  startDate: z.string().optional().describe('The start date of the project'),
  targetDate: z.string().optional().describe('The target date of the project'),
});

export type Project = z.infer<typeof zProject>;

const simplifyProject = (project?: LinearProject | null): Project | null =>
  project
    ? {
        id: project.id,
        name: project.name,
        description: project.description,
        content: project.content,
        priority: project.priorityLabel,
        startDate: project.startDate,
        targetDate: project.targetDate,
      }
    : null;

const projectCache = new Map<string, Project | null>();
export const getProject = async (
  linear: LinearClient,
  id: string | null = null,
): Promise<Project | null> => {
  if (!id) {
    return null;
  }
  const existing = projectCache.get(id);
  if (existing) {
    return existing;
  }
  const project = simplifyProject(await linear.project(id));
  projectCache.set(id, project);
  return project;
};
