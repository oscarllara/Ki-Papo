"use client";

import React, { useState } from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-xl shrink-0">
            <Paperclip size={20} />
          </Button>
          
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..." 
            className="min-h-[44px] max-h-32 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none py-3 px-0 text-slate-700"
            rows={1}
          />

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-xl">
              <Smile size={20} />
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!text.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-10 h-10 p-0 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <SendHorizontal size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;