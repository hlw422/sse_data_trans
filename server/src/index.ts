import http from 'http';
import { addClient, broadcast, createEvent, formatSSEMessage } from './sse';
import { SendMessageRequest } from './types';

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

// Auto-send simulated messages every 5 seconds
const simulatedMessages = [
  { type: 'notification' as const, message: '新用户注册' },
  { type: 'update' as const, message: '数据已更新: 股票价格 +2.5%' },
  { type: 'alert' as const, message: '系统负载过高: CPU 85%' },
  { type: 'notification' as const, message: '收到新订单 #1234' },
  { type: 'update' as const, message: '库存变更: 商品A -10' },
  { type: 'alert' as const, message: '磁盘空间不足: 剩余5%' },
];

let messageIndex = 0;
setInterval(() => {
  const msg = simulatedMessages[messageIndex % simulatedMessages.length];
  const event = createEvent(msg.type, msg.message);
  broadcast(event);
  messageIndex++;
}, 5000);

server.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/events`);
  console.log(`Send endpoint: http://localhost:${PORT}/send`);
  console.log(`Auto-sending simulated messages every 5 seconds`);
});
