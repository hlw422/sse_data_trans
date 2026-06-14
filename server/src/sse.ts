import { ServerResponse } from 'http';
import { Client, SSEEvent, EventType } from './types';

const clients: Map<string, Client> = new Map();
let eventIdCounter = 0;

export function addClient(id: string, response: ServerResponse): Client {
  const client: Client = { id, response };
  clients.set(id, client);

  response.on('close', () => {
    clients.delete(id);
    console.log(`Client ${id} disconnected. Total clients: ${clients.size}`);
  });

  console.log(`Client ${id} connected. Total clients: ${clients.size}`);
  return client;
}

export function removeClient(id: string): void {
  clients.delete(id);
}

export function broadcast(event: SSEEvent): void {
  const message = formatSSEMessage(event);

  clients.forEach((client) => {
    try {
      client.response.write(message);
    } catch (error) {
      console.error(`Error sending to client ${client.id}:`, error);
      clients.delete(client.id);
    }
  });
}

export function formatSSEMessage(event: SSEEvent): string {
  return `id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

export function createEvent(type: EventType, message: string): SSEEvent {
  return {
    id: String(++eventIdCounter),
    type,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function getClientCount(): number {
  return clients.size;
}
