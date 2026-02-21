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

    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="text-emerald-600" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Verificação de Segurança</CardTitle>
          <p className="text-sm text-slate-500">Para sua proteção e de outros usuários, valide seus dados.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="font-semibold text-slate-700">CPF</Label>
            <Input 
              id="cpf" 
              placeholder="000.000.000-00" 
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              className="h-12 rounded-xl focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth" className="font-semibold text-slate-700">Data de Nascimento</Label>
            <Input 
              id="birth" 
              type="date" 
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              className="h-12 rounded-xl focus-visible:ring-indigo-500"
            />
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 leading-tight">
              Apenas maiores de 18 anos podem participar. Seus dados são criptografados e não serão exibidos nas salas.
            </p>
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Validar e Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;