import { LinearClient } from '@linear/sdk';

const labelCache = new Map<string, string | null>();

export const getIssueLabel = async (
  linear: LinearClient,
  id: string | null = null,
): Promise<string | null> => {
  if (!id) {
    return null;
  }
  const existing = labelCache.get(id);
  if (existing) {
    return existing;
  }
  const label = await linear.issueLabel(id);
  labelCache.set(id, label.name);
  return label.name;
};
