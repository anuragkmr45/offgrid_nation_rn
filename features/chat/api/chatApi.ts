// src/features/chat/api/chatApi.ts

import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import { createApi } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import Pusher from 'pusher-js';

import type { RootState } from '@/store/rootReducer';
import type {
    Conversation,
    ConversationUpdatedEvent,
    MediaUploadResponse,
    Message,
    MessageReadEvent,
    NewMessageEvent,
    User,
} from '../types';

const { PUSHER_KEY, PUSHER_CLUSTER } =
  (Constants.expoConfig?.extra ?? {}) as {
    PUSHER_KEY: string;
    PUSHER_CLUSTER: string;
  };

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (build) => ({
    // 1) List conversations + real-time updates
    getConversations: build.query<Conversation[], void>({
      query: () => ({ url: '/conversations', method: 'GET' }),
      providesTags: ['Conversations'],
      onCacheEntryAdded: async (
        _arg,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          getState,
        }
      ) => {
        // wait for initial query to finish
        await cacheDataLoaded;

        // cast getState() to your app's RootState so you can access auth.user
        const state = getState() as RootState;
        const userId = state.auth.user?._id;
        if (!userId) return;

        // subscribe to Pusher channel
        const pusher = new Pusher(PUSHER_KEY, {
          cluster: PUSHER_CLUSTER,
          forceTLS: true,
        });
        const channel = pusher.subscribe(`conversations.${userId}`);

        // handle updates
        channel.bind(
          'conversation-updated',
          (data: ConversationUpdatedEvent) => {
            updateCachedData((draft) => {
              const idx = draft.findIndex(
                (c) => c.conversationId === data.conversationId
              );
              if (idx > -1) draft[idx] = data as Conversation;
              else draft.unshift(data as Conversation);
            });
          }
        );

        // handle mute/unmute
        channel.bind(
          'conversation-muted',
          (data: { conversationId: string; muted: boolean }) => {
            updateCachedData((draft) => {
              const conv = draft.find(
                (c) => c.conversationId === data.conversationId
              );
              if (conv) conv.muted = data.muted;
            });
          }
        );

        // handle delete
        channel.bind(
          'conversation-deleted',
          (data: { conversationId: string }) => {
            updateCachedData((draft) =>
              draft.filter(
                (c) => c.conversationId !== data.conversationId
              )
            );
          }
        );

        // cleanup on unmount
        await cacheEntryRemoved;
        channel.unbind_all();
        pusher.unsubscribe(`conversations.${userId}`);
        pusher.disconnect();
      },
    }),

    // 2) Get messages + real-time new-message & read events
    getMessages: build.query<
      Message[],
      { conversationId: string; cursor?: string }
    >({
      query: ({ conversationId, cursor }) => ({
        url: `/conversations/${conversationId}/messages${
          cursor ? `?cursor=${cursor}` : ''
        }`,
        method: 'GET',
      }),
      providesTags: (result, error, { conversationId }) =>
        result
          ? [
              ...result.map((m) => ({
                type: 'Messages' as const,
                id: m._id,
              })),
              { type: 'Messages' as const, id: conversationId },
            ]
          : [],
      onCacheEntryAdded: async (
        { conversationId }: { conversationId: string; cursor?: string },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) => {
        await cacheDataLoaded;

        const pusher = new Pusher(PUSHER_KEY, {
          cluster: PUSHER_CLUSTER,
          forceTLS: true,
        });
        const channel = pusher.subscribe(`direct.${conversationId}`);

        channel.bind('new-message', (data: NewMessageEvent) => {
          updateCachedData((draft) => {
            draft.unshift({
              ...data,
              sender: { _id: data.sender } as User,
              recipient: { _id: data.recipient } as User,
            });
          });
        });

        channel.bind('message-read', (data: MessageReadEvent) => {
          updateCachedData((draft) => {
            draft.forEach((m) => {
              if (
                m._id === draft[0]?._id &&
                m.sender._id !== data.conversationId
              ) {
                m.readAt = new Date().toISOString();
              }
            });
          });
        });

        await cacheEntryRemoved;
        channel.unbind_all();
        pusher.unsubscribe(`direct.${conversationId}`);
        pusher.disconnect();
      },
    }),

    // 3) Search users
    searchUsers: build.query<User[], string>({
      query: (term: string) => ({
        url: `/conversations/search?q=${encodeURIComponent(term)}`,
        method: 'GET',
      }),
    }),

    // 4) Send a message
    sendMessage: build.mutation<
      Message,
      Partial<Omit<Message, '_id' | 'sentAt' | 'deliveredAt' | 'readAt'>>
    >({
      query: (body) => ({ url: '/messages', method: 'POST', body }),
      invalidatesTags: (result) =>
        result
          ? [{ type: 'Messages' as const, id: result.conversationId }]
          : [],
    }),

    // 5) Mark conversation read
    markRead: build.mutation<void, string>({
      query: (conversationId: string) => ({
        url: `/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, conversationId: string) => [
        { type: 'Conversations' as const, id: conversationId },
      ],
    }),

    // 6) Mute / unmute
    muteConversation: build.mutation<
      void,
      { conversationId: string; mute: boolean }
    >({
      query: ({ conversationId, mute }) => ({
        url: `/conversations/${conversationId}/mute`,
        method: 'POST',
        body: { mute },
      }),
      invalidatesTags: ['Conversations'],
    }),

    // 7) Delete conversation
    deleteConversation: build.mutation<void, string>({
      query: (conversationId: string) => ({
        url: `/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversations'],
    }),

    // 8) Media uploads
    uploadImage: build.mutation<MediaUploadResponse, FormData>({
      query: (file: FormData) => ({
        url: '/media/image',
        method: 'POST',
        body: file,
      }),
    }),
    uploadVideo: build.mutation<MediaUploadResponse, FormData>({
      query: (file: FormData) => ({
        url: '/media/video',
        method: 'POST',
        body: file,
      }),
    }),
    uploadAudio: build.mutation<MediaUploadResponse, FormData>({
      query: (file: FormData) => ({
        url: '/media/audio',
        method: 'POST',
        body: file,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSearchUsersQuery,
  useSendMessageMutation,
  useMarkReadMutation,
  useMuteConversationMutation,
  useDeleteConversationMutation,
  useUploadImageMutation,
  useUploadVideoMutation,
  useUploadAudioMutation,
} = chatApi;
