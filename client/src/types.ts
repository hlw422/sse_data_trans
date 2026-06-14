export type EventType = 'notification' | 'update' | 'alert' | 'heartbeat' | 'message';

export interface SSEEvent {
  id: string;
  type: EventType;
  message: string;
  timestamp: string;
}

export type ConnectionStatus = 'connecting' | 'open' | 'closed';

export interface Message {
  id: string;
  type: EventType;
  content: string;
  timestamp: Date;
}
