"use client";

import React from 'react';
import { MessageSquare, Plus, Search, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ChatSidebar = () => {
  const chats = [
    { id: 1, title: "Projeto Alpha - Épicos", preview: "Vamos definir os épicos...", time: "10:30" },
    { id: 2, title: "Regras de Negócio", preview: "As regras principais são...", time: "Ontem" },
    { id: 3, title: "Perfil do Usuário", preview: "O perfil deve conter...", time: "Segunda" },
  ];

  return (
    <div className="flex flex-col h-full w-80 bg-slate-50 border-r border-slate-200">
      <div className="p-4 space-y-4">
        <Button className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all">
          <Plus size={18} />
          Nova Conversa
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Buscar conversas..." 
            className="pl-9 bg-white border-slate-200 rounded-xl focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all hover:bg-white hover:shadow-sm group",
                chat.id === 1 ? "bg-white shadow-sm border border-slate-100" : "text-slate-600"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm truncate text-slate-900">{chat.title}</span>
                <span className="text-[10px] text-slate-400">{chat.time}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{chat.preview}</p>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200 bg-white/50">
        <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600 hover:bg-white rounded-xl">
          <Settings size={18} />
          Configurações
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;