"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft, Mail, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const DEFAULT_USER = 'oscarlarafg@hotmail.com';
  const DEFAULT_PASS = 'fabi2411';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lista de admins cadastrados via dashboard
    const admins = JSON.parse(localStorage.getItem('kipapo_admins') || '[]');

    // Verifica se é o admin fornecido ou um dos cadastrados
    const isValidAdmin = (username === DEFAULT_USER && password === DEFAULT_PASS) || 
                       admins.some((a: any) => a.username === username && a.password === password);

    if (isValidAdmin) {
      sessionStorage.setItem('admin_auth', 'true');
      toast({ title: "Acesso Autorizado", description: "Bem-vindo ao painel de controle." });
      navigate('/dashboard');
    } else {
      toast({ variant: "destructive", title: "Acesso Negado", description: "Usuário ou senha inválidos." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            {showRecovery ? <Mail size={32} /> : <Lock size={32} />}
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">Gestão Ki papo</CardTitle>
          <p className="text-indigo-100 text-sm mt-2 opacity-80">Área Administrativa</p>
        </div>

        <CardContent className="p-8 space-y-6 bg-white">
          {!showRecovery ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    placeholder="E-mail ou Usuário" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 pl-12 font-bold"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    type="password"
                    placeholder="Senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 pl-12 font-bold"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95">
                Acessar Painel
              </Button>
              <button type="button" onClick={() => setShowRecovery(true)} className="w-full text-xs font-bold text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                Esqueceu a senha?
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Recuperação enviada" }); setShowRecovery(false); }} className="space-y-4">
              <Input placeholder="E-mail cadastrado" className="h-14 rounded-2xl" />
              <Button type="submit" className="w-full h-14 bg-indigo-600 rounded-2xl font-bold">Enviar Link</Button>
              <button type="button" onClick={() => setShowRecovery(false)} className="w-full text-xs font-bold text-slate-300 uppercase">Voltar</button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-50">
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full text-slate-400 gap-2 rounded-xl"><ArrowLeft size={16} /> Voltar ao Início</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;