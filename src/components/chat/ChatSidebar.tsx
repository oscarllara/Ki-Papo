"use client";

import React from 'react';
import { Search, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Contact } from '@/hooks/use-chat-state';

interface ChatSidebarProps {
  contacts: Contact[];
  activeId: number;
  onSelectContact: (id: number) => void;
}

const ChatSidebar = ({ contacts, activeId, onSelectContact }: ChatSidebarProps) => {
  return (
    <div className="flex flex-col h-full w-80 bg-white border-r border-slate-100 shrink-0">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Mensagens</h1>
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 hover:bg-slate-100">
            <Edit size={18} className="text-slate-600" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 h-11"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-slate-50 group",
                contact.id === activeId ? "bg-indigo-50" : ""
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">{contact.avatar}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-sm text-slate-900 truncate">{contact.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{contact.time}</span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  contact.id === activeId ? "text-indigo-600 font-medium" : "text-slate-500"
                )}>
                  {contact.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;