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

const initialContacts: Contact[] = [
  { id: 1, name: "Ana Silva", lastMsg: "Oi! Tudo bem com você?", time: "10:30", online: true, avatar: "AS" },
  { id: 2, name: "João Pereira", lastMsg: "Mandei o arquivo que você pediu.", time: "09:45", online: false, avatar: "JP" },
  { id: 3, name: "Grupo da Família", lastMsg: "Mãe: Vamos almoçar juntos?", time: "Ontem", online: true, avatar: "GF" },
  { id: 4, name: "Mariana Costa", lastMsg: "Haha, que engraçado!", time: "Segunda", online: false, avatar: "MC" },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, role: 'assistant', content: 'Olá! Como vai?', time: '10:30' },
    { id: 2, role: 'user', content: 'Tudo bem, e você?', time: '10:31' },
  ],
  2: [
    { id: 1, role: 'assistant', content: 'Oi, João aqui.', time: '09:40' },
  ]
};

export function useChatState() {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [activeContactId, setActiveContactId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, Message[]>>(initialMessages);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const activeMessages = messages[activeContactId] || [];

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
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