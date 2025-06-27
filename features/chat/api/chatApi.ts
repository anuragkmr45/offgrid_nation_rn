// src/features/chat/api/chatApi.ts
import { baseQueryWithLogoutOn401 } from '@/core/api/baseQueryWithLogoutOn401';
import type { RootState } from '@/store/rootReducer';
import { PusherService } from '@/utils/PusherService';
import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  Conversation,
  ConversationUpdatedEvent,
  MediaUploadResponse,
  Message,
  MessageReadEvent,
  NewMessageEvent,
  User
} from '../types';

export interface SendMessageDto {
  recipient: string;
  actionType: 'text' | 'media' | 'post';
  text?: string;
  attachments?: { type: 'image' | 'video' | 'audio'; url: string }[];
  postId?: string;
  conversationId?: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (build) => ({

    // 1) List conversations + real-time updates
    getConversations: build.query<Conversation[], void>({
      query: () => ({ url: '/conversations', method: 'GET' }),
      providesTags: (result) =>
        result
          ? result.map(c => ({ type: 'Conversations' as const, id: c.conversationId }))
          : [{ type: 'Conversations', id: 'LIST' }],
      onCacheEntryAdded: async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) => {
        await cacheDataLoaded;

        const state = getState() as RootState;
        const userId = state.auth.user?._id;
        if (!userId) return;

        const pusherSvc = PusherService.getInstance();
        pusherSvc.init();
        const channel = pusherSvc.subscribeChannel(`conversations.${userId}`);

        channel.bind('conversation-updated', (data: ConversationUpdatedEvent) => {
          updateCachedData(draft => {
            const idx = draft.findIndex(c => c.conversationId === data.conversationId);
            if (idx > -1) draft[idx] = data as Conversation;
            else draft.unshift(data as Conversation);
          });
        });

        channel.bind('conversation-muted', (data: { conversationId: string; muted: boolean }) => {
          updateCachedData(draft => {
            const conv = draft.find(c => c.conversationId === data.conversationId);
            if (conv) conv.muted = data.muted;
          });
        });

        channel.bind('conversation-deleted', (data: { conversationId: string }) => {
          updateCachedData(draft =>
            draft.filter(c => c.conversationId !== data.conversationId)
          );
        });

        await cacheEntryRemoved;
        channel.unbind_all();
        pusherSvc.unsubscribeChannel(channel.name);
      },
    }),

    // 2a) Fetch messages by recipient (historical)
    getMessagesByRecipient: build.query<Message[], { recipientId: string; limit?: number }>({
      query: ({ recipientId, limit = 20 }) => ({
        url: `/conversations/messages?recipient=${recipientId}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (result, error, { recipientId }) =>
        result
          ? [
            ...result.map(m => ({ type: 'Messages' as const, id: m._id })),
            { type: 'Messages' as const, id: recipientId }
          ]
          : [],
    }),

    // 2b) Fetch and subscribe messages by conversationId (real-time)
    getMessagesByConversation: build.query<Message[], { conversationId: string; cursor?: string; limit?: number }>({
      query: ({ conversationId, cursor, limit = 20 }) => ({
        url: `/conversations/${conversationId}/messages${cursor ? `?cursor=${cursor}&limit=${limit}` : `?limit=${limit}`}`,
        method: 'GET',
      }),
      providesTags: (result, error, { conversationId }) =>
        result
          ? [
            ...result.map(m => ({ type: 'Messages' as const, id: m._id })),
            { type: 'Messages' as const, id: conversationId }
          ]
          : [],
      async onCacheEntryAdded(
        { conversationId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        await cacheDataLoaded;
        const myUserId = (getState() as RootState).auth.user?._id;
        if (!myUserId) return;
        const pusher = PusherService.getInstance();
        pusher.init();
        const channelName = `direct.${conversationId}`;
        const channel = pusher.subscribeChannel(channelName);

        // New messages
        channel.bind('new-message', (data: NewMessageEvent) => {
          updateCachedData(draft => {
            if (!draft.find(m => m._id === data._id)) {
              draft.unshift({
                ...data,
                sender: { _id: data.sender } as User,
                recipient: { _id: data.recipient } as User,
              });
            }
          });
        });

        // Read receipts
        channel.bind('message-read', (_: MessageReadEvent) => {
          updateCachedData(draft => {
            draft.forEach(m => {
              if (m.sender._id === myUserId) {
                m.readAt = new Date().toISOString();
              }
            });
          });
        });

        await cacheEntryRemoved;
        channel.unbind_all();
        pusher.unsubscribeChannel(channelName);
      }
    }),

    // 3) Search users
    searchUsers: build.query<User[], string>({
      query: term => ({ url: `/conversations/search?q=${encodeURIComponent(term)}`, method: 'GET' }),
    }),

    // 4) Send a message (text, media, or post)
    sendMessage: build.mutation<Message, SendMessageDto>({
      query: (body) => ({ url: '/messages', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const { conversationId, recipient, actionType, text, attachments } = arg;
        // Only perform optimistic update if conversationId exists
        if (conversationId) {
          const tempId = `temp-${Date.now()}`;
          const myUserId = (getState() as RootState).auth.user!._id;

          // Insert temp message
          const patchResult = dispatch(
            chatApi.util.updateQueryData(
              'getMessagesByConversation',
              { conversationId, cursor: undefined, limit: 20 },
              (draft) => {
                draft.unshift({
                  _id: tempId,
                  conversationId,
                  sender: { _id: myUserId } as User,
                  recipient: { _id: recipient } as User,
                  text: actionType === 'text' ? text || '' : null,
                  attachments: attachments ?? null,
                  actionType,
                  postPayload: null,
                  sentAt: new Date().toISOString(),
                  deliveredAt: null,
                  readAt: null,
                });
              }
            )
          );

          try {
            const { data } = await queryFulfilled;
            // Replace temp with actual
            dispatch(
              chatApi.util.updateQueryData(
                'getMessagesByConversation',
                { conversationId: data.conversationId, cursor: undefined, limit: 20 },
                (draft) => {
                  const idx = draft.findIndex(m => m._id === tempId);
                  if (idx !== -1) draft.splice(idx, 1);
                  draft.unshift(data);
                }
              )
            );
          } catch {
            patchResult.undo();
          }
        }
      },
      invalidatesTags: (result) =>
        result ? [{ type: 'Messages' as const, id: result.conversationId }] : [],
    }),

    // 5) Mark conversation read
    markRead: build.mutation<void, string>({
      query: conversationId => ({ url: `/conversations/${conversationId}/read`, method: 'POST' }),
      invalidatesTags: (_r, _e, conversationId) => [
        { type: 'Conversations' as const, id: conversationId },
      ],
    }),

    // 6) Mute / unmute
    muteConversation: build.mutation<void, { conversationId: string; mute: boolean }>({
      query: ({ conversationId, mute }) => ({
        url: `/conversations/${conversationId}/mute`,
        method: 'POST',
        body: { mute },
      }),
      invalidatesTags: ['Conversations'],
    }),

    // 7) Delete conversation
    deleteConversation: build.mutation<void, string>({
      query: conversationId => ({ url: `/conversations/${conversationId}`, method: 'DELETE' }),
      invalidatesTags: ['Conversations'],
    }),

    // 8) Media uploads
    uploadImage: build.mutation<MediaUploadResponse, FormData>({
      query: file => ({ url: '/media/image', method: 'POST', body: file }),
    }),
    uploadVideo: build.mutation<MediaUploadResponse, FormData>({
      query: file => ({ url: '/media/video', method: 'POST', body: file }),
    }),
    uploadAudio: build.mutation<MediaUploadResponse, FormData>({
      query: file => ({ url: '/media/audio', method: 'POST', body: file }),
    }),

  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesByRecipientQuery,
  useGetMessagesByConversationQuery,
  useSearchUsersQuery,
  useSendMessageMutation,
  useMarkReadMutation,
  useMuteConversationMutation,
  useDeleteConversationMutation,
  useUploadImageMutation,
  useUploadVideoMutation,
  useUploadAudioMutation,
} = chatApi;
