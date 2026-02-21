"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Facebook, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] overflow-hidden z-10">
        <CardHeader className="text-center pt-12 pb-8 bg-white">
          <div className="mx-auto bg-indigo-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 rotate-6 hover:rotate-0 transition-transform duration-500 shadow-inner">
            <MessageCircle size={48} className="text-indigo-600" />
          </div>
          <CardTitle className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Ki papo</CardTitle>
          <CardDescription className="text-slate-500 font-bold text-base">Sua rede social por município e interesse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-10 bg-white">
          <Button 
            onClick={() => navigate('/onboarding')} 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-3 font-bold text-slate-700 text-lg transition-all active:scale-95"
          >
            <Mail size={20} /> Entrar com E-mail
          </Button>
          <Button 
            onClick={() => navigate('/onboarding')} 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 gap-3 font-bold text-slate-700 text-lg transition-all active:scale-95"
          >
            <Facebook size={20} className="text-blue-600 fill-blue-600" /> Entrar com Facebook
          </Button>
          
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase font-black"><span className="bg-white px-4 text-slate-300 tracking-widest">Ou rápido</span></div>
          </div>
          
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            Entrar com Telefone
          </Button>
          
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-[11px] text-slate-400 font-medium px-4 leading-relaxed">
              Ao entrar, você concorda que é maior de 18 anos e aceita nossos 
              <span className="text-indigo-500 cursor-pointer hover:underline ml-1">Termos de Uso</span>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Admin Discreto */}
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