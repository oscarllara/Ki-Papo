"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ cpf: '', birthDate: '' });

  const handleVerify = () => {
    const birth = new Date(formData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age < 18) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Você precisa ter mais de 18 anos para acessar o Ki papo.",
      });
      return;
    }

    if (formData.cpf.length < 11) {
      toast({
        variant: "destructive",
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido.",
      });
      return;
    }

    // Simulando persistência de dados para o administrador
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    const newUser = {
      id: Date.now(),
      cpf: formData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4"), // Mascarando para segurança
      birth: formData.birthDate,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Verificado'
    };
    
    localStorage.setItem('kipapo_users', JSON.stringify([newUser, ...savedUsers]));

    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-2 bg-white pt-10">
          <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">Segurança</CardTitle>
          <p className="text-sm text-slate-500 font-medium px-8 mt-2">
            Validamos sua idade para manter um ambiente seguro para todos.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-10 bg-white">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="font-bold text-slate-700 ml-1">CPF</Label>
            <Input 
              id="cpf" 
              placeholder="000.000.000-00" 
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth" className="font-bold text-slate-700 ml-1">Data de Nascimento</Label>
            <Input 
              id="birth" 
              type="date" 
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 text-lg"
            />
          </div>
          
          <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[1.5rem] flex gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Apenas maiores de 18 anos. Seus dados são protegidos e usados apenas para verificação obrigatória.
            </p>
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            Validar e Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;