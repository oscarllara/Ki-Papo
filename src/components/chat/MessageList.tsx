"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MessageList = () => {
  const messages = [
    { id: 1, role: 'assistant', content: 'Olá! Estou pronto para começar a estruturar seu projeto. Como posso ajudar hoje?', time: '10:30' },
    { id: 2, role: 'user', content: 'Vamos começar definindo os épicos do sistema.', time: '10:31' },
    { id: 3, role: 'assistant', content: 'Perfeito. Quais são as principais funcionalidades que você visualiza para este projeto?', time: '10:31' },
  ];

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col max-w-[80%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              )}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;