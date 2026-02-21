"use client";

import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

const Index = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Lista de Conversas */}
      <ChatSidebar />

      {/* Janela de Conversa Ativa */}
      <main className="flex-1 flex flex-col bg-white">
        <ChatHeader />
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <MessageList />
          <MessageInput />
        </div>
      </main>
    </div>
  );
};

export default Index;