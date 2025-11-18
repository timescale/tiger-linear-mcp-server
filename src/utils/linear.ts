import { Connection, LinearFetch } from '@linear/sdk';

export const fetchAll = async <T extends Connection<unknown>>(
  func: () => LinearFetch<T>,
): Promise<T extends Connection<infer U> ? U[] : never> => {
  let response = await func();
  while (response.pageInfo.hasNextPage) {
    response = await response.fetchNext();
  }

  return response.nodes as T extends Connection<infer U> ? U[] : never;
};
