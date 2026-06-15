import React, { useState } from 'react';
import { EventType } from '../types';

interface Props {
  onSend: (type: EventType, message: string) => Promise<boolean>;
  disabled: boolean;
}

export function SendForm({ onSend, disabled }: Props) {
  const [type, setType] = useState<EventType>('notification');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    const success = await onSend(type, message);
    if (success) {
      setMessage('');
    }
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
    }}>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as EventType)}
        disabled={disabled || sending}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
        }}
      >
        <option value="notification">通知</option>
        <option value="update">更新</option>
        <option value="alert">告警</option>
      </select>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="输入消息..."
        disabled={disabled || sending}
        style={{
          flex: 1,
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
        }}
      />
      <button
        type="submit"
        disabled={disabled || sending || !message.trim()}
        style={{
          padding: '8px 16px',
          backgroundColor: disabled || sending ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: disabled || sending ? 'not-allowed' : 'pointer',
        }}
      >
        {sending ? '发送中...' : '发送'}
      </button>
    </form>
  );
}
