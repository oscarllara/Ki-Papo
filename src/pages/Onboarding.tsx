"use client";

import React, { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState({ 
    name: '',
    whatsapp: '+55 ',
    cpf: '', 
    birthDate: '' 
  });

  useEffect(() => {
    const tempName = sessionStorage.getItem('temp_name');
    if (tempName) {
      setFormData(prev => ({ ...prev, name: tempName }));
      sessionStorage.removeItem('temp_name');
      
      toast({
        title: "Dados Recuperados",
        description: `Olá ${tempName.split(' ')[0]}! Complete seus dados para continuar.`,
      });
    }
  }, []);

  const handleVerify = () => {
    if (!formData.name || !formData.whatsapp || formData.whatsapp === '+55 ' || !formData.cpf || !formData.birthDate) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

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

    const provider = sessionStorage.getItem('temp_provider') || 'E-mail';
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    
    // Agora salvamos o CPF completo para o administrador
    const newUser = {
      id: Date.now(),
      name: formData.name,
      whatsapp: formData.whatsapp,
      socialMedia: provider,
      cpf: formData.cpf, // Removida a máscara no salvamento
      birth: formData.birthDate,
      date: new Date().toLocaleDateString('pt-BR'),
      lastAccess: new Date().toLocaleString('pt-BR'),
      status: 'Verificado'
    };
    
    localStorage.setItem('kipapo_users', JSON.stringify([newUser, ...savedUsers]));
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden my-8">
        <CardHeader className="text-center pb-2 bg-white pt-10">
          <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">Identificação</CardTitle>
          <p className="text-sm text-slate-500 font-medium px-8 mt-2">
            Mantenha seu perfil seguro e verificado.
          </p>
        </CardHeader>
        <CardContent className="space-y-5 p-10 pt-4 bg-white">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">Nome Completo</Label>
            <Input 
              placeholder="Seu nome" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">WhatsApp</Label>
            <Input 
              placeholder="+55 (00) 00000-0000" 
              value={formData.whatsapp}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith('+55 ')) val = '+55 ' + val.replace(/^\+55\s*/, '');
                setFormData({...formData, whatsapp: val});
              }}
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">CPF</Label>
              <Input 
                placeholder="000.000.000-00" 
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700 ml-1 text-xs uppercase tracking-wider">Nascimento</Label>
              <Input 
                type="date" 
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex gap-3 mt-4">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-[10px] text-amber-900 leading-relaxed font-bold uppercase tracking-tight">
              Apenas maiores de 18 anos. Seus dados são protegidos por criptografia de ponta.
            </p>
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            Validar e Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;