import { useState, useEffect, useCallback, useRef } from 'react';
import { SSEEvent, ConnectionStatus, Message, EventType } from '../types';

const MAX_MESSAGES = 100;
const MAX_RECONNECT_DELAY = 30000;

export function useSSE(url: string) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [messages, setMessages] = useState<Message[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectDelayRef = useRef(1000);

  const addMessage = useCallback((event: SSEEvent) => {
    const message: Message = {
      id: event.id,
      type: event.type,
      content: event.message,
      timestamp: new Date(event.timestamp),
    };

    setMessages((prev) => {
      const newMessages = [...prev, message];
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES);
      }
      return newMessages;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setStatus('connecting');
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setStatus('open');
      reconnectDelayRef.current = 1000;
    };

    eventSource.onerror = () => {
      setStatus('closed');
      eventSource.close();

      // Exponential backoff reconnect
      const delay = Math.min(reconnectDelayRef.current, MAX_RECONNECT_DELAY);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectDelayRef.current *= 2;
        connect();
      }, delay);
    };

    // Listen for specific event types
    const eventTypes: EventType[] = ['notification', 'update', 'alert', 'heartbeat', 'message'];
    eventTypes.forEach((type) => {
      eventSource.addEventListener(type, ((event: MessageEvent) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          addMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE event:', error);
        }
      }) as EventListener);
    });
  }, [url, addMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback(async (type: EventType, message: string) => {
    try {
      const response = await fetch('/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, []);

  return {
    status,
    messages,
    sendMessage,
    clearMessages,
    reconnect: connect,
  };
}
