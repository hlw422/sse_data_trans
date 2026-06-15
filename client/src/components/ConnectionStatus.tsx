import { ConnectionStatus as Status } from '../types';

interface Props {
  status: Status;
  onReconnect: () => void;
}

export function ConnectionStatus({ status, onReconnect }: Props) {
  const statusConfig = {
    connecting: { color: '#f59e0b', text: '连接中...' },
    open: { color: '#10b981', text: '已连接' },
    closed: { color: '#ef4444', text: '已断开' },
  };

  const config = statusConfig[status];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      marginBottom: '16px',
    }}>
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: config.color,
      }} />
      <span style={{ fontWeight: 500 }}>{config.text}</span>
      {status === 'closed' && (
        <button
          onClick={onReconnect}
          style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          重新连接
        </button>
      )}
    </div>
  );
}
