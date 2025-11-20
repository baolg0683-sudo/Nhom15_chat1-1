import React, { useState, useEffect, useRef } from 'react';
import { Send, PhoneOff, MoreVertical } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatScreenProps {
  currentUserId: string;
  partnerId: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onDisconnect: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  currentUserId,
  partnerId,
  messages,
  onSendMessage,
  onDisconnect,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            {partnerId.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{partnerId}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-500 font-medium">Đang trực tuyến</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
          <button
            onClick={onDisconnect}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors"
            title="Kết thúc cuộc gọi"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar space-y-4">
        <div className="text-center py-4">
           <span className="text-xs font-medium text-slate-400 bg-slate-200 px-3 py-1 rounded-full">Cuộc trò chuyện đã bắt đầu</span>
        </div>
        
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isOwn = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm relative group ${
                  isOwn
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                <div
                  className={`text-[10px] mt-1 flex items-center gap-1 ${
                    isOwn ? 'text-indigo-200 justify-end' : 'text-slate-400'
                  }`}
                >
                   <span>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform active:scale-95 shadow-md shadow-indigo-200"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
