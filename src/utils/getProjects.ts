import type { LinearClient } from '@linear/sdk';
import { Project, simplifyProject } from './project.js';
import { fetchAll } from './linear.js';

export const getProjects = async (linear: LinearClient): Promise<Project[]> => {
  const linearProjects = await fetchAll(() => linear.projects({ first: 250 }));
  return linearProjects.map((project) => simplifyProject(project) as Project);
};
