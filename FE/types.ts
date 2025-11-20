export type ViewState = 'LOGIN' | 'LOBBY' | 'CHAT';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface ServerMessage {
  type: 'REGISTERED' | 'CHAT_READY' | 'FORWARD_MESSAGE' | 'LEFT' | 'RECIPIENT_NOT_ONLINE' | 'ERROR';
  userId?: string;
  text?: string;
  pairedWith?: string;
  from?: string;
  recipientId?: string;
}

export interface SendMessagePayload {
  type: 'REGISTER' | 'REQUEST_CHAT' | 'SEND_MESSAGE';
  userId?: string;
  recipientId?: string;
  text?: string;
}
