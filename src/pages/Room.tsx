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
  Megaphone
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
  const [roomAnnouncement, setRoomAnnouncement] = useState('');

  const onlineUsers = ["Maria_22", "Joao_Silva", "Gabi_BH", "Paulo_Vila", "Nanda_Fit"];

  // Título da sala amigável
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

    // Mensagem inicial do sistema ao entrar
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      sender: 'Sistema',
      content: `Bem-vindo à sala ${cityName}, ${nickname}! Respeite os outros usuários e divirta-se.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
      type: 'system'
    };
    setMessagesList([welcomeMsg]);

    const loadMsgConfig = () => {
      const config = JSON.parse(localStorage.getItem('kipapo_msg_config') || '{"content":"","interval":"0"}');
      setRoomAnnouncement(config.content || '');
      return config;
    };

    const config = loadMsgConfig();

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

    const handleStorageChange = () => {
      loadMsgConfig();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [hasJoined, cityName, nickname]);

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

  const UserList = () => (
    <div className="space-y-1">
      {onlineUsers.map(user => (
        <button 
          key={user} 
          onClick={() => { setTargetUser(user); setIsPrivate(true); }} 
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-slate-50 text-left group", 
            targetUser === user ? "bg-indigo-50 shadow-sm ring-1 ring-indigo-100" : ""
          )}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-slate-100 font-black text-xs text-slate-400">{user[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-sm font-black text-slate-700 block truncate tracking-tight">{user}</span>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Online</span>
          </div>
        </button>
      ))}
    </div>
  );

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 font-sans">
        <Card className="w-full max-w-xl p-10 md:p-14 rounded-[3.5rem] border-none shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] space-y-10 bg-white">
          <div className="text-center space-y-8">
            <div className="bg-primary/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary">
              <Users size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Entrar na Sala</h2>
              <p className="text-slate-400 font-bold text-sm">Escolha seu apelido</p>
            </div>
            <Input 
              placeholder="Seu apelido..." 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()} 
              className="h-20 rounded-3xl text-center font-black text-2xl border-none bg-slate-50 shadow-inner" 
            />
            <Button 
              onClick={handleJoin} 
              disabled={nickname.trim().length < 3} 
              className="w-full h-20 bg-primary hover:bg-primary/90 rounded-3xl font-black text-xl text-white shadow-2xl"
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
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col z-20">
        <div className="p-8 border-b border-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Online</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <UserList />
          <div className="mt-10 p-4">
            <AdSlot city={cityName} slotIndex={1} className="rounded-[2rem]" />
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative bg-white">
        <header className="h-20 md:h-24 border-b border-slate-100 flex items-center justify-between px-6 md:px-10 bg-white/90 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-2xl h-12 w-12"><ArrowLeft size={24} /></Button>
            <div>
              <h2 className="font-black text-slate-900 text-xl md:text-2xl tracking-tighter">{cityName}</h2>
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Sala Ativa</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-300 rounded-2xl h-12 w-12"><Info size={22} /></Button>
            <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden h-12 w-12"><Users size={22} /></Button></SheetTrigger>
              <SheetContent side="right" className="p-0 w-80"><UserList /></SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="bg-white px-6 py-4 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="rounded-2xl" />
        </div>

        {roomAnnouncement && (
          <div className="bg-indigo-50 border-b border-indigo-100 p-4 md:px-10 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 shrink-0">
             <div className="bg-indigo-600 p-2 rounded-xl text-white shrink-0"><Megaphone size={18} /></div>
             <p className="text-indigo-900 text-sm font-bold leading-relaxed">{roomAnnouncement}</p>
          </div>
        )}

        <ScrollArea className="flex-1 p-6 md:p-10 bg-slate-50/30" ref={scrollRef}>
          <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {messagesList.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col gap-1.5 max-w-[85%] animate-in fade-in", 
                  msg.type === 'system' ? "mx-auto items-center w-full max-w-full" : 
                  msg.isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                {msg.type === 'system' ? (
                  <div className="bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 rounded-3xl p-6 text-center shadow-sm w-full md:w-3/4 my-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Megaphone className="text-indigo-600" size={16} />
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Comunicado do Sistema</span>
                    </div>
                    <p className="text-indigo-900 font-bold leading-relaxed">{msg.content}</p>
                    <span className="text-[9px] text-indigo-300 mt-2 block">{msg.time}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-2">
                      <span className={cn("text-[10px] font-black uppercase tracking-wider", msg.isMe ? "text-primary" : "text-slate-400")}>
                        {msg.sender} • {msg.time}
                      </span>
                    </div>
                    <div className={cn(
                      "p-4 md:p-5 rounded-[1.75rem] shadow-sm", 
                      msg.isMe 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    )}>
                      <p className="font-bold text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 md:p-8 bg-white border-t border-slate-50 shrink-0">
          <div className="max-w-6xl mx-auto">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[10px] font-black uppercase px-6 py-3 rounded-2xl mb-4 shadow-lg shadow-primary/20">
                <span className="flex items-center gap-2"><Lock size={14} /> Conversa Privada com {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors">CANCELAR</button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-50 rounded-[2rem] p-2 border-2 border-transparent focus-within:border-primary/10 focus-within:bg-white transition-all shadow-inner">
              <Button variant="ghost" size="icon" className="text-slate-300 rounded-2xl h-12 w-12 shrink-0 hover:text-primary" onClick={() => setIsMediaDialogOpen(true)}><CameraIcon size={24} /></Button>
              <Input 
                ref={messageInputRef}
                placeholder="Diga algo..." 
                className="border-none bg-transparent font-bold text-base md:text-lg h-12 focus-visible:ring-0" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!message.trim()} 
                className="bg-primary rounded-2xl w-12 h-12 shrink-0 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <SendHorizontal size={22} />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[340px] rounded-[2.5rem] p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center font-black">Enviar Mídia</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => setIsMediaDialogOpen(false)} className="h-14 bg-primary text-white rounded-2xl font-black">Tirar Foto</Button>
            <Button onClick={() => setIsMediaDialogOpen(false)} variant="secondary" className="h-14 rounded-2xl font-black">Galeria</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;