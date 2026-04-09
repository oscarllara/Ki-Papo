"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShieldCheck, 
  Loader2, 
  Calendar,
  UserPlus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { fetchStates, IBGEState } from '@/services/ibge';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [namePlaceholder, setNamePlaceholder] = useState('Seu nome completo');
  const [states, setStates] = useState<IBGEState[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [provider, setProvider] = useState<string>('E-mail');
  const [baseUrl, setBaseUrl] = useState<string>('https://instagram.com/');

  const [formData, setFormData] = useState({ 
    name: '',
    whatsapp: '+55 ',
    cpf: '', 
    birthDate: '',
    state: '',
    city: '',
    socialLink: '',
    indicatedBy: ''
  });

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchStates();
        setStates(data);
      } catch (error) {
        console.error("Erro ao carregar estados", error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();

    const tempName = sessionStorage.getItem('temp_name');
    const tempProvider = sessionStorage.getItem('temp_provider') || 'E-mail';
    const tempBaseUrl = sessionStorage.getItem('temp_base_url') || 'https://instagram.com/';
    
    setProvider(tempProvider);
    setBaseUrl(tempBaseUrl);
    setFormData(prev => ({ ...prev, socialLink: tempBaseUrl }));

    if (tempName) {
      if (tempName.startsWith('Usuário')) setNamePlaceholder(tempName);
      else setFormData(prev => ({ ...prev, name: formatName(tempName) }));
    }
  }, []);

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
    return true;
  };

  const validateAge = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return false;
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const maskCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  
  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d+?)$/, "$1");
  };

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length >= 2 && v.startsWith("55")) v = v.slice(2);
    if (v.length === 0) return "+55 ";
    if (v.length <= 2) return `+55 (${v}`;
    if (v.length <= 7) return `+55 (${v.slice(0, 2)}) ${v.slice(2)}`;
    return `+55 (${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  };

  const formatName = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());
  const formatCityName = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleVerify = () => {
    if (!formData.name || formData.whatsapp.length < 18 || !formData.cpf || !formData.state || !formData.city || !formData.birthDate) {
      toast({ variant: "destructive", title: "Dados incompletos", description: "Por favor, preencha todos os campos obrigatórios." });
      return;
    }
    if (!validateCPF(formData.cpf)) {
      toast({ variant: "destructive", title: "CPF Inválido", description: "O número de CPF informado não é válido." });
      return;
    }
    if (!validateAge(formData.birthDate)) {
      toast({ variant: "destructive", title: "Acesso Restrito", description: "Você precisa ter mais de 18 anos para acessar." });
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    
    const lastId = savedUsers.length > 0 
      ? Math.max(...savedUsers.map((u: any) => u.id || 999)) 
      : 999;
    const nextId = lastId + 1;

    const newUser = {
      id: nextId,
      name: formData.name,
      whatsapp: formData.whatsapp,
      socialMedia: provider,
      socialLink: formData.socialLink,
      cpf: formData.cpf,
      birthDate: formData.birthDate,
      state: formData.state,
      city: formData.city,
      indicatedBy: formData.indicatedBy,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Verificado'
    };
    
    localStorage.setItem('kipapo_users', JSON.stringify([newUser, ...savedUsers]));
    
    sessionStorage.setItem('kipapo_home_city', formData.city);
    sessionStorage.setItem('kipapo_home_state', formData.state);
    
    toast({ title: "Cadastro Concluído", description: `Seu ID é ${nextId}. Identidade validada.` });
    navigate('/lobby');
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.startsWith(baseUrl)) {
      setFormData(prev => ({ ...prev, socialLink: baseUrl }));
    } else {
      setFormData(prev => ({ ...prev, socialLink: val }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pb-2 bg-white pt-10">
          <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 tracking-tight">Identificação</CardTitle>
          <p className="text-slate-400 text-sm font-bold mt-2">Valide seus dados para acessar as salas</p>
        </CardHeader>
        <CardContent className="space-y-5 p-10 pt-4 bg-white">
          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Nome Completo</Label>
            <Input 
              placeholder={namePlaceholder} 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: formatName(e.target.value)})} 
              className="h-14 rounded-2xl border-slate-200 font-bold" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Data de Nascimento</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <Input placeholder="DD/MM/AAAA" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: maskDate(e.target.value)})} className="h-14 rounded-2xl border-slate-200 pl-12 font-bold" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Estado (UF)</Label>
              <Select onValueChange={(val) => setFormData({...formData, state: val})}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {loadingStates ? (
                    <div className="p-2 flex items-center justify-center"><Loader2 className="animate-spin h-4 w-4" /></div>
                  ) : (
                    states.map(s => <SelectItem key={s.sigla} value={s.sigla} className="rounded-xl">{s.nome}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Cidade</Label>
            <Input placeholder="Sua cidade" value={formData.city} onChange={(e) => setFormData({...formData, city: formatCityName(e.target.value)})} className="h-14 rounded-2xl border-slate-200 font-bold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">CPF</Label>
              <Input placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: maskCPF(e.target.value)})} className="h-14 rounded-2xl border-slate-200 font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">WhatsApp</Label>
              <Input placeholder="+55 (00) 00000-0000" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} className="h-14 rounded-2xl border-slate-200 font-bold" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Perfil Social / E-mail</Label>
            <Input value={formData.socialLink} onChange={handleSocialLinkChange} className="h-14 rounded-2xl border-slate-200 font-bold" />
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Indicado por (Opcional)</Label>
            <div className="relative">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <Input 
                placeholder="ID ou Nome do indicador" 
                value={formData.indicatedBy} 
                onChange={(e) => setFormData({...formData, indicatedBy: e.target.value})} 
                className="h-14 rounded-2xl border-slate-200 pl-12 font-bold" 
              />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleVerify} className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
              Validar e Entrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;