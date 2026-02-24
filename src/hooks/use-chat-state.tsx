"use client";

import { useState } from 'react';

export type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
};

export type Contact = {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  online: boolean;
  avatar: string;
};

const initialContacts: Contact[] = [];

const initialMessages: Record<number, Message[]> = {};

export function useChatState() {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [activeContactId, setActiveContactId] = useState<number>(0);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);

  const activeContact = contacts.find(c => c.id === activeContactId) || null;
  const activeMessages = activeContactId ? (messages[activeContactId] || []) : [];

  const sendMessage = (content: string) => {
    if (!content.trim() || !activeContactId) return;
    
    const newMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
  };

  return {
    contacts,
    activeContact,
    activeMessages,
    setActiveContactId,
    sendMessage
  };
}