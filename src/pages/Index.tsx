"use client";

import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { useChatState } from '@/hooks/use-chat-state';

const Index = () => {
  const { 
    contacts, 
    activeContact, 
    activeMessages, 
    setActiveContactId, 
    sendMessage 
  } = useChatState();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <ChatSidebar 
        contacts={contacts} 
        activeId={activeContact.id} 
        onSelectContact={setActiveContactId} 
      />

      <main className="flex-1 flex flex-col bg-white">
        <ChatHeader contact={activeContact} />
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <MessageList messages={activeMessages} />
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </main>
    </div>
  );
};

export default Index;