"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Facebook, Instagram, Chrome, Apple, ShieldCheck, Loader2, Mail } from 'lucide-react';

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
        'Google': 'https://google.com/',
        'Facebook': 'https://facebook.com/',
        'Instagram': 'https://instagram.com/',
        'Apple': 'https://apple.com/'
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
    sessionStorage.setItem('temp_base_url', '');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#a3cc16]" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#a3cc16]" />
      
      {isAuthenticating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xs rounded-[2rem] border-none shadow-2xl p-8 text-center animate-in zoom-in duration-300">
            <Loader2 className="mx-auto text-primary animate-spin mb-4" size={32} />
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Entrando com {isAuthenticating}...</h3>
          </Card>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <div className="bg-[#2377bb] w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-lg">
              <span className="text-white text-4xl font-black tracking-tighter">Ki</span>
              <div className="absolute top-2 right-2 bg-[#a3cc16] w-6 h-6 rounded-full flex items-center justify-center">
                <MessageSquare size={12} className="text-[#2377bb] fill-current" />
              </div>
            </div>
            <span className="text-[#a3cc16] text-6xl font-black tracking-tighter ml-2">Papo</span>
          </div>
          <p className="text-slate-500 font-bold text-lg">O ponto de encontro do seu município.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-100">
          <CardContent className="space-y-3 p-10 pt-10">
            <Button 
              onClick={() => handleSocialLogin('Google')} 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-4 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Chrome size={20} className="text-red-500" /> Entrar com Google
            </Button>
            <Button 
              onClick={() => handleSocialLogin('Facebook')} 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-4 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Facebook size={20} className="text-blue-600 fill-blue-600" /> Entrar com Facebook
            </Button>
            <Button 
              onClick={() => handleSocialLogin('Instagram')} 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-4 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Instagram size={20} className="text-pink-600" /> Entrar com Instagram
            </Button>
            <Button 
              onClick={() => handleSocialLogin('Apple')} 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-4 font-bold text-slate-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Apple size={20} className="text-slate-900" /> Entrar com Apple
            </Button>
            
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">Acesso via E-mail</span></div>
            </div>

            <div className="space-y-4">
              <Input 
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 text-center focus-visible:ring-primary/30"
              />
              <Button 
                onClick={handleEmailLogin}
                disabled={!email.includes('@')}
                className="w-full h-16 rounded-[1.5rem] bg-[#2377bb] hover:bg-[#1c629d] text-white font-black text-xl shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95 gap-3"
              >
                <Mail size={24} /> Começar Agora
              </Button>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
              Ao entrar você concorda com nossos termos
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/admin-login')}
            className="text-slate-300 hover:text-primary transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <ShieldCheck size={14} /> Acesso Administrativo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;