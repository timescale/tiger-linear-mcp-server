import type { LinearClient } from '@linear/sdk';
import { Project, simplifyProject } from './project.js';

export const getProjects = async (linear: LinearClient): Promise<Project[]> => {
  let response = await linear.projects();
  while (response.pageInfo.hasNextPage) {
    response = await response.fetchNext();
  }

  return response.nodes.map((project) => simplifyProject(project) as Project);
};
