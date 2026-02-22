"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Facebook, Instagram, Chrome, Apple, ShieldCheck, Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setIsAuthenticating(provider);
    
    // Simulação: Quando o Supabase estiver ativo, aqui chamaremos 'auth.signInWithOAuth'
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

      // Salvamos qual rede e o link base
      sessionStorage.setItem('temp_provider', provider);
      sessionStorage.setItem('temp_name', mockNames[provider] || '');
      sessionStorage.setItem('temp_base_url', mockBases[provider] || '');
      
      setIsAuthenticating(null);
      navigate('/onboarding');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl" />

      {/* Modal de Autenticação Simulado */}
      {isAuthenticating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xs rounded-3xl border-none shadow-2xl p-8 text-center animate-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              {isAuthenticating === 'Google' && <Chrome size={48} className="text-red-500 animate-bounce" />}
              {isAuthenticating === 'Facebook' && <Facebook size={48} className="text-blue-600 animate-bounce" />}
              {isAuthenticating === 'Instagram' && <Instagram size={48} className="text-pink-600 animate-bounce" />}
              {isAuthenticating === 'Apple' && <Apple size={48} className="text-slate-900 animate-bounce" />}
            </div>
            <h3 className="text-lg font-black text-slate-800">Autenticando via {isAuthenticating}</h3>
            <p className="text-sm text-slate-500 mt-2">Conectando aos serviços de rede...</p>
            <Loader2 className="mx-auto mt-6 text-indigo-600 animate-spin" size={24} />
          </Card>
        </div>
      )}

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden z-10">
        <CardHeader className="text-center pt-12 pb-6 bg-white">
          <div className="mx-auto bg-indigo-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 rotate-6 shadow-inner">
            <MessageCircle size={40} className="text-indigo-600" />
          </div>
          <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Ki papo</CardTitle>
          <CardDescription className="text-slate-500 font-bold text-sm">Conectando você ao seu município</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-10 pt-2 bg-white">
          <Button 
            onClick={() => handleSocialLogin('Google')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
            disabled={!!isAuthenticating}
          >
            <Chrome size={18} className="text-red-500" /> Entrar com Google
          </Button>
          <Button 
            onClick={() => handleSocialLogin('Facebook')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
            disabled={!!isAuthenticating}
          >
            <Facebook size={18} className="text-blue-600 fill-blue-600" /> Entrar com Facebook
          </Button>
          <Button 
            onClick={() => handleSocialLogin('Instagram')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
            disabled={!!isAuthenticating}
          >
            <Instagram size={18} className="text-pink-600" /> Entrar com Instagram
          </Button>
          <Button 
            onClick={() => handleSocialLogin('Apple')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
            disabled={!!isAuthenticating}
          >
            <Apple size={18} className="fill-slate-900" /> Entrar com Apple
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-4 text-slate-300 tracking-widest">Ou acesso direto</span></div>
          </div>
          
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            Acessar sem rede
          </Button>
        </CardContent>
      </Card>

      <button 
        onClick={() => navigate('/admin-login')}
        className="mt-8 text-white/40 hover:text-white/80 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
      >
        <ShieldCheck size={14} /> Painel Administrativo
      </button>
    </div>
  );
};

export default Index;