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
  Glasses
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import AdSlot from '@/components/ads/AdSlot';
import AvatarCreator, { AvatarTraits } from '@/components/chat/AvatarCreator';

interface ChatMessage {
  id: string;
  sender: string;
  receiver?: string; 
  content: string;
  time: string;
  isMe: boolean;
  isPrivate?: boolean;
  type?: 'text' | 'image' | 'video';
  avatarTraits?: AvatarTraits;
}

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [nickname, setNickname] = useState('');
  const [isCreatingAvatar, setIsCreatingAvatar] = useState(false);
  const [userAvatar, setUserAvatar] = useState<AvatarTraits | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [isCalling, setIsCalling] = useState(false);
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
      type,
      avatarTraits: userAvatar || undefined
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

  const captureMedia = () => {
    handleSendMessage(cameraMode === 'photo' ? "Enviou uma foto!" : "Enviou um vídeo!", cameraMode === 'photo' ? 'image' : 'video');
    stopLiveCamera();
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
      setIsCreatingAvatar(true);
    } 
  };

  const finalizeJoin = (traits?: AvatarTraits) => {
    if (traits) setUserAvatar(traits);
    setHasJoined(true);
    setIsCreatingAvatar(false);
  };

  const AvatarPreview = ({ traits, name }: { traits?: AvatarTraits, name: string }) => {
    if (!traits) {
      return (
        <Avatar className="h-9 w-9 shrink-0 shadow-sm">
          <AvatarFallback className="bg-slate-200 text-[10px] font-black">{name[0]}</AvatarFallback>
        </Avatar>
      );
    }

    const skinTones: Record<string, string> = { 'Claro': '#ffdbac', 'Pardo': '#e0ac69', 'Escuro': '#8d5524' };
    const hairColors: Record<string, string> = { 'Preto': '#090806', 'Castanho': '#4e2d11', 'Loiro': '#d6b37a', 'Ruivo': '#a5452d' };
    
    return (
      <div 
        className="h-9 w-9 rounded-full border-2 border-white shadow-md relative overflow-hidden shrink-0"
        style={{ backgroundColor: skinTones[traits.skinTone] || '#e0ac69' }}
      >
        {traits.hairStyle !== 'Careca' && (
          <div 
            className="absolute top-0 left-0 w-full h-[40%] opacity-80"
            style={{ backgroundColor: hairColors[traits.hairColor] || '#090806' }}
          />
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <UserRound size={18} className="text-slate-900/10" />
        </div>
        {traits.glasses && (
           <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-slate-900/60 scale-[0.6]">
             <Glasses size={14} />
           </div>
        )}
      </div>
    );
  };

  const UserList = () => (
    <div className="space-y-2">
      {onlineUsers.map(user => (
        <button 
          key={user} 
          onClick={() => selectPrivateUser(user)} 
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white text-left", 
            targetUser === user ? "bg-white shadow-md ring-1 ring-primary/10" : ""
          )}
        >
          <div className="relative">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-slate-200 font-black text-xs">{user[0]}</AvatarFallback></Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="text-sm font-bold text-slate-700 block truncate">{user}</span>
            <span className="text-[9px] text-emerald-600 font-bold uppercase">Online</span>
          </div>
        </button>
      ))}
    </div>
  );

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] border-none shadow-2xl space-y-6">
          {!isCreatingAvatar ? (
            <div className="text-center space-y-6">
              <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-primary"><Users size={40} /></div>
              <h2 className="text-2xl font-black text-slate-800">Entrar na Sala</h2>
              <Input 
                placeholder="Seu apelido..." 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()} 
                className="h-14 rounded-2xl text-center font-bold" 
                autoFocus 
              />
              <Button 
                onClick={handleJoin} 
                disabled={nickname.trim().length < 3} 
                className="w-full h-16 bg-primary rounded-2xl font-black text-white shadow-xl transition-transform active:scale-95"
              >
                Próximo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800">Crie seu Avatar</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personalize como os outros te veem</p>
              </div>
              <AvatarCreator onSave={finalizeJoin} onCancel={() => finalizeJoin()} />
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <aside className="w-80 bg-slate-50 border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Contatos Online</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <UserList />
          <div className="mt-10">
            <AdSlot city={cityName} slotIndex={1} className="h-64" />
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 md:h-20 border-b border-slate-100 flex items-center justify-between px-4 md:px-6 bg-white z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full text-slate-400 h-10 w-10">
              <ArrowLeft size={20} />
            </Button>
            <div className="overflow-hidden">
              <h2 className="font-black text-slate-900 text-base md:text-xl tracking-tight truncate">{cityName}</h2>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Papo Aberto</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button onClick={() => setIsCalling(true)} variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-full h-10 w-10">
              <VideoIcon size={20} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-primary rounded-full h-10 w-10">
                  <Users size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 border-none w-72">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left font-black text-slate-900 uppercase tracking-widest text-[10px]">Pessoas Online</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full p-4 bg-slate-50">
                  <UserList />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="bg-white px-4 md:px-6 py-2 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="h-12 md:h-14" />
        </div>

        <ScrollArea className="flex-1 p-4 md:p-6 bg-slate-50/20" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 py-2 md:py-4">
            {visibleMessages.length === 0 && (
              <div className="text-center py-20 opacity-30 select-none">
                <p className="text-xs font-black uppercase tracking-widest">Inicie o papo agora!</p>
              </div>
            )}
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[85%] md:max-w-[80%]", msg.isMe ? "ml-auto items-end" : "items-start animate-in fade-in slide-in-from-bottom-2")}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tight">
                    {msg.isPrivate ? `PARA ${msg.receiver}` : msg.sender} • {msg.time}
                  </span>
                  {msg.isPrivate && <Lock size={10} className="text-primary" />}
                </div>
                <div className="flex items-end gap-2">
                  {msg.isMe && <AvatarPreview traits={msg.avatarTraits} name={msg.sender} />}
                  <div className={cn(
                    "p-3 md:p-4 rounded-[1.25rem] md:rounded-[1.5rem] shadow-sm", 
                    msg.isMe ? (msg.isPrivate ? "bg-indigo-700 text-white rounded-tr-none" : "bg-primary text-white rounded-tr-none") : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.type === 'text' ? (
                      <p className="text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                    ) : (
                      <div className="flex items-center gap-3">
                        {msg.type === 'image' ? <ImageIcon size={20} /> : <VideoIcon size={20} />}
                        <p className="text-xs font-black italic">{msg.content}</p>
                      </div>
                    )}
                  </div>
                  {!msg.isMe && <AvatarPreview name={msg.sender} />}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 md:p-6 bg-white border-t border-slate-100 shrink-0 pb-safe">
          <div className="max-w-4xl mx-auto space-y-3">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[9px] md:text-[10px] font-black uppercase px-4 py-2 rounded-xl animate-in slide-in-from-bottom-2">
                <span className="flex items-center gap-2"><Lock size={12}/> Privado para: {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="hover:underline">CANCELAR</button>
              </div>
            )}
            <div className="flex items-center gap-2 md:gap-3 bg-slate-100 rounded-[1.5rem] md:rounded-[2rem] p-1.5 border border-transparent focus-within:border-primary/20">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-primary rounded-full h-10 w-10 shrink-0" 
                onClick={() => setIsMediaDialogOpen(true)}
              >
                <CameraIcon size={20} />
              </Button>
              <Input 
                ref={messageInputRef}
                placeholder="Sua mensagem..." 
                className="border-none bg-transparent font-bold text-slate-700 focus-visible:ring-0 text-sm h-10 px-1" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!message.trim()} 
                className="bg-primary hover:bg-primary/90 text-white rounded-full md:rounded-[1.25rem] w-10 h-10 md:w-12 md:h-12 shadow-xl shadow-primary/20 shrink-0 transition-transform active:scale-90"
              >
                <SendHorizontal size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-[2rem] p-6 md:p-8 border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-xl font-black">Enviar Mídia</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => startLiveCamera('photo')} className="h-14 bg-primary text-white rounded-2xl font-black gap-3 shadow-lg shadow-primary/20">
              <CameraIcon size={18} /> Tirar Foto
            </Button>
            <Button onClick={() => startLiveCamera('video')} variant="outline" className="h-14 rounded-2xl font-black gap-3 border-slate-200">
              <VideoIcon size={18} /> Gravar Vídeo
            </Button>
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="secondary" 
                className="w-full h-14 rounded-2xl font-black gap-3"
              >
                <GalleryIcon size={18} /> Galeria de Fotos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLiveCameraOpen} onOpenChange={(open) => !open && stopLiveCamera()}>
        <DialogContent className="max-w-md h-[90vh] md:h-[80vh] rounded-[2.5rem] bg-black border-none p-0 overflow-hidden">
          <div className="relative h-full flex flex-col">
            <video ref={videoRef} autoPlay playsInline muted={cameraMode === 'photo'} className="w-full h-full object-cover" />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
              <Button 
                onClick={captureMedia} 
                className={cn(
                  "h-20 w-20 md:h-24 md:w-24 rounded-full bg-white border-8 border-slate-200/50 shadow-2xl transition-transform active:scale-90",
                  cameraMode === 'video' ? "bg-red-500 border-red-200" : ""
                )} 
              />
            </div>
            <button onClick={stopLiveCamera} className="absolute top-6 right-6 text-white bg-black/40 p-2 rounded-full transition-colors hover:bg-black/60">
              <X size={24}/>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalling} onOpenChange={setIsCalling}>
        <DialogContent className="max-w-md h-[90vh] md:h-[80vh] rounded-[2.5rem] bg-slate-900 border-none p-0 overflow-hidden shadow-2xl">
          <div className="h-full flex flex-col items-center justify-between py-16 md:py-20 text-white">
            <div className="space-y-6 text-center">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary animate-pulse mx-auto">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl md:text-3xl font-black">Vídeo Chamada</h3>
              <p className="text-primary font-black uppercase tracking-widest text-[10px] animate-bounce">Encaminhando...</p>
            </div>
            <Button 
              onClick={() => setIsCalling(false)} 
              size="icon" 
              className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/30 transition-transform active:scale-90"
            >
              <X size={32} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;