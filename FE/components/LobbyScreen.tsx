import React, { useState } from 'react';
import { Search, Users, LogOut } from 'lucide-react';

interface LobbyScreenProps {
  currentUserId: string;
  onRequestChat: (partnerId: string) => void;
  error: string | null;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ currentUserId, onRequestChat, error }) => {
  const [partnerId, setPartnerId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerId.trim()) {
      onRequestChat(partnerId.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tài khoản của bạn</p>
          <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {currentUserId}
          </h2>
        </div>
        <button 
            onClick={() => window.location.reload()}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            title="Đăng xuất"
        >
            <LogOut size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Tìm người trò chuyện</h3>
          <p className="text-slate-500">Nhập ID của người bạn muốn kết nối.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Nhập User ID đối phương..."
              autoFocus
            />
          </div>

          {error && (
             <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!partnerId.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Kết nối ngay
          </button>
        </form>
      </div>
    </div>
  );
};
