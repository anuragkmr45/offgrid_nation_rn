export interface MediaUploadResponse {
  url: string;
}

// Basic User representation
export interface User {
  _id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

// Conversation summary
export interface Conversation {
  conversationId: string;
  user: User;  // other participant
  lastMessage: Omit<Message, 'sender' | 'recipient'> & { sender: string };
  updatedAt: string;
  muted: boolean;
  unreadCount: number;
}

// Full message payload
export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  recipient: User;
  text?: string | null;
  attachments?: { type: 'image' | 'video' | 'audio'; url: string }[] | null;
  sentAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  actionType: 'text' | 'media' | 'post';
  postPayload?: any; // full post object when actionType === 'post'
}

// Pusher event payloads
export interface NewMessageEvent {
  _id: string;
  conversationId: string;
  sender: string;
  recipient: string;
  text?: string;
  attachments?: { type: 'image' | 'video' | 'audio'; url: string }[];
  actionType: 'text' | 'media' | 'post';
  postPayload?: any;
  sentAt: string;
}

export interface MessageReadEvent {
  conversationId: string;
}

export interface ConversationUpdatedEvent {
  conversationId: string;
  user: User;
  lastMessage: Omit<NewMessageEvent, 'sender' | 'recipient'> & { sender: string; recipient: string };
  updatedAt: string;
  muted: boolean;
  unreadCount: number;
}