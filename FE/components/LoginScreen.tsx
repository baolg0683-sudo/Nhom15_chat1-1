import React, { useState } from 'react';
import { UserCircle2, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, error }) => {
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onLogin(userId.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl border border-slate-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
          <UserCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Xin Chào!</h2>
        <p className="text-indigo-100">Nhập tên người dùng để bắt đầu.</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-slate-700 mb-2">
              User ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="VD: user123"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center animate-pulse">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!userId.trim() || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Đăng nhập <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
