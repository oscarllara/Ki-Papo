"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Facebook, Instagram, Chrome, Apple, ShieldCheck, Mail } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = (provider: string) => {
    sessionStorage.setItem('temp_provider', provider);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden z-10">
        <CardHeader className="text-center pt-12 pb-6 bg-white">
          <div className="mx-auto bg-indigo-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 rotate-6 hover:rotate-0 transition-transform duration-500 shadow-inner">
            <MessageCircle size={40} className="text-indigo-600" />
          </div>
          <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Ki papo</CardTitle>
          <CardDescription className="text-slate-500 font-bold text-sm">Conectando você ao seu município</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-10 pt-2 bg-white">
          <Button 
            onClick={() => handleLogin('Google')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
          >
            <Chrome size={18} className="text-red-500" /> Google
          </Button>
          <Button 
            onClick={() => handleLogin('Facebook')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
          >
            <Facebook size={18} className="text-blue-600 fill-blue-600" /> Facebook
          </Button>
          <Button 
            onClick={() => handleLogin('Instagram')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
          >
            <Instagram size={18} className="text-pink-600" /> Instagram
          </Button>
          <Button 
            onClick={() => handleLogin('Apple')} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-slate-100 hover:bg-slate-50 gap-3 font-bold text-slate-700 transition-all active:scale-95"
          >
            <Apple size={18} className="fill-slate-900" /> Apple ID
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-4 text-slate-300 tracking-widest">Ou com contato</span></div>
          </div>
          
          <Button 
            onClick={() => handleLogin('E-mail')} 
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            Acessar agora
          </Button>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
              Ao entrar, você concorda que é maior de 18 anos e aceita nossos 
              <span className="text-indigo-500 cursor-pointer hover:underline ml-1">Termos de Uso</span>.
            </p>
          </div>
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