"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/select";
import { 
  ShieldCheck, 
  Loader2, 
  Instagram as InstagramIcon, 
  Facebook as FacebookIcon, 
  Chrome as GoogleIcon, 
  Apple as AppleIcon, 
  Mail as MailIcon 
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
    state: '',
    city: '',
    socialLink: ''
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
      else setFormData(prev => ({ ...prev, name: tempName }));
    }
  }, []);

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) return false;
    
    // Bloqueia CPFs com todos os números iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    let sum = 0;
    let remainder;
    
    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
    
    // Validação do segundo dígito
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
    
    return true;
  };

  const maskCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length >= 2 && v.startsWith("55")) v = v.slice(2);
    if (v.length === 0) return "+55 ";
    if (v.length <= 2) return `+55 (${v}`;
    if (v.length <= 7) return `+55 (${v.slice(0, 2)}) ${v.slice(2)}`;
    return `+55 (${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  };

  const formatCityName = (value: string) => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith(baseUrl)) {
      setFormData({ ...formData, socialLink: value });
    } else {
      setFormData({ ...formData, socialLink: baseUrl });
    }
  };

  const handleLinkFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len);
  };

  const getSocialConfig = () => {
    switch(provider) {
      case 'Facebook':
        return { label: 'Perfil do Facebook', icon: <FacebookIcon size={16} className="text-blue-600" /> };
      case 'Instagram':
        return { label: 'Perfil do Instagram', icon: <InstagramIcon size={16} className="text-pink-600" /> };
      case 'Google':
        return { label: 'Canal do YouTube', icon: <GoogleIcon size={16} className="text-red-500" /> };
      case 'Apple':
        return { label: 'Rede Social', icon: <AppleIcon size={16} className="text-slate-900" /> };
      default:
        return { label: 'Rede Social', icon: <MailIcon size={16} className="text-slate-400" /> };
    }
  };

  const socialConfig = getSocialConfig();

  const handleVerify = () => {
    if (!formData.name || formData.whatsapp.length < 18 || !formData.cpf || !formData.state || !formData.city) {
      toast({ 
        variant: "destructive", 
        title: "Dados incompletos", 
        description: "Por favor, preencha todos os campos obrigatórios." 
      });
      return;
    }

    if (!validateCPF(formData.cpf)) {
      toast({ 
        variant: "destructive", 
        title: "CPF Inválido", 
        description: "O número de CPF informado não é válido. Verifique os dados." 
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      whatsapp: formData.whatsapp,
      socialMedia: provider,
      socialLink: formData.socialLink,
      cpf: formData.cpf,
      state: formData.state,
      city: formData.city,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Verificado'
    };
    
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    localStorage.setItem('kipapo_users', JSON.stringify([newUser, ...savedUsers]));
    
    toast({
      title: "Cadastro Concluído",
      description: "Sua identidade foi validada com sucesso.",
    });
    
    navigate('/lobby');
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
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="h-14 rounded-2xl border-slate-200 font-bold" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-1.5">
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Cidade</Label>
              <Input 
                placeholder="Sua cidade" 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: formatCityName(e.target.value)})} 
                className="h-14 rounded-2xl border-slate-200 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">CPF</Label>
            <Input 
              placeholder="000.000.000-00" 
              value={formData.cpf} 
              onChange={(e) => setFormData({...formData, cpf: maskCPF(e.target.value)})} 
              className="h-14 rounded-2xl border-slate-200 font-bold" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">WhatsApp</Label>
            <Input 
              placeholder="+55 (00) 00000-0000" 
              value={formData.whatsapp} 
              onChange={(e) => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} 
              className="h-14 rounded-2xl border-slate-200 font-bold" 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">{socialConfig.label}</Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                {socialConfig.icon}
              </div>
              <Input 
                value={formData.socialLink} 
                onChange={handleSocialLinkChange}
                onFocus={handleLinkFocus}
                className="h-14 rounded-2xl border-slate-200 pl-10 font-bold" 
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleVerify} 
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              Validar e Entrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;