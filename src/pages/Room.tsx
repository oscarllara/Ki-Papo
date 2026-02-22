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
  Mic
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: string;
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
  
  // Refs específicas para cada ação
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [nickname, setNickname] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Participante_Ativo',
      content: 'Olá pessoal! Alguém disponível para um papo?',
      time: '12:45',
      isMe: false,
      type: 'text'
    }
  ]);

  const cityName = useMemo(() => {
    if (!roomId) return "nossa cidade";
    try {
      const parts = roomId.split('-');
      if (parts.length > 1) parts.pop();
      return parts.join(' ').replace(/\b\w/g, l => l.toUpperCase());
    } catch (e) {
      return "Sala Ki Papo";
    }
  }, [roomId]);

  const onlineUsers = ["Local_User", "Gatinha_Chat", "Rex_2024", "Flor_do_Campo", "Navegador"];

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messagesList]);

  const handleJoin = () => {
    if (nickname.trim().length >= 3) {
      setHasJoined(true);
    }
  };

  const handleSendMessage = (content: string = message, type: 'text' | 'image' | 'video' = 'text') => {
    if (!content.trim() && type === 'text') return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: nickname,
      content: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isPrivate: isPrivate,
      type: type
    };

    setMessagesList(prev => [...prev, newMessage]);
    if (type === 'text') setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      handleSendMessage(`Enviou um(a) ${type === 'image' ? 'foto' : 'vídeo'} via ${source}`, type);
      setIsMediaDialogOpen(false);
    }
  };

  const startVideoCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      toast.info("A conexão está instável. Tentando reconectar chamada de vídeo...");
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-10 rounded-[2.5rem] border-none shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-primary/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-inner">
            <Users size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Entrar na Sala</h2>
            <p className="text-sm text-slate-400 font-medium">Escolha como quer ser chamado no chat.</p>
          </div>
          <div className="space-y-4">
            <Input 
              placeholder="Seu apelido..." 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="h-14 rounded-2xl text-center font-bold text-lg border-slate-100 bg-slate-50 focus-visible:ring-primary/30"
              autoFocus
            />
            <Button 
              onClick={handleJoin}
              disabled={nickname.trim().length < 3}
              className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              Entrar Agora
            </Button>
          </div>
          <Button variant="ghost" onClick={() => navigate('/lobby')} className="text-slate-400 hover:text-primary font-bold">
            <ArrowLeft size={16} className="mr-2" /> Voltar ao Lobby
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Inputs Escondidos Otimizados */}
      <input 
        type="file" 
        accept="image/*,video/*" 
        className="hidden" 
        ref={galleryInputRef}
        onChange={(e) => handleFileChange(e, 'Galeria')}
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={photoInputRef}
        onChange={(e) => handleFileChange(e, 'Câmera (Foto)')}
      />
      <input 
        type="file" 
        accept="video/*" 
        capture="environment" 
        className="hidden" 
        ref={videoInputRef}
        onChange={(e) => handleFileChange(e, 'Câmera (Vídeo)')}
      />

      <aside className="w-80 bg-slate-50 border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-[10px]">
            Participantes <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-md">{onlineUsers.length}</span>
          </h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {onlineUsers.map(user => (
              <button 
                key={user}
                onClick={() => {
                  setTargetUser(user);
                  setIsPrivate(true);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white hover:shadow-sm",
                  targetUser === user ? "bg-white shadow-md ring-1 ring-primary/10" : ""
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-slate-200 text-slate-500 text-xs font-black">{user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <span className="text-sm font-bold text-slate-700 truncate">{user}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-6 bg-white border-t border-slate-100">
          <p className="text-[10px] text-slate-300 font-bold uppercase text-center leading-tight">
            Toque em alguém para <br />enviar uma mensagem privada.
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full text-slate-400">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="font-black text-slate-900 tracking-tighter text-xl">
                {cityName}
              </h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Chat Público Ativo</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={() => toast.info("Ligação de áudio não disponível nesta sala.")} variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-full"><Phone size={20} /></Button>
            <Button onClick={startVideoCall} variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-full"><Video size={20} /></Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6 bg-slate-50/20" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="flex justify-center">
              <span className="text-[9px] font-black text-slate-300 bg-white px-5 py-2 rounded-full border border-slate-100 uppercase tracking-widest">
                Bem-vindo à sala de {cityName}
              </span>
            </div>

            {messagesList.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  msg.isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-2">
                  {!msg.isMe && <span className="text-[10px] font-black text-secondary uppercase tracking-tight">{msg.sender}</span>}
                  <span className="text-[9px] text-slate-300">{msg.time}</span>
                  {msg.isPrivate && <Lock size={10} className="text-primary" />}
                </div>
                <div className={cn(
                  "p-4 rounded-[1.5rem] shadow-sm border",
                  msg.isMe 
                    ? "bg-primary text-white border-transparent rounded-tr-none" 
                    : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                )}>
                  {msg.type === 'text' ? (
                    <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        {msg.type === 'image' ? <ImageIcon size={20} /> : <VideoIcon size={20} />}
                      </div>
                      <p className="text-sm font-bold italic">{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto space-y-3">
            {isPrivate && (
              <div className="flex items-center justify-between bg-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl animate-in slide-in-from-bottom-2">
                <span className="flex items-center gap-2"><Lock size={12}/> Privado para: {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="hover:opacity-70 underline">Cancelar</button>
              </div>
            )}
            <div className="relative flex items-center gap-3 bg-slate-100 rounded-[2rem] p-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all border border-transparent focus-within:border-primary/20">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 rounded-full hover:text-primary hover:bg-white shrink-0"
                onClick={() => setIsMediaDialogOpen(true)}
              >
                <CameraIcon size={20} />
              </Button>
              <Input 
                placeholder={isPrivate ? "Sussurrar no privado..." : "Diga algo para todos na sala..."}
                className="border-none bg-transparent focus-visible:ring-0 text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="text-slate-400 rounded-full hover:text-primary hover:bg-white">
                  <Smile size={20} />
                </Button>
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim()}
                  className="bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] w-12 h-12 p-0 shadow-lg shadow-primary/20 disabled:opacity-30 transition-all active:scale-90"
                >
                  <SendHorizontal size={22} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Seletor de Mídia e Chamada */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden font-sans">
          <DialogHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-2">
              <CameraIcon className="text-primary" size={32} />
            </div>
            <DialogTitle className="text-xl font-black text-slate-800">Câmera e Mídia</DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-medium">
              O que você deseja fazer agora?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-3 mt-6">
            <Button 
              onClick={() => photoInputRef.current?.click()}
              className="h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs gap-3 transition-all active:scale-95"
            >
              <CameraIcon size={18} /> Tirar Foto
            </Button>
            <Button 
              onClick={() => videoInputRef.current?.click()}
              variant="outline"
              className="h-14 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-black text-xs gap-3 transition-all active:scale-95"
            >
              <VideoIcon size={18} /> Gravar Vídeo
            </Button>
            <Button 
              onClick={() => galleryInputRef.current?.click()}
              variant="outline"
              className="h-14 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-black text-xs gap-3 transition-all active:scale-95"
            >
              <ImageIcon size={18} /> Galeria de Fotos
            </Button>
            <div className="h-px bg-slate-100 my-2" />
            <Button 
              onClick={() => { setIsMediaDialogOpen(false); startVideoCall(); }}
              className="h-14 bg-secondary hover:opacity-90 text-secondary-foreground rounded-2xl font-black text-xs gap-3 transition-all active:scale-95"
            >
              <VideoIcon size={18} /> Chamada de Vídeo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Simulação de Chamada */}
      <Dialog open={isCalling} onOpenChange={setIsCalling}>
        <DialogContent className="max-w-md h-[80vh] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden font-sans bg-slate-900">
          <div className="relative h-full w-full flex flex-col items-center justify-center text-center p-8">
            <div className="absolute top-8 right-8 w-32 h-44 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
              <div className="h-full w-full flex items-center justify-center bg-slate-700">
                <Users size={32} className="text-white/20" />
              </div>
            </div>
            
            <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl mb-6">
              <AvatarFallback className="bg-slate-800 text-white text-4xl font-black">?</AvatarFallback>
            </Avatar>
            
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Chamada de Vídeo</h3>
            <p className="text-primary font-bold animate-pulse">Conectando ao servidor...</p>
            
            <div className="absolute bottom-12 flex items-center gap-6">
              <Button size="icon" className="h-16 w-16 rounded-full bg-slate-800 text-white hover:bg-slate-700">
                <Mic size={24} />
              </Button>
              <Button onClick={() => setIsCalling(false)} size="icon" className="h-20 w-20 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20">
                <X size={32} />
              </Button>
              <Button size="icon" className="h-16 w-16 rounded-full bg-slate-800 text-white hover:bg-slate-700">
                <VideoIcon size={24} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Room;