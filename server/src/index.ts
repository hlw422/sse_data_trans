import http from 'http';
import { addClient, broadcast, createEvent, formatSSEMessage } from './sse';
import { SendMessageRequest } from './types';
import { generateMockMessage } from './mock-data';

const PORT = 13001;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // SSE endpoint
  if (req.url === '/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const clientId = Date.now().toString();
    addClient(clientId, res);

    // Send initial connection event
    const connectEvent = createEvent('notification', 'Connected to SSE server');
    res.write(formatSSEMessage(connectEvent));

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      const heartbeat = createEvent('heartbeat', 'ping');
      res.write(formatSSEMessage(heartbeat));
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeatInterval);
    });

    return;
  }

  // Send message endpoint
  if (req.url === '/send' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { type, message }: SendMessageRequest = JSON.parse(body);
        const event = createEvent(type, message);
        broadcast(event);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Message sent' }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Auto-send simulated business messages
setInterval(() => {
  const msg = generateMockMessage();
  const event = createEvent(msg.type, msg.message);
  broadcast(event);
}, randInt(3000, 8000));

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/events`);
  console.log(`Send endpoint: http://localhost:${PORT}/send`);
  console.log(`Auto-sending simulated messages every 5 seconds`);
});
