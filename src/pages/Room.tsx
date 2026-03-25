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
  Phone, 
  Video, 
  Camera as CameraIcon, 
  ArrowLeft, 
  Users, 
  Lock, 
  X, 
  Mic,
  RefreshCw,
  Image as GalleryIcon,
  Video as VideoIcon,
  Menu,
  FileImage as ImageIcon,
  UserRound,
  Info,
  MessageSquare
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import AdSlot from '@/components/ads/AdSlot';

interface ChatMessage {
  id: string;
  sender: string;
  receiver?: string; 
  content: string;
  time: string;
  isMe: boolean;
  isPrivate?: boolean;
  type?: 'text' | 'image' | 'video';
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [nickname, setNickname] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const onlineUsers = ["Maria_22", "Joao_Silva", "Gabi_BH", "Paulo_Vila", "Nanda_Fit"];

  useEffect(() => {
    if (isLiveCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(e => console.error(e));
    }
  }, [isLiveCameraOpen, cameraStream]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messagesList]);

  const cityName = useMemo(() => {
    if (!roomId) return "Local";
    const parts = roomId.split('-');
    const namePart = parts.slice(0, -1).join(' ');
    return namePart.replace(/\b\w/g, l => l.toUpperCase()) || "Sala Local";
  }, [roomId]);

  const visibleMessages = useMemo(() => {
    return messagesList.filter(msg => !msg.isPrivate || msg.sender === nickname || msg.receiver === nickname);
  }, [messagesList, nickname]);

  const handleSendMessage = (content: string = message, type: 'text' | 'image' | 'video' = 'text') => {
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

  const startLiveCamera = async (mode: 'photo' | 'video') => {
    try {
      setCameraMode(mode);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: mode === 'video' 
      });
      setCameraStream(stream);
      setIsLiveCameraOpen(true);
      setIsMediaDialogOpen(false);
    } catch (err) {
      toast.error("Erro ao acessar câmera. Verifique as permissões.");
    }
  };

  const stopLiveCamera = () => {
    cameraStream?.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setIsLiveCameraOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      handleSendMessage(isVideo ? "Enviou um vídeo da galeria!" : "Enviou uma imagem da galeria!", isVideo ? 'video' : 'image');
      setIsMediaDialogOpen(false);
    }
  };

  const selectPrivateUser = (user: string) => {
    setTargetUser(user);
    setIsPrivate(true);
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 50);
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
          onClick={() => selectPrivateUser(user)} 
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white text-left group", 
            targetUser === user ? "bg-white shadow-xl shadow-primary/5 ring-1 ring-primary/10" : ""
          )}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              <AvatarFallback className="bg-slate-50 font-black text-xs text-slate-400">{user[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-sm font-black text-slate-700 block truncate tracking-tight">{user}</span>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Disponível</span>
          </div>
        </button>
      ))}
    </div>
  );

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6">
        <Card className="w-full max-w-xl p-10 md:p-14 rounded-[3.5rem] border-none shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] space-y-10 bg-white">
          <div className="text-center space-y-8">
            <div className="bg-primary/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-inner">
              <Users size={48} className="animate-in zoom-in duration-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Entrar na Sala</h2>
              <p className="text-slate-400 font-bold text-sm">Como você quer ser chamado?</p>
            </div>
            <Input 
              placeholder="Seu apelido..." 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()} 
              className="h-20 rounded-3xl text-center font-black text-2xl border-none bg-slate-50 shadow-inner focus-visible:ring-primary/20" 
              autoFocus 
            />
            <Button 
              onClick={handleJoin} 
              disabled={nickname.trim().length < 3} 
              className="w-full h-20 bg-primary hover:bg-primary/90 rounded-3xl font-black text-xl text-white shadow-2xl shadow-primary/20 transition-all active:scale-95"
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
      <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col shadow-2xl shadow-slate-200/20 z-20">
        <div className="p-8 border-b border-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Pessoas Conectadas</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <UserList />
          <div className="mt-10 p-2">
            <AdSlot city={cityName} slotIndex={1} className="h-64 rounded-[2.5rem]" />
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative bg-white">
        <header className="h-20 md:h-24 border-b border-slate-100 flex items-center justify-between px-6 md:px-10 bg-white/90 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-2xl text-slate-300 hover:text-primary h-12 w-12 hover:bg-primary/5">
              <ArrowLeft size={24} />
            </Button>
            <div className="overflow-hidden">
              <h2 className="font-black text-slate-900 text-xl md:text-2xl tracking-tighter truncate">{cityName}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sala Ativa</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-2xl h-12 w-12 hover:bg-primary/5 transition-colors">
              <VideoIcon size={22} />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-2xl h-12 w-12 hover:bg-primary/5 transition-colors">
              <Info size={22} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-300 hover:text-primary rounded-2xl h-12 w-12 hover:bg-primary/5">
                  <Users size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 border-none w-80">
                <SheetHeader className="p-8 border-b border-slate-50">
                  <SheetTitle className="text-left font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Pessoas Online</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full p-6 bg-slate-50/50">
                  <UserList />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="bg-white px-6 md:px-10 py-3 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="h-14 md:h-16 rounded-3xl" />
        </div>

        <ScrollArea className="flex-1 p-6 md:p-12 bg-slate-50/20" ref={scrollRef}>
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 py-6">
            {visibleMessages.length === 0 && (
              <div className="text-center py-32 opacity-20 select-none">
                <MessageSquare className="mx-auto mb-6 text-slate-400" size={64} />
                <p className="text-sm font-black uppercase tracking-[0.4em]">Inicie a conversa!</p>
              </div>
            )}
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col gap-2 max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-4 duration-500", msg.isMe ? "ml-auto items-end" : "items-start")}>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", msg.isMe ? "text-primary" : "text-slate-400")}>
                    {msg.isPrivate ? `PARA ${msg.receiver}` : msg.sender} • {msg.time}
                  </span>
                  {msg.isPrivate && <Lock size={12} className="text-primary" />}
                </div>
                <div className={cn("flex gap-4", msg.isMe ? "flex-row-reverse" : "flex-row")}>
                  <div className="mt-auto">
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-sm">{msg.sender[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={cn(
                    "p-5 md:p-6 rounded-[2rem] shadow-sm relative group", 
                    msg.isMe 
                      ? (msg.isPrivate ? "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-200" : "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20") 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.type === 'text' ? (
                      <p className="text-base font-bold leading-relaxed break-words">{msg.content}</p>
                    ) : (
                      <div className="flex items-center gap-4 py-2">
                        {msg.type === 'image' ? <ImageIcon size={28} /> : <VideoIcon size={28} />}
                        <p className="text-xs font-black italic uppercase tracking-widest">{msg.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 md:p-10 bg-white border-t border-slate-50 shrink-0 pb-safe">
          <div className="max-w-5xl mx-auto">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[10px] font-black uppercase px-6 py-3 rounded-2xl mb-4 animate-in slide-in-from-bottom-2 shadow-lg shadow-primary/20">
                <span className="flex items-center gap-3"><Lock size={14}/> Mensagem Privada para: {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors">CANCELAR</button>
              </div>
            )}
            <div className="flex items-center gap-3 md:gap-4 bg-slate-50 rounded-[2.5rem] p-2 md:p-3 border-2 border-transparent focus-within:border-primary/10 transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-primary/5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-300 hover:text-primary rounded-2xl h-14 w-14 shrink-0 transition-colors" 
                onClick={() => setIsMediaDialogOpen(true)}
              >
                <CameraIcon size={24} />
              </Button>
              <Input 
                ref={messageInputRef}
                placeholder="Diga algo legal..." 
                className="border-none bg-transparent font-bold text-slate-700 focus-visible:ring-0 text-lg h-14 px-2" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!message.trim()} 
                className="bg-primary hover:bg-primary/90 text-white rounded-[2rem] w-14 h-14 md:w-16 md:h-16 shadow-2xl shadow-primary/30 shrink-0 transition-all active:scale-90"
              >
                <SendHorizontal size={24} />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs mantidos com a lógica funcional */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[340px] rounded-[3rem] p-10 border-none shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-center text-2xl font-black tracking-tighter">Enviar Mídia</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={() => startLiveCamera('photo')} className="h-16 bg-primary text-white rounded-2xl font-black gap-4 shadow-xl shadow-primary/20">
              <CameraIcon size={20} /> Tirar Foto
            </Button>
            <Button onClick={() => startLiveCamera('video')} variant="outline" className="h-16 rounded-2xl font-black gap-4 border-slate-100 hover:bg-slate-50">
              <VideoIcon size={20} /> Gravar Vídeo
            </Button>
            <div className="relative pt-4 border-t border-slate-50">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
              <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full h-16 rounded-2xl font-black gap-4 bg-slate-50 hover:bg-slate-100">
                <GalleryIcon size={20} /> Galeria
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;