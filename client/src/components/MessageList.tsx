import { Message, EventType } from '../types';

interface Props {
  messages: Message[];
  onClear: () => void;
}

const typeColors: Record<EventType, string> = {
  notification: '#3b82f6',
  update: '#10b981',
  alert: '#ef4444',
  heartbeat: '#6b7280',
  message: '#8b5cf6',
};

const typeLabels: Record<EventType, string> = {
  notification: '通知',
  update: '更新',
  alert: '告警',
  heartbeat: '心跳',
  message: '消息',
};

export function MessageList({ messages, onClear }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <h3 style={{ margin: 0 }}>消息历史 ({messages.length})</h3>
        <button
          onClick={onClear}
          style={{
            padding: '4px 12px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          清空
        </button>
      </div>
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px',
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>暂无消息</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '8px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{
                padding: '2px 8px',
                backgroundColor: typeColors[msg.type],
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}>
                {typeLabels[msg.type]}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0 }}>{msg.content}</p>
                <small style={{ color: '#9ca3af' }}>
                  {msg.timestamp.toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
