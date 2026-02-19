"use client";

import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-slate-50/50">
        <ChatHeader />
        
        <MessageList />
        
        <MessageInput />

        <div className="absolute bottom-0 right-0 opacity-50 pointer-events-none">
          <MadeWithDyad />
        </div>
      </main>
    </div>
  );
};

export default Index;