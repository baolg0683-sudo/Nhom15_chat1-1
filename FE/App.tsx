import React from 'react';
import { useChat } from './hooks/useChat';
import { LoginScreen } from './components/LoginScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { ChatScreen } from './components/ChatScreen';
import { MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const {
    view,
    currentUserId,
    chatPartnerId,
    messages,
    error,
    notification,
    login,
    requestChat,
    sendMessage,
    disconnectChat,
    wsConnected,
  } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      {/* Main Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-lg mb-4">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl text-white mr-3 shadow-md">
                <MessageSquare size={24} />
            </div>
            <div className="text-left">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                    Chat 1-1 Realtime
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                    <p className="text-xs font-medium text-slate-500">
                        {wsConnected ? 'Máy chủ trực tuyến' : 'Mất kết nối máy chủ'}
                    </p>
                </div>
            </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 bg-white/80 backdrop-blur-md border border-indigo-100 text-indigo-800 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-5 duration-300 z-50 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          {notification}
        </div>
      )}

      {/* View Router */}
      <main className="w-full flex justify-center transition-all duration-500 ease-in-out">
        {view === 'LOGIN' && (
          <div className="w-full animate-in fade-in zoom-in duration-300">
            <LoginScreen 
                onLogin={login} 
                isLoading={!wsConnected} // Simulate loading if waiting for socket
                error={error} 
            />
          </div>
        )}

        {view === 'LOBBY' && (
          <div className="w-full animate-in slide-in-from-right duration-300">
            <LobbyScreen
              currentUserId={currentUserId}
              onRequestChat={requestChat}
              error={error}
            />
          </div>
        )}

        {view === 'CHAT' && chatPartnerId && (
          <div className="w-full animate-in zoom-in duration-300">
            <ChatScreen
              currentUserId={currentUserId}
              partnerId={chatPartnerId}
              messages={messages}
              onSendMessage={sendMessage}
              onDisconnect={disconnectChat}
            />
          </div>
        )}
      </main>
      
      <footer className="mt-12 text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} WebSocket Messenger. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};

export default App;
