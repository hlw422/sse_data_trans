import { ConnectionStatus } from './components/ConnectionStatus';
import { MessageList } from './components/MessageList';
import { SendForm } from './components/SendForm';
import { useSSE } from './hooks/useSSE';

export function App() {
  const { status, messages, sendMessage, clearMessages, reconnect } = useSSE('/events');

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        SSE 实时通信演示
      </h1>
      
      <ConnectionStatus status={status} onReconnect={reconnect} />
      
      <MessageList messages={messages} onClear={clearMessages} />
      
      <SendForm onSend={sendMessage} disabled={status !== 'open'} />
      
      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#1e40af',
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>功能说明：</p>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>自动连接SSE服务器并接收实时消息</li>
          <li>支持多种事件类型：通知、更新、告警</li>
          <li>连接断开时自动重连（指数退避）</li>
          <li>支持发送消息并广播给所有客户端</li>
          <li>消息历史记录（最多100条）</li>
        </ul>
      </div>
    </div>
  );
}
