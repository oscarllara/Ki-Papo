"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha padrão definida para o gestor
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Senha administrativa incorreta.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock size={32} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">Gestão Ki papo</CardTitle>
          <p className="text-indigo-100 text-sm mt-2 opacity-80">Área exclusiva para administradores</p>
        </div>
        <CardContent className="p-8 space-y-6 bg-white">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password"
                placeholder="Senha de acesso" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-600 text-center text-lg"
                autoFocus
              />
            </div>
            <Button 
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Entrar no Painel
            </Button>
          </form>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="w-full text-slate-400 hover:text-slate-600 gap-2"
          >
            <ArrowLeft size={16} /> Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;