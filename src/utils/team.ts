import { LinearClient } from '@linear/sdk';

const teamCache = new Map<string, string | null>();

export const getTeam = async (
  linear: LinearClient,
  id: string | null = null,
): Promise<string | null> => {
  if (!id) {
    return null;
  }
  const existing = teamCache.get(id);
  if (existing) {
    return existing;
  }
  const team = await linear.team(id);
  teamCache.set(id, team.name);
  return team.name;
};
