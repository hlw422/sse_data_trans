export type EventType = 'notification' | 'update' | 'alert' | 'heartbeat' | 'message';

export interface SSEEvent {
  id: string;
  type: EventType;
  message: string;
  timestamp: string;
}

export interface SendMessageRequest {
  type: Exclude<EventType, 'heartbeat'>;
  message: string;
}

export interface Client {
  id: string;
  response: import('http').ServerResponse;
}
