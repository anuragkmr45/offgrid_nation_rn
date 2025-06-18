// src/features/notifications/hooks/useNotifications.ts

import {
    useListNotificationsQuery,
    useMarkAsReadMutation,
} from '../api/notificationsApi';
import type {
    MarkAsReadRequest
} from '../types';

export const useNotifications = () => {
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    isFetching: isFetchingNotifications,
    refetch: refetchNotifications,
    error: notificationsError,
  } = useListNotificationsQuery(
    { page: 1, limit: 20 },
    { refetchOnFocus: true }
  );

  const [
    markAsRead,
    {
      isLoading: isMarkingRead,
      isSuccess: isMarkReadSuccess,
      error: markReadError,
    },
  ] = useMarkAsReadMutation();

  const markNotificationsAsRead = async (ids: string[]) => {
    await markAsRead({ ids } as MarkAsReadRequest);
  };

  return {
    notificationsData,
    isLoadingNotifications,
    isFetchingNotifications,
    notificationsError,
    refetchNotifications,
    markNotificationsAsRead,
    isMarkingRead,
    isMarkReadSuccess,
    markReadError,
  };
};
