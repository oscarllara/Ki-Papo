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
  ImageIcon,
  VideoIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  
  const [nickname, setNickname] = useState('');
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
      type
    };
    setMessagesList(prev => [...prev, newMessage]);
    if (type === 'text') setMessage('');
    messageInputRef.current?.focus();
  };

  const startLiveCamera = async (mode: 'photo' | 'video') => {
    try {
      setCameraMode(mode);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: mode === 'video' });
      setCameraStream(stream);
      setIsLiveCameraOpen(true);
      setIsMediaDialogOpen(false);
    } catch (err) {
      toast.error("Erro ao acessar câmera.");
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

  const selectPrivateUser = (user: string) => {
    setTargetUser(user);
    setIsPrivate(true);
    setTimeout(() => messageInputRef.current?.focus(), 100);
  };

  const handleJoin = () => { if (nickname.trim().length >= 3) setHasJoined(true); };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-10 rounded-[2.5rem] border-none shadow-2xl text-center space-y-6">
          <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-primary"><Users size={40} /></div>
          <h2 className="text-2xl font-black text-slate-800">Entrar na Sala</h2>
          <Input placeholder="Seu apelido..." value={nickname} onChange={(e) => setNickname(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJoin()} className="h-14 rounded-2xl text-center font-bold" autoFocus />
          <Button onClick={handleJoin} disabled={nickname.trim().length < 3} className="w-full h-16 bg-primary rounded-2xl font-black text-white shadow-xl">Entrar</Button>
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
          <div className="space-y-2">
            {onlineUsers.map(user => (
              <button key={user} onClick={() => selectPrivateUser(user)} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white text-left", targetUser === user ? "bg-white shadow-md ring-1 ring-primary/10" : "")}>
                <div className="relative">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-slate-200 font-black text-xs">{user[0]}</AvatarFallback></Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div><span className="text-sm font-bold text-slate-700 block">{user}</span><span className="text-[9px] text-emerald-600 font-bold uppercase">Online</span></div>
              </button>
            ))}
          </div>
          {/* Anúncio na lateral da sala (Slot 1) */}
          <div className="mt-10">
            <AdSlot city={cityName} slotIndex={1} className="h-64" />
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full text-slate-400"><ArrowLeft size={20} /></Button>
            <div>
              <h2 className="font-black text-slate-900 text-xl tracking-tight">{cityName}</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Papo Aberto</span>
            </div>
          </div>
          <Button onClick={() => setIsCalling(true)} variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-full"><Video size={20} /></Button>
        </header>

        {/* Anúncio Topo da Sala (Slot 0) */}
        <div className="bg-white px-6 py-2 border-b border-slate-50 shrink-0">
          <AdSlot city={cityName} slotIndex={0} className="h-14" />
        </div>

        <ScrollArea className="flex-1 p-6 bg-slate-50/20" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6 py-4">
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[80%]", msg.isMe ? "ml-auto items-end" : "items-start animate-in fade-in")}>
                <div className="flex items-center gap-2"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{msg.isPrivate ? `PARA ${msg.receiver}` : msg.sender} • {msg.time}</span>{msg.isPrivate && <Lock size={10} className="text-primary" />}</div>
                <div className={cn("p-4 rounded-[1.5rem] shadow-sm", msg.isMe ? (msg.isPrivate ? "bg-indigo-700 text-white rounded-tr-none" : "bg-primary text-white rounded-tr-none") : "bg-white text-slate-700 border border-slate-100 rounded-tl-none")}>
                  {msg.type === 'text' ? <p className="text-sm font-medium leading-relaxed">{msg.content}</p> : <div className="flex items-center gap-3"><CameraIcon size={20} /><p className="text-xs font-black italic">{msg.content}</p></div>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-xl animate-in fade-in">
                <span><Lock size={12} className="inline mr-2"/> Privado para: {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="font-black">CANCELAR</button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-100 rounded-[2rem] p-2 border border-transparent focus-within:border-primary/20">
              <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setIsMediaDialogOpen(true)}><CameraIcon size={20} /></Button>
              <Input placeholder="Sua mensagem..." className="border-none bg-transparent font-bold text-slate-700 focus-visible:ring-0" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <Button onClick={() => handleSendMessage()} disabled={!message.trim()} className="bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] w-12 h-12 shadow-xl shadow-primary/20 shrink-0 transition-transform active:scale-90"><SendHorizontal size={22} /></Button>
            </div>
            {/* Anúncio Rodapé da Sala (Slot 2) */}
            <AdSlot city={cityName} slotIndex={2} className="h-14 mt-4" />
          </div>
        </div>
      </main>

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] p-8 border-none shadow-2xl">
          <div className="text-center space-y-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary"><CameraIcon size={32} /></div>
            <div className="space-y-3">
              <Button onClick={() => startLiveCamera('photo')} className="w-full h-14 bg-primary text-white rounded-2xl font-black gap-3 shadow-lg shadow-primary/20"><CameraIcon size={18} /> Tirar Foto</Button>
              <Button onClick={() => startLiveCamera('video')} variant="outline" className="w-full h-14 rounded-2xl font-black gap-3 border-slate-200"><VideoIcon size={18} /> Gravar Vídeo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLiveCameraOpen} onOpenChange={(open) => !open && stopLiveCamera()}>
        <DialogContent className="max-w-md h-[80vh] rounded-[2.5rem] bg-black border-none p-0 overflow-hidden">
          <div className="relative h-full flex flex-col">
            <video ref={videoRef} autoPlay playsInline muted={cameraMode === 'photo'} className="w-full h-full object-cover" />
            <div className="absolute bottom-10 left-0 right-0 flex justify-center"><Button onClick={captureMedia} className={cn("h-24 w-24 rounded-full bg-white border-8 border-slate-200/50 shadow-2xl", cameraMode === 'video' ? "bg-red-500 border-red-200" : "")} /></div>
            <button onClick={stopLiveCamera} className="absolute top-6 right-6 text-white bg-black/40 p-2 rounded-full"><X size={24}/></button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalling} onOpenChange={setIsCalling}>
        <DialogContent className="max-w-md h-[80vh] rounded-[2.5rem] bg-slate-900 border-none p-0 overflow-hidden shadow-2xl">
          <div className="h-full flex flex-col items-center justify-between py-20 text-white">
            <div className="space-y-6">
              <Avatar className="h-40 w-40 border-4 border-primary animate-pulse mx-auto"><AvatarFallback>?</AvatarFallback></Avatar>
              <h3 className="text-3xl font-black">Vídeo Chamada</h3>
              <p className="text-primary font-black uppercase tracking-widest text-[10px]">Encaminhando...</p>
            </div>
            <Button onClick={() => setIsCalling(false)} size="icon" className="h-20 w-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/30"><X size={32} /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;