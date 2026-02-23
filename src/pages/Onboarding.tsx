"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, AlertCircle, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { fetchStates, fetchCitiesByState, IBGEState, IBGECity } from '@/services/ibge';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [namePlaceholder, setNamePlaceholder] = useState('Seu nome completo');
  const [socialPrefix, setSocialPrefix] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [formData, setFormData] = useState({ 
    name: '',
    whatsapp: '+55 ',
    cpf: '', 
    birthDate: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    const loadStates = async () => {
      const data = await fetchStates();
      setStates(data);
    };
    loadStates();

    const tempName = sessionStorage.getItem('temp_name');
    const tempBaseUrl = sessionStorage.getItem('temp_base_url');
    if (tempBaseUrl) setSocialPrefix(tempBaseUrl);
    if (tempName) {
      if (tempName.startsWith('Usuário')) setNamePlaceholder(tempName);
      else setFormData(prev => ({ ...prev, name: tempName }));
    }
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!formData.state) return;
      setLoadingCities(true);
      const data = await fetchCitiesByState(formData.state);
      setCities(data);
      setLoadingCities(false);
    };
    loadCities();
  }, [formData.state]);

  const maskCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleVerify = () => {
    if (!formData.name || !formData.whatsapp || !formData.cpf || !formData.birthDate || !formData.state || !formData.city) {
      toast({ variant: "destructive", title: "Campos incompletos", description: "Por favor, preencha todos os campos." });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      whatsapp: formData.whatsapp,
      socialMedia: sessionStorage.getItem('temp_provider') || 'E-mail',
      socialLink: socialPrefix + socialHandle,
      cpf: formData.cpf,
      birth: formData.birthDate,
      state: formData.state,
      city: formData.city,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Verificado'
    };
    
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
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
        </CardHeader>
        <CardContent className="space-y-5 p-10 pt-4 bg-white">
          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 text-xs uppercase">Nome Completo</Label>
            <Input placeholder={namePlaceholder} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700 text-xs uppercase">Estado (UF)</Label>
              <Select onValueChange={(val) => setFormData({...formData, state: val, city: ''})}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => <SelectItem key={s.sigla} value={s.sigla}>{s.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold text-slate-700 text-xs uppercase">Cidade</Label>
              <Select onValueChange={(val) => setFormData({...formData, city: val})} disabled={!formData.state || loadingCities}>
                <SelectTrigger className="h-12 rounded-xl">
                  {loadingCities ? <Loader2 className="animate-spin w-4 h-4" /> : <SelectValue placeholder="Cidade" />}
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 text-xs uppercase">CPF</Label>
            <Input placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: maskCPF(e.target.value)})} className="h-12 rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-slate-700 text-xs uppercase">WhatsApp</Label>
            <Input placeholder="+55 (00) 00000-0000" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="h-12 rounded-xl" />
          </div>

          <Button onClick={handleVerify} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl">
            Validar e Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;