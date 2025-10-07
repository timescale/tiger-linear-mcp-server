import type { LinearClient, Project as LinearProject } from '@linear/sdk';
import { Project, simplifyProject } from './project.js';
import { fetchAll } from './linear.js';

export const getProjects = async (linear: LinearClient): Promise<Project[]> => {
  const linearProjects = await fetchAll(() => linear.projects());
  return linearProjects.map((project) => simplifyProject(project) as Project);
};
