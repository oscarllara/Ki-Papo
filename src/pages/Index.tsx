"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Facebook, Instagram, Chrome, Apple, ShieldCheck, Loader2, Mail, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSocialLogin = (provider: string) => {
    setIsAuthenticating(provider);
    
    setTimeout(() => {
      const mockNames: Record<string, string> = {
        'Google': 'Usuário do Google',
        'Facebook': 'Usuário do Facebook',
        'Instagram': 'Usuário do Instagram',
        'Apple': 'Usuário Apple'
      };

      const mockBases: Record<string, string> = {
        'Google': 'https://youtube.com/@',
        'Facebook': 'https://facebook.com/',
        'Instagram': 'https://instagram.com/',
        'Apple': 'https://'
      };

      sessionStorage.setItem('temp_provider', provider);
      sessionStorage.setItem('temp_name', mockNames[provider] || '');
      sessionStorage.setItem('temp_base_url', mockBases[provider] || '');
      
      setIsAuthenticating(null);
      navigate('/onboarding');
    }, 1200);
  };

  const handleEmailLogin = () => {
    if (!email.includes('@')) return;
    
    sessionStorage.setItem('temp_provider', 'E-mail');
    sessionStorage.setItem('temp_name', email.split('@')[0]);
    sessionStorage.setItem('temp_base_url', 'https://instagram.com/');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorativo */}
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

      <div className="w-full max-w-md space-y-10 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-6">
          <div className="inline-flex flex-col items-center justify-center">
            <div className="bg-primary w-24 h-24 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl shadow-primary/30 transform hover:rotate-6 transition-transform duration-500">
              <span className="text-white text-5xl font-black tracking-tighter">Ki</span>
              <div className="absolute -top-2 -right-2 bg-secondary w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                <MessageSquare size={18} className="text-primary fill-current" />
              </div>
            </div>
            <h1 className="text-secondary text-7xl font-black tracking-tighter mt-4 drop-shadow-sm">Papo</h1>
          </div>
          <div className="space-y-2">
            <p className="text-slate-800 font-black text-2xl tracking-tight">Onde sua cidade se encontra.</p>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Conecte-se com quem está perto</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] rounded-[3.5rem] overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/20">
          <CardContent className="space-y-3 p-10 pt-12">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleSocialLogin('Google')} 
                variant="outline" 
                className="h-16 rounded-2xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Chrome size={20} className="text-[#EA4335]" /> Google
              </Button>
              <Button 
                onClick={() => handleSocialLogin('Facebook')} 
                variant="outline" 
                className="h-16 rounded-2xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Facebook size={20} className="text-[#1877F2] fill-[#1877F2]" /> Facebook
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleSocialLogin('Instagram')} 
                variant="outline" 
                className="h-16 rounded-2xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Instagram size={20} className="text-[#E4405F]" /> Instagram
              </Button>
              <Button 
                onClick={() => handleSocialLogin('Apple')} 
                variant="outline" 
                className="h-16 rounded-2xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Apple size={20} className="text-slate-900" /> Apple
              </Button>
            </div>
            
            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="bg-white px-6 text-slate-300">Ou use seu e-mail</span></div>
            </div>

            <div className="space-y-4">
              <Input 
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 rounded-2xl border-slate-100 text-center font-bold text-lg focus-visible:ring-primary/20 bg-slate-50/50"
              />
              <Button 
                onClick={handleEmailLogin}
                disabled={!email.includes('@')}
                className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 gap-3"
              >
                <Sparkles size={24} /> COMEÇAR AGORA
              </Button>
            </div>
            
            <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] mt-8 leading-relaxed">
              Ao entrar você aceita nossos <br/> termos e políticas
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <button 
            onClick={() => navigate('/admin-login')}
            className="text-slate-400 hover:text-primary transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] group"
          >
            <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" /> Acesso Administrativo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;