"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  SendHorizontal, 
  Camera as CameraIcon, 
  ArrowLeft, 
  Users, 
  Lock, 
  Info,
  Megaphone,
  EyeOff,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdSlot from '@/components/ads/AdSlot';

interface ChatMessage {
  id: string;
  sender: string;
  receiver?: string; 
  content: string;
  time: string;
  isMe: boolean;
  isPrivate?: boolean;
  type?: 'text' | 'image' | 'video' | 'system';
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  const [nickname, setNickname] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);

  const onlineUsers = ["Maria_22", "Joao_Silva", "Gabi_BH", "Paulo_Vila", "Nanda_Fit"];

  const cityName = useMemo(() => {
    if (!roomId) return "Local";
    if (roomId.startsWith('nearby-')) return "Perto de Você";
    
    const parts = roomId.split('-');
    const namePart = parts.slice(0, -1).join(' ');
    return namePart.replace(/\b\w/g, l => l.toUpperCase()) || "Sala Local";
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messagesList]);

  useEffect(() => {
    if (!hasJoined) return;

    const config = JSON.parse(localStorage.getItem('kipapo_msg_config') || '{"content":"","interval":"0"}');
    const announcement = config.content || `Bem-vindo à sala ${cityName}! Respeite os outros usuários e divirta-se.`;

    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      sender: 'Sistema',
      content: announcement,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
      type: 'system'
    };
    setMessagesList([welcomeMsg]);

    let intervalId: NodeJS.Timeout | null = null;
    const intervalMinutes = parseInt(config.interval || '0');

    if (intervalMinutes > 0 && config.content) {
      intervalId = setInterval(() => {
        const currentConfig = JSON.parse(localStorage.getItem('kipapo_msg_config') || '{"content":"","interval":"0"}');
        if (currentConfig.content) {
          const systemMsg: ChatMessage = {
            id: `system-${Date.now()}`,
            sender: "Administrador",
            content: currentConfig.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            type: 'system'
          };
          setMessagesList(prev => [...prev, systemMsg]);
        }
      }, intervalMinutes * 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [hasJoined, cityName]);

  const handleSendMessage = (content: string = message, type: 'text' | 'image' | 'video' | 'system' = 'text') => {
    if (!content.trim() && type === 'text') return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: nickname,
      receiver: isPrivate ? (targetUser || undefined) : undefined,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isPrivate,
      type
    };
    setMessagesList(prev => [...prev, newMessage]);
    if (type === 'text') setMessage('');
    setTimeout(() => messageInputRef.current?.focus(), 10);
  };

  const handleJoin = () => { 
    if (nickname.trim().length >= 3) {
      setHasJoined(true);
    } 
  };

  const selectUserForPrivate = (user: string) => {
    setTargetUser(user);
    setIsPrivate(true);
    setTimeout(() => messageInputRef.current?.focus(), 50);
  };

  const UserList = () => (
    <div className="space-y-1">
      {onlineUsers.map(user => (
        <button 
          key={user} 
          onClick={() => selectUserForPrivate(user)} 
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-slate-50 text-left group", 
            targetUser === user ? "bg-indigo-50 ring-1 ring-indigo-100" : ""
          )}
        >
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-slate-100 font-black text-[10px] text-slate-400">{user[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-xs font-black text-slate-700 block truncate tracking-tight">{user}</span>
            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Online</span>
          </div>
        </button>
      ))}
    </div>
  );

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md p-8 md:p-12 rounded-[2.5rem] border-none shadow-2xl space-y-8 bg-white">
          <div className="text-center space-y-6">
            <div className="bg-primary/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-primary">
              <Users size={40} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Entrar na Sala</h2>
              <p className="text-slate-400 font-bold text-xs">Escolha seu apelido para começar</p>
            </div>
            <Input 
              placeholder="Seu apelido..." 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()} 
              className="h-16 rounded-2xl text-center font-black text-xl border-none bg-slate-50 shadow-inner" 
            />
            <Button 
              onClick={handleJoin} 
              disabled={nickname.trim().length < 3} 
              className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg text-white shadow-xl"
            >
              ENTRAR NO CHAT
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden font-sans">
      <aside className="w-60 bg-white border-r border-slate-100 hidden lg:flex flex-col z-20">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">Usuários Online</h3>
        </div>
        <ScrollArea className="flex-1 p-3">
          <UserList />
          <div className="mt-8 p-2">
            <AdSlot city={cityName} slotIndex={1} className="rounded-2xl" />
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative bg-white">
        <header className="h-16 md:h-20 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 bg-white/90 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-xl h-10 w-10"><ArrowLeft size={20} /></Button>
            <div>
              <h2 className="font-black text-slate-900 text-lg md:text-xl tracking-tighter">{cityName}</h2>
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Sala Ativa</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-slate-300 rounded-xl h-10 w-10"><Info size={20} /></Button>
            <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden h-10 w-10"><Users size={20} /></Button></SheetTrigger>
              <SheetContent side="right" className="p-0 w-72"><UserList /></SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="bg-white px-4 py-2 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="rounded-xl" />
        </div>

        <ScrollArea className="flex-1 p-4 md:p-8 bg-slate-50/30" ref={scrollRef}>
          <div className="max-w-5xl mx-auto space-y-4 pb-6">
            {messagesList.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col gap-1 max-w-[90%] md:max-w-[85%] animate-in fade-in", 
                  msg.type === 'system' ? "mx-auto items-center w-full max-w-full" : 
                  msg.isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                {msg.type === 'system' ? (
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 text-center shadow-sm w-full md:w-2/3 my-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Megaphone className="text-indigo-600" size={14} />
                      <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Aviso</span>
                    </div>
                    <p className="text-indigo-900 font-bold text-xs md:text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-1">
                      <span className={cn("text-[9px] font-black uppercase tracking-wider", msg.isMe ? "text-primary" : "text-slate-400")}>
                        {msg.sender} {msg.isPrivate && <span className="text-rose-500 ml-1">reservadamente</span>} • {msg.time}
                      </span>
                    </div>
                    <div className={cn(
                      "p-3 md:p-4 rounded-2xl shadow-sm relative", 
                      msg.isMe 
                        ? (msg.isPrivate ? "bg-slate-800 text-white rounded-tr-none" : "bg-primary text-white rounded-tr-none")
                        : (msg.isPrivate ? "bg-rose-50 text-rose-900 border border-rose-100 rounded-tl-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none")
                    )}>
                      {msg.isPrivate && <EyeOff size={10} className="absolute top-2 right-2 opacity-30" />}
                      <p className="font-bold text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 md:p-6 bg-white border-t border-slate-50 shrink-0">
          <div className="max-w-5xl mx-auto relative">
            {isPrivate && (
              <div className="absolute -top-10 left-0 flex items-center gap-2 bg-slate-800 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg animate-in slide-in-from-bottom-2 z-20">
                <Lock size={12} className="text-rose-500" /> Reservado: {targetUser}
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="ml-1 hover:text-rose-500 transition-colors"><X size={12} /></button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border-2 border-transparent focus-within:border-primary/10 focus-within:bg-white transition-all shadow-inner">
              <Button variant="ghost" size="icon" className="text-slate-300 rounded-xl h-10 w-10 shrink-0 hover:text-primary" onClick={() => setIsMediaDialogOpen(true)}><CameraIcon size={20} /></Button>
              <Input 
                ref={messageInputRef}
                placeholder={isPrivate ? `Reservado para ${targetUser}...` : "Diga algo..."} 
                className="border-none bg-transparent font-bold text-sm md:text-base h-10 focus-visible:ring-0" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!message.trim()} 
                className={cn(
                  "rounded-xl w-10 h-10 shrink-0 shadow-lg active:scale-95 transition-all",
                  isPrivate ? "bg-slate-800" : "bg-primary"
                )}
              >
                <SendHorizontal size={18} />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-3xl p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-center font-black">Enviar Mídia</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={() => setIsMediaDialogOpen(false)} className="h-12 bg-primary text-white rounded-xl font-black">Tirar Foto</Button>
            <Button onClick={() => setIsMediaDialogOpen(false)} variant="secondary" className="h-12 rounded-xl font-black">Galeria</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;