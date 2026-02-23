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
  Smile, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  X, 
  Mic,
  RefreshCw
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [isCalling, setIsCalling] = useState(false);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const onlineUsers = ["Maria_22", "Joao_Silva", "Gabi_BH", "Paulo_Vila", "Nanda_Fit"];

  // Efeito de scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messagesList]);

  // Simulação de Resposta de Contatos Fictícios
  useEffect(() => {
    const lastMsg = messagesList[messagesList.length - 1];
    if (lastMsg?.isMe) {
      const timer = setTimeout(() => {
        const botName = lastMsg.isPrivate ? (lastMsg.receiver || onlineUsers[0]) : onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        const reply: ChatMessage = {
          id: Date.now().toString(),
          sender: botName,
          receiver: lastMsg.isPrivate ? nickname : undefined,
          content: lastMsg.isPrivate ? `Oi! Tudo bem? Vi que me chamou no privado.` : `E aí ${nickname}! Que bom ver você por aqui em ${cityName}!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          isPrivate: lastMsg.isPrivate,
          type: 'text'
        };
        setMessagesList(prev => [...prev, reply]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messagesList]);

  const cityName = useMemo(() => {
    if (!roomId) return "nossa cidade";
    const parts = roomId.split('-');
    return parts.length > 1 ? parts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase()) : "Sala Local";
  }, [roomId]);

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

  const startLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsLiveCameraOpen(true);
      setIsMediaDialogOpen(false);
    } catch (err) {
      toast.error("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setIsLiveCameraOpen(false);
  };

  const takePhoto = () => {
    handleSendMessage("Enviou uma foto instantânea!", 'image');
    stopLiveCamera();
    toast.success("Foto enviada com sucesso!");
  };

  const handleJoin = () => { if (nickname.trim().length >= 3) setHasJoined(true); };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-10 rounded-[2.5rem] border-none shadow-2xl text-center space-y-6">
          <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-inner"><Users size={40} /></div>
          <h2 className="text-2xl font-black text-slate-800">Entrar na Sala</h2>
          <Input placeholder="Seu apelido..." value={nickname} onChange={(e) => setNickname(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJoin()} className="h-14 rounded-2xl text-center font-bold text-lg" autoFocus />
          <Button onClick={handleJoin} disabled={nickname.trim().length < 3} className="w-full h-16 bg-primary rounded-2xl font-black text-white shadow-xl shadow-primary/20 transition-all active:scale-95">Entrar Agora</Button>
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
              <button key={user} onClick={() => { setTargetUser(user); setIsPrivate(true); setTimeout(() => messageInputRef.current?.focus(), 10); }} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white", targetUser === user ? "bg-white shadow-md ring-1 ring-primary/10" : "")}>
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm"><AvatarFallback className="bg-slate-200 font-black text-xs">{user[0]}</AvatarFallback></Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-slate-700 block">{user}</span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Disponível</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full text-slate-400"><ArrowLeft size={20} /></Button>
            <div>
              <h2 className="font-black text-slate-900 text-xl tracking-tight">{cityName}</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Papo Aberto</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={() => setIsCalling(true)} variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-full"><Video size={20} /></Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6 bg-slate-50/20" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6 py-4">
            {messagesList.length === 0 && (
              <div className="text-center py-20 opacity-20"><ImageIcon size={48} className="mx-auto mb-4" /><p className="font-bold">Nenhuma mensagem ainda...</p></div>
            )}
            {messagesList.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[80%]", msg.isMe ? "ml-auto items-end" : "items-start animate-in fade-in slide-in-from-bottom-2")}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 font-black uppercase">
                    {msg.time} {msg.isMe ? nickname : msg.sender}
                  </span>
                  {msg.isPrivate && <Lock size={8} className="text-primary" />}
                </div>
                <div className={cn(
                  "p-4 rounded-[1.5rem] shadow-sm", 
                  msg.isMe 
                    ? (msg.isPrivate ? "bg-indigo-700 text-white rounded-tr-none" : "bg-primary text-white rounded-tr-none") 
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200/50"
                )}>
                  {msg.type === 'text' ? (
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="bg-black/10 p-2 rounded-lg">
                        {msg.type === 'image' ? <ImageIcon size={20} /> : <VideoIcon size={20} />}
                      </div>
                      <p className="text-xs font-black italic">{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-3">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-xl animate-in fade-in">
                <span className="flex items-center gap-2"><Lock size={12}/> Enviando no privado para: <span className="underline">{targetUser}</span></span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="font-black hover:opacity-50 transition-opacity">CANCELAR</button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-100 rounded-[2rem] p-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all border border-transparent focus-within:border-primary/20">
              <Button variant="ghost" size="icon" className="text-slate-400 rounded-full" onClick={() => setIsMediaDialogOpen(true)}><CameraIcon size={20} /></Button>
              <Input ref={messageInputRef} placeholder={isPrivate ? `Conversando no privado com ${targetUser}...` : "Diga algo para todos..."} className="border-none bg-transparent font-bold text-slate-700 placeholder:text-slate-400" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <Button onClick={() => handleSendMessage()} disabled={!message.trim()} className="bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] w-12 h-12 shadow-xl shadow-primary/20 shrink-0 transition-transform active:scale-90"><SendHorizontal size={22} /></Button>
            </div>
          </div>
        </div>
      </main>

      {/* Seletor de Mídia */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] p-8 border-none shadow-2xl">
          <div className="text-center space-y-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary"><CameraIcon size={32} /></div>
            <div className="space-y-3">
              <Button onClick={startLiveCamera} className="w-full h-14 bg-primary text-white rounded-2xl font-black gap-3 shadow-lg shadow-primary/20"><CameraIcon size={18} /> Tirar Foto Agora</Button>
              <Button onClick={() => toast.info("Gravação de vídeo em desenvolvimento.")} variant="outline" className="w-full h-14 rounded-2xl font-black gap-3 border-slate-200"><VideoIcon size={18} /> Gravar Vídeo Agora</Button>
            </div>
            <Button onClick={() => setIsMediaDialogOpen(false)} variant="ghost" className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Câmera ao Vivo para Foto Instantânea */}
      <Dialog open={isLiveCameraOpen} onOpenChange={(open) => !open && stopLiveCamera()}>
        <DialogContent className="max-w-md h-[80vh] rounded-[2.5rem] bg-black border-none p-0 overflow-hidden">
          <div className="relative h-full flex flex-col">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/10">Câmera Ativa</span>
              <Button onClick={stopLiveCamera} variant="ghost" size="icon" className="bg-white/10 text-white rounded-full"><X size={20} /></Button>
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
               <Button onClick={takePhoto} className="h-24 w-24 rounded-full bg-white border-8 border-slate-200/50 hover:scale-105 transition-all shadow-2xl" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chamada de Vídeo Encaminhando */}
      <Dialog open={isCalling} onOpenChange={setIsCalling}>
        <DialogContent className="max-w-md h-[80vh] rounded-[2.5rem] bg-slate-900 border-none p-0 overflow-hidden shadow-2xl">
          <div className="h-full flex flex-col items-center justify-between py-20 px-10 text-center">
            <div className="space-y-4">
              <div className="relative mx-auto">
                <Avatar className="h-40 w-40 border-4 border-primary shadow-2xl shadow-primary/40 animate-pulse">
                  <AvatarFallback className="bg-slate-800 text-white text-5xl font-black">?</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-full border-4 border-slate-900"><VideoIcon className="text-white" size={24} /></div>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">Chamada de Vídeo</h3>
              <p className="text-primary font-black uppercase tracking-widest text-[10px] animate-bounce">Encaminhando chamada...</p>
            </div>

            <div className="space-y-8 w-full">
              <p className="text-slate-400 text-xs font-medium px-10 leading-relaxed">Aguardando o participante aceitar o convite para conexão segura em {cityName}.</p>
              <div className="flex justify-center gap-6">
                <Button size="icon" className="h-16 w-16 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"><Mic size={24} /></Button>
                <Button onClick={() => setIsCalling(false)} size="icon" className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/30 transition-transform active:scale-95"><X size={32} /></Button>
                <Button size="icon" className="h-16 w-16 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"><RefreshCw size={24} /></Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;