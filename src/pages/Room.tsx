"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  SendHorizontal, 
  Camera as CameraIcon, 
  ArrowLeft, 
  Users, 
  Lock, 
  Info,
  Megaphone,
  EyeOff,
  X,
  Loader2,
  LogOut,
  Smile
} from 'lucide-react';
import { cn } from "@/lib/utils";
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
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);

  const onlineUsers = ["Maria_22", "Joao_Silva", "Gabi_BH", "Paulo_Vila", "Nanda_Fit", "Lucas_SP", "Ana_Clara"];

  const cityName = useMemo(() => {
    if (!roomId) return "Local";
    if (roomId.startsWith('nearby-')) return "Perto de Você";
    
    const parts = roomId.split('-');
    const namePart = parts.slice(0, -1).join(' ');
    return namePart.replace(/\b\w/g, l => l.toUpperCase()) || "Sala Local";
  }, [roomId]);

  useEffect(() => {
    const savedNickname = sessionStorage.getItem('kipapo_nickname');
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    
    if (savedNickname) {
      setNickname(savedNickname);
      setHasJoined(true);
    } else if (savedUsers.length > 0) {
      setNickname(savedUsers[0].name.split(' ')[0]);
      setHasJoined(true);
    } else {
      navigate('/');
    }
    setIsLoading(false);
  }, [navigate]);

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

  const selectUserForPrivate = (user: string) => {
    setTargetUser(user);
    setIsPrivate(true);
    setTimeout(() => messageInputRef.current?.focus(), 50);
  };

  const UserList = () => (
    <div className="space-y-2 p-2">
      {onlineUsers.map(user => (
        <button 
          key={user} 
          onClick={() => selectUserForPrivate(user)} 
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative", 
            targetUser === user ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-slate-50"
          )}
        >
          <div className="relative">
            <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 font-black text-xs text-slate-500">{user[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <span className="text-sm font-black text-slate-700 block truncate tracking-tight group-hover:text-primary transition-colors">{user}</span>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Online</span>
          </div>
          {targetUser === user && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden font-sans">
      {/* Sidebar Esquerda - Desktop */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col z-20 shadow-xl shadow-slate-200/20">
        <div className="p-8 border-b border-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.25em] text-[11px]">Usuários Online</h3>
        </div>
        <ScrollArea className="flex-1">
          <UserList />
          <div className="p-4 mt-4">
            <AdSlot city={cityName} slotIndex={1} className="rounded-3xl overflow-hidden shadow-lg" />
          </div>
        </ScrollArea>
      </aside>

      {/* Área Principal do Chat */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Header da Sala */}
        <header className="h-20 md:h-24 border-b border-slate-100 flex items-center justify-between px-6 md:px-10 bg-white/90 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-2xl h-12 w-12 bg-slate-50 hover:bg-slate-100 text-slate-400"><ArrowLeft size={24} /></Button>
            <div>
              <h2 className="font-black text-slate-900 text-xl md:text-2xl tracking-tighter leading-none">{cityName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sala Ativa • {onlineUsers.length} online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/lobby')} 
              className="hidden md:flex items-center gap-2 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl px-6 h-12 transition-all active:scale-95"
            >
              <LogOut size={18} /> Sair da Sala
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300 rounded-2xl h-12 w-12 hover:bg-slate-50"><Info size={24} /></Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 bg-slate-50 rounded-2xl"><Users size={24} /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80 border-none shadow-2xl">
                <div className="p-8 border-b border-slate-50">
                  <h3 className="font-black text-slate-900 uppercase tracking-[0.25em] text-[11px]">Usuários Online</h3>
                </div>
                <ScrollArea className="h-full pb-20">
                  <UserList />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Banner de Publicidade Topo */}
        <div className="bg-white px-6 py-3 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="rounded-2xl overflow-hidden shadow-sm" />
        </div>

        {/* Área de Mensagens */}
        <ScrollArea className="flex-1 p-6 md:p-10 bg-slate-50/40" ref={scrollRef}>
          <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {messagesList.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col gap-1.5 max-w-[90%] md:max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-500", 
                  msg.type === 'system' ? "mx-auto items-center w-full max-w-full" : 
                  msg.isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                {msg.type === 'system' ? (
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 text-center shadow-xl shadow-slate-200/20 w-full md:w-3/4 my-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary"><Megaphone size={16} /></div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Comunicado Oficial</span>
                    </div>
                    <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">{msg.content}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest", 
                        msg.isMe ? "text-primary" : "text-slate-400"
                      )}>
                        {msg.sender} {msg.isPrivate && <span className="text-rose-500 ml-1.5 bg-rose-50 px-2 py-0.5 rounded-full">reservadamente</span>}
                      </span>
                      <span className="text-[9px] text-slate-300 font-bold">{msg.time}</span>
                    </div>
                    <div className={cn(
                      "p-4 md:p-5 rounded-[2rem] shadow-sm relative transition-all hover:shadow-md", 
                      msg.isMe 
                        ? (msg.isPrivate ? "bg-slate-900 text-white rounded-tr-none" : "bg-primary text-white rounded-tr-none shadow-primary/10")
                        : (msg.isPrivate ? "bg-rose-50 text-rose-900 border border-rose-100 rounded-tl-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none")
                    )}>
                      {msg.isPrivate && <EyeOff size={12} className="absolute top-3 right-3 opacity-20" />}
                      <p className="font-bold text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Barra de Digitação */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 shrink-0">
          <div className="max-w-5xl mx-auto relative">
            {isPrivate && (
              <div className="absolute -top-12 left-0 flex items-center gap-3 bg-slate-900 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 z-20 border border-white/10">
                <Lock size={14} className="text-rose-500" /> Reservado para: <span className="text-rose-400">{targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"><X size={14} /></button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-50 rounded-[2.5rem] p-2 border-2 border-transparent focus-within:border-primary/10 focus-within:bg-white transition-all shadow-inner">
              <div className="flex items-center gap-1 px-2">
                <Button variant="ghost" size="icon" className="text-slate-300 rounded-2xl h-12 w-12 hover:text-primary hover:bg-primary/5 transition-all"><CameraIcon size={24} /></Button>
                <Button variant="ghost" size="icon" className="text-slate-300 rounded-2xl h-12 w-12 hover:text-primary hover:bg-primary/5 transition-all"><Smile size={24} /></Button>
              </div>
              <Input 
                ref={messageInputRef}
                placeholder={isPrivate ? `Sussurrar para ${targetUser}...` : "Escreva sua mensagem aqui..."} 
                className="border-none bg-transparent font-bold text-base md:text-lg h-12 focus-visible:ring-0 placeholder:text-slate-300" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!message.trim()} 
                className={cn(
                  "rounded-[1.5rem] w-14 h-14 shrink-0 shadow-2xl active:scale-90 transition-all duration-300",
                  isPrivate ? "bg-slate-900 hover:bg-black" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                )}
              >
                <SendHorizontal size={24} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;