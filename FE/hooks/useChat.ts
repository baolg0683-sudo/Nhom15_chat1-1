import { useState, useEffect, useRef, useCallback } from 'react';
import { ViewState, ChatMessage, ServerMessage, SendMessagePayload } from '../types';

const WS_URL = 'ws://localhost:8080';

export const useChat = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [wsConnected, setWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [chatPartnerId, setChatPartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setWsConnected(true);
      setError(null);
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setWsConnected(false);
      // Only show error if we were previously logged in
      if (view !== 'LOGIN') {
        setError('Mất kết nối với máy chủ. Vui lòng tải lại trang.');
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setError('Lỗi kết nối máy chủ.');
    };

    ws.current.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (e) {
        console.error('Failed to parse message', e);
      }
    };
  }, [view]); // view dependency might not be strictly needed here but good for context

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ws.current?.close();
    };
  }, []);

  const handleServerMessage = (data: ServerMessage) => {
    console.log('Received:', data);
    
    switch (data.type) {
      case 'REGISTERED':
        if (data.userId) {
          setCurrentUserId(data.userId);
          setView('LOBBY');
          setError(null);
        }
        break;

      case 'CHAT_READY':
        if (data.pairedWith) {
          setChatPartnerId(data.pairedWith);
          setView('CHAT');
          setMessages([]); // Clear previous messages
          addSystemMessage(`Đã kết nối với ${data.pairedWith}`);
          setError(null);
        }
        break;

      case 'FORWARD_MESSAGE':
        if (data.from && data.text) {
          addMessage(data.from, data.text);
        }
        break;

      case 'LEFT':
        addSystemMessage(`${data.userId} đã rời cuộc trò chuyện.`);
        setNotification(`${data.userId} đã rời đi.`);
        setTimeout(() => {
          setView('LOBBY');
          setChatPartnerId(null);
          setNotification(null);
        }, 2000);
        break;

      case 'RECIPIENT_NOT_ONLINE':
        setError(data.text || 'Người dùng không trực tuyến.');
        break;

      case 'ERROR':
        setError(data.text || 'Đã xảy ra lỗi.');
        break;
    }
  };

  const sendPayload = (payload: SendMessagePayload) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      setError('Không có kết nối tới máy chủ.');
      // Try to reconnect if needed
      if (!wsConnected) connect();
    }
  };

  const login = (userId: string) => {
    if (!wsConnected) {
        // If not connected, connect first then try to register
        connect();
        // Wait for connection then register (simple retry logic)
        setTimeout(() => {
             if (ws.current?.readyState === WebSocket.OPEN) {
                 sendPayload({ type: 'REGISTER', userId });
             } else {
                 setError("Đang kết nối máy chủ...");
             }
        }, 500);
    } else {
        sendPayload({ type: 'REGISTER', userId });
    }
  };

  const requestChat = (recipientId: string) => {
    sendPayload({ type: 'REQUEST_CHAT', userId: currentUserId, recipientId });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    sendPayload({ type: 'SEND_MESSAGE', userId: currentUserId, text });
    // Add own message immediately for UI responsiveness
    addMessage(currentUserId, text);
  };

  const disconnectChat = () => {
    // There isn't a specific LEAVE_CHAT event in the provided backend, 
    // but closing connection or refreshing triggers close handler.
    // Ideally the backend should support a LEAVE event.
    // For now, we reload to fully reset or just close socket.
    ws.current?.close();
    window.location.reload();
  };

  const addMessage = (senderId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(),
      senderId,
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'SYSTEM',
      text,
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Initial connection attempt
  useEffect(() => {
      connect();
  }, [connect]);

  return {
    view,
    wsConnected,
    currentUserId,
    chatPartnerId,
    messages,
    error,
    notification,
    login,
    requestChat,
    sendMessage,
    disconnectChat,
    setError // exposed to clear error manually if needed
  };
};
