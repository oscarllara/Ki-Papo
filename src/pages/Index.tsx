"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, Facebook } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6 bg-white">
          <div className="mx-auto bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <MessageCircle size={40} className="text-indigo-600" />
          </div>
          <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter">Ki papo</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Onde a conversa acontece por região e interesse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-8 bg-white">
          <Button 
            onClick={() => navigate('/onboarding')} 
            variant="outline" 
            className="w-full h-12 rounded-2xl border-slate-200 hover:bg-slate-50 gap-3 font-semibold text-slate-700"
          >
            <Mail size={18} /> Entrar com E-mail
          </Button>
          <Button 
            onClick={() => navigate('/onboarding')} 
            variant="outline" 
            className="w-full h-12 rounded-2xl border-slate-200 hover:bg-slate-50 gap-3 font-semibold text-slate-700"
          >
            <Facebook size={18} className="text-blue-600 fill-blue-600" /> Entrar com Facebook
          </Button>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/onboarding')} 
              variant="outline" 
              className="flex-1 h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Google
            </Button>
            <Button 
              onClick={() => navigate('/onboarding')} 
              variant="outline" 
              className="flex-1 h-12 rounded-2xl border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Apple
            </Button>
          </div>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Ou</span></div>
          </div>
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200"
          >
            Entrar com Telefone
          </Button>
          <p className="text-[10px] text-center text-slate-400 px-4 mt-6">
            Ao entrar, você concorda que é maior de 18 anos e aceita nossos Termos de Uso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;