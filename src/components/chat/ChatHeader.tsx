"use client";

import React from 'react';
import { Phone, Video, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from '@/hooks/use-chat-state';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader = ({ contact }: ChatHeaderProps) => {
  return (
    <header className="h-20 border-b border-slate-100 bg-white flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">{contact.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-slate-900">{contact.name}</h2>
          <div className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", contact.online ? "bg-emerald-500" : "bg-slate-300")} />
            <span className="text-xs text-slate-400 font-medium">
              {contact.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
          <Phone size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
          <Video size={20} />
        </Button>
        <div className="w-px h-6 bg-slate-100 mx-2" />
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
          <Info size={20} />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;