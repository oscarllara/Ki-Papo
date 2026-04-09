"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Nickname = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const tempName = sessionStorage.getItem('temp_name');
    if (tempName && !tempName.startsWith('Usuário')) {
      setNickname(tempName.split(' ')[0]);
    }
  }, []);

  const handleContinue = () => {
    if (nickname.trim().length < 3) {
      toast({ 
        variant: "destructive", 
        title: "Apelido muito curto", 
        description: "Escolha um apelido com pelo menos 3 caracteres." 
      });
      return;
    }
    
    sessionStorage.setItem('kipapo_nickname', nickname);
    
    // Pega a cidade e o interesse para entrar direto na sala
    const city = sessionStorage.getItem('kipapo_home_city') || 'Geral';
    const interest = sessionStorage.getItem('selected_interest') || 'amizade';
    const roomPrefix = city.toLowerCase().replace(/\s+/g, '-');
    
    toast({ title: "Entrando na sala...", description: `Bem-vindo ao Ki Papo de ${city}!` });
    navigate(`/room/${roomPrefix}-${interest}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-md rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white/90 backdrop-blur-2xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pt-12 pb-4">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner text-primary">
            <User size={40} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">Como quer ser chamado?</CardTitle>
          <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">Escolha seu apelido para as salas</p>
        </CardHeader>
        <CardContent className="p-10 pt-4 space-y-6">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <Input 
              placeholder="Digite seu apelido..." 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-16 rounded-2xl border-slate-100 pl-14 font-black text-lg focus-visible:ring-primary/20 bg-slate-50/50"
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            />
          </div>

          <Button 
            onClick={handleContinue}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 gap-2"
          >
            ENTRAR NA SALA AGORA <ArrowRight size={20} />
          </Button>
          
          <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Você poderá validar sua identidade depois para ganhar o selo de verificado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Nickname;