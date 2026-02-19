"use client";

import React from 'react';
import { MoreVertical, Share2, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          PA
        </div>
        <div>
          <h2 className="font-bold text-slate-900 leading-none">Projeto Alpha - Épicos</h2>
          <span className="text-xs text-emerald-500 font-medium">Ativo agora</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-xl">
          <Star size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-xl">
          <Share2 size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-xl">
          <MoreVertical size={20} />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;