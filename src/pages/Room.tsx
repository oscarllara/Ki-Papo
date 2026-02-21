"use client";

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SendHorizontal, Phone, Video, Camera, ArrowLeft, Users, Lock, Unlock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nickname, setNickname] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [targetUser, setTargetUser] = useState<string | null>(null);

  // Simulação de usuários online
  const onlineUsers = ["Aventureiro_SP", "Gatinha_Legal", "Rex_2024", "Flor_do_Campo", "Navegador"];

  const handleJoin = () => {
    if (!nickname.trim()) return;
    if (onlineUsers.includes(nickname)) {
      toast({
        variant: "destructive",
        title: "Apelido em uso",
        description: "Este apelido já está na sala. Escolha outro!",
      });
      return;
    }
    setHasJoined(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-8 rounded-3xl border-none shadow-xl text-center space-y-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-indigo-600">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quase lá!</h2>
            <p className="text-sm text-slate-500">Escolha um apelido para entrar na sala.</p>
          </div>
          <div className="space-y-4">
            <Input 
              placeholder="Ex: Viajante_01" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 rounded-2xl text-center font-bold text-lg focus-visible:ring-indigo-500"
              autoFocus
            />
            <Button 
              onClick={handleJoin}
              disabled={!nickname.trim()}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Entrar na Sala
            </Button>
          </div>
          <Button variant="ghost" onClick={() => navigate('/lobby')} className="text-slate-400 hover:text-slate-600">
            Voltar para o Lobby
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Usuários */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            Online <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{onlineUsers.length}</span>
          </h3>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {onlineUsers.map(user => (
              <button 
                key={user}
                onClick={() => {
                  setTargetUser(user);
                  setIsPrivate(true);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-slate-50",
                  targetUser === user ? "bg-indigo-50 ring-1 ring-indigo-200" : ""
                )}
              >
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-slate-200 text-slate-500 text-[10px] font-bold">{user[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-slate-700 truncate">{user}</span>
                {targetUser === user && <Lock size={12} className="text-indigo-500 ml-auto" />}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">Clique em um usuário para iniciar conversa privada.</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="font-black text-slate-800 tracking-tight uppercase text-xs">
                Sala: {roomId?.replace('-', ' ')}
              </h2>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <Unlock size={10} /> Canal Público
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600"><Phone size={20} /></Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600"><Video size={20} /></Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 bg-slate-50/30">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold text-slate-400 bg-white px-4 py-1 rounded-full border border-slate-100">
                Hoje
              </span>
            </div>
            {/* Mensagem Pública Simulação */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[10px] font-bold text-indigo-500 ml-1">Aventureiro_SP</span>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-[80%]">
                <p className="text-sm text-slate-700 leading-relaxed">Olá pessoal! Alguém de São Paulo por aqui?</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-3">
            {isPrivate && (
              <div className="flex items-center justify-between bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl animate-in slide-in-from-bottom-2">
                <span className="flex items-center gap-2 uppercase tracking-widest"><Lock size={12}/> Enviando no privado para: {targetUser}</span>
                <button onClick={() => {setIsPrivate(false); setTargetUser(null)}} className="hover:opacity-70 underline uppercase">Cancelar</button>
              </div>
            )}
            <div className="relative flex items-center gap-3 bg-slate-100 rounded-3xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Button variant="ghost" size="icon" className="text-slate-400 rounded-full hover:text-indigo-600">
                <Camera size={20} />
              </Button>
              <Input 
                placeholder={isPrivate ? "Mensagem privada..." : "Sua mensagem pública..."}
                className="border-none bg-transparent focus-visible:ring-0 text-slate-700 font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button 
                disabled={!message.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl w-12 h-12 p-0 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                <SendHorizontal size={22} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;