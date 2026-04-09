"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Facebook, 
  Chrome, 
  ShieldCheck, 
  Loader2, 
  Settings, 
  Sparkles,
  Globe,
  Users,
  Heart,
  Cross,
  Music,
  Flame,
  Plus,
  Minus,
  Instagram,
  Apple
} from 'lucide-react';
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('amizade');
  const [isExpanded, setIsExpanded] = useState(false);

  const mainInterests = [
    { id: 'network', name: 'Network', icon: <Globe size={20} />, color: 'text-primary' },
    { id: 'evangelico', name: 'Evangélico', icon: <Cross size={20} />, color: 'text-secondary' },
    { id: 'amizade', name: 'Amizade', icon: <Users size={20} />, color: 'text-indigo-500' },
  ];

  const extraInterests = [
    { id: 'role', name: 'Rolê', icon: <Music size={20} />, color: 'text-amber-500' },
    { id: 'namoro', name: 'Namoro', icon: <Heart size={20} />, color: 'text-rose-500' },
    { id: 'sexo', name: 'Sexo', icon: <Flame size={20} />, color: 'text-pink-500' },
  ];

  const handleSocialLogin = (provider: string) => {
    setIsAuthenticating(provider);
    
    setTimeout(() => {
      const mockNames: Record<string, string> = {
        'Google': 'Usuário do Google',
        'Facebook': 'Usuário do Facebook',
        'Instagram': 'Usuário do Instagram',
        'Apple': 'Usuário Apple'
      };

      const baseUrls: Record<string, string> = {
        'Instagram': 'https://instagram.com/',
        'Facebook': 'https://facebook.com/',
        'Google': '',
        'Apple': ''
      };

      sessionStorage.setItem('temp_provider', provider);
      sessionStorage.setItem('temp_name', mockNames[provider] || '');
      sessionStorage.setItem('temp_base_url', baseUrls[provider] || '');
      sessionStorage.setItem('selected_interest', selectedInterest);
      
      setIsAuthenticating(null);
      navigate('/onboarding');
    }, 1200);
  };

  const handleEmailLogin = () => {
    if (!email.includes('@')) return;
    
    sessionStorage.setItem('temp_provider', 'E-mail');
    sessionStorage.setItem('temp_name', email.split('@')[0]);
    sessionStorage.setItem('temp_base_url', '');
    sessionStorage.setItem('selected_interest', selectedInterest);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      
      {isAuthenticating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xs rounded-[3rem] border-none shadow-2xl p-10 text-center animate-in zoom-in duration-300 bg-white">
            <Loader2 className="mx-auto text-primary animate-spin mb-6" size={40} />
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Entrando com {isAuthenticating}...</h3>
            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Aguarde um instante</p>
          </Card>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex flex-col items-center justify-center">
            <div className="bg-primary w-20 h-20 rounded-[2rem] flex items-center justify-center relative shadow-2xl shadow-primary/30 transform hover:rotate-6 transition-transform duration-500">
              <span className="text-white text-4xl font-black tracking-tighter">Ki</span>
              <div className="absolute -top-1 -right-1 bg-secondary w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <MessageSquare size={14} className="text-primary fill-current" />
              </div>
            </div>
            <h1 className="text-secondary text-6xl font-black tracking-tighter mt-2 drop-shadow-sm">Papo</h1>
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 font-black text-xl tracking-tight">Onde sua cidade se encontra.</p>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Conecte-se com quem está perto</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] rounded-[3rem] overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/20">
          <CardContent className="space-y-6 p-8 pt-10">
            
            <div 
              className="space-y-4"
              onMouseLeave={() => setIsExpanded(false)}
            >
              <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">O que você procura hoje?</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {mainInterests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => setSelectedInterest(interest.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2",
                      selectedInterest === interest.id 
                        ? "bg-white border-primary shadow-lg scale-105 z-10" 
                        : "bg-slate-50 border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className={cn("mb-2", interest.color)}>{interest.icon}</div>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{interest.name}</span>
                  </button>
                ))}
              </div>

              {isExpanded && (
                <div className="grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-300">
                  {extraInterests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => setSelectedInterest(interest.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2",
                        selectedInterest === interest.id 
                          ? "bg-white border-primary shadow-lg scale-105 z-10" 
                          : "bg-slate-50 border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className={cn("mb-2", interest.color)}>{interest.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{interest.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-full w-8 h-8 p-0 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5"
                >
                  {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                </Button>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-white px-4 text-slate-300">Entrar com</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleSocialLogin('Google')} 
                variant="outline" 
                className="h-14 rounded-xl border-slate-100 hover:bg-slate-50 gap-2 font-bold text-slate-700 text-xs shadow-sm"
              >
                <Chrome size={16} className="text-[#EA4335]" /> Google
              </Button>
              <Button 
                onClick={() => handleSocialLogin('Facebook')} 
                variant="outline" 
                className="h-14 rounded-xl border-slate-100 hover:bg-slate-50 gap-2 font-bold text-slate-700 text-xs shadow-sm"
              >
                <Facebook size={16} className="text-[#1877F2] fill-[#1877F2]" /> Facebook
              </Button>
              <Button 
                onClick={() => handleSocialLogin('Instagram')} 
                variant="outline" 
                className="h-14 rounded-xl border-slate-100 hover:bg-slate-50 gap-2 font-bold text-slate-700 text-xs shadow-sm"
              >
                <Instagram size={16} className="text-[#E4405F]" /> Instagram
              </Button>
              <Button 
                onClick={() => handleSocialLogin('Apple')} 
                variant="outline" 
                className="h-14 rounded-xl border-slate-100 hover:bg-slate-50 gap-2 font-bold text-slate-700 text-xs shadow-sm"
              >
                <Apple size={16} className="text-slate-900 fill-slate-900" /> Apple
              </Button>
            </div>
            
            <div className="space-y-3">
              <Input 
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-xl border-slate-100 text-center font-bold text-sm focus-visible:ring-primary/20 bg-slate-50/50"
              />
              <Button 
                onClick={handleEmailLogin}
                disabled={!email.includes('@')}
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 gap-2"
              >
                <Sparkles size={20} /> COMEÇAR AGORA
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
          <button 
            onClick={() => navigate('/admin-login')}
            className="text-slate-400 hover:text-primary transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group"
          >
            <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" /> Acesso Administrativo
          </button>
          <button 
            onClick={() => navigate('/admin-login')}
            className="text-slate-400 hover:text-primary transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" /> Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;