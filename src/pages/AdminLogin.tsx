"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Senha padrão inicial se não houver uma definida no sistema
  const INITIAL_PASSWORD = 'fabi2411';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('admin_password') || INITIAL_PASSWORD;

    if (password === storedPassword) {
      sessionStorage.setItem('admin_auth', 'true');
      toast({
        title: "Acesso Autorizado",
        description: "Bem-vindo de volta, gestor.",
      });
      navigate('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Senha Incorreta",
        description: "A senha administrativa informada é inválida.",
      });
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.includes('@')) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
      });
      return;
    }

    // Simulação de envio de e-mail
    toast({
      title: "Recuperação Iniciada",
      description: `Um link de acesso seguro foi enviado para ${recoveryEmail} (Simulado).`,
    });
    
    // Mostra a senha atual apenas para fins de teste neste ambiente de protótipo
    setTimeout(() => {
      const currentPwd = localStorage.getItem('admin_password') || INITIAL_PASSWORD;
      alert(`[SIMULAÇÃO E-MAIL]: Use a senha atual para entrar: ${currentPwd}`);
      setShowRecovery(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            {showRecovery ? <Mail size={32} /> : <Lock size={32} />}
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            {showRecovery ? "Recuperar Acesso" : "Gestão Ki papo"}
          </CardTitle>
          <p className="text-indigo-100 text-sm mt-2 opacity-80">
            {showRecovery ? "Enviaremos um código para seu e-mail" : "Área exclusiva para administradores"}
          </p>
        </div>

        <CardContent className="p-8 space-y-6 bg-white">
          {!showRecovery ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password"
                  placeholder="Senha de acesso" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-600 text-center text-lg font-bold"
                  autoFocus
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                Entrar no Painel
              </Button>
              <button 
                type="button"
                onClick={() => setShowRecovery(true)}
                className="w-full text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Esqueceu a senha?
              </button>
            </form>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email"
                  placeholder="Seu e-mail cadastrado" 
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-600 text-center"
                  autoFocus
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all"
              >
                Enviar Link
              </Button>
              <button 
                type="button"
                onClick={() => setShowRecovery(false)}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
              >
                Voltar ao Login
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-50">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="w-full text-slate-400 hover:text-slate-600 gap-2 rounded-xl"
            >
              <ArrowLeft size={16} /> Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;