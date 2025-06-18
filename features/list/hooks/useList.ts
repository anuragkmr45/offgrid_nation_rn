// src/features/list/hooks/useList.ts
import {
    useGetFollowersQuery,
    useGetFollowingQuery,
    useSearchUsersQuery,
} from '../api/listApi';

export const useFollowers = (username: string) => {
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useGetFollowersQuery(username);

  return {
    followers: data?.followers ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
  };
};

export const useFollowing = (username: string) => {
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useGetFollowingQuery(username);

  return {
    following: data?.following ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
  };
};

export const useSearchUsers = (query: string) => {
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useSearchUsersQuery(query, { skip: query.length === 0 });

  return {
    users: data?.users ?? [],
    isLoading,
    error,
    refetch,
  };
};
