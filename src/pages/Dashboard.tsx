"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  History, 
  ArrowLeft, 
  CheckCircle2, 
  LogOut,
  Lock,
  Settings,
  KeyRound,
  Save,
  ShieldCheck,
  Smartphone,
  Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin-login');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    setUsers(savedUsers);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Senha curta" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Senhas não coincidem" });
      return;
    }
    localStorage.setItem('admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast({ title: "Senha Atualizada" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-2xl h-10 w-10 border-slate-200 bg-white">
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Painel do Gestor</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Controle de Acessos Ki papo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-black text-[10px]">
              SISTEMA MONITORADO
            </Badge>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl h-10 font-bold px-4">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Usuários</CardTitle>
              <div className="text-4xl font-black mt-1">{users.length}</div>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Segurança</CardTitle>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xl mt-1">
                <ShieldCheck size={20} /> ATIVA
              </div>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo LGPD</CardTitle>
              <div className="flex items-center gap-2 text-blue-600 font-black text-xl mt-1">
                <Lock size={20} /> COMPLIANCE
              </div>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rede</CardTitle>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xl mt-1">
                <Globe size={20} /> NACIONAL
              </div>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-2xl mb-6 w-fit h-auto flex-wrap">
            <TabsTrigger value="users" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] gap-2 uppercase">
              <Users size={14} /> Usuários Cadastrados
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] gap-2 uppercase">
              <Settings size={14} /> Segurança Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="animate-in fade-in duration-300">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Monitoramento de Base</h3>
                <Button variant="outline" size="sm" className="rounded-lg font-bold text-[10px] uppercase h-8" onClick={() => {
                  if(confirm('Limpar toda a base de usuários?')) {
                    localStorage.removeItem('kipapo_users');
                    setUsers([]);
                  }
                }}>Limpar Histórico</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase pl-6 py-4">ID / Data</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Nome</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Rede Social</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Telefone (WhatsApp)</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">CPF Mascarado</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Data Nasc.</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Status</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase pr-6 py-4">Último Acesso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-40 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Nenhum registro encontrado</TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                          <TableCell className="pl-6">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-xs">#{user.id.toString().slice(-4)}</span>
                              <span className="text-[9px] text-slate-400 font-bold">{user.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-slate-700 text-xs">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200 text-indigo-600 bg-indigo-50/30">
                              {user.socialMedia}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-600">{user.whatsapp}</TableCell>
                          <TableCell className="font-mono text-[11px] font-bold text-slate-500">{user.cpf}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-600">{user.birth?.split('-').reverse().join('/')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase">
                              <CheckCircle2 size={12} /> {user.status}
                            </div>
                          </TableCell>
                          <TableCell className="pr-6 text-[10px] font-bold text-slate-400">
                            {user.lastAccess}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in duration-300">
            <div className="max-w-xl mx-auto py-8">
              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <KeyRound className="text-indigo-600" /> Alterar Senha Gestor
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Segurança de Acesso ao Painel</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-black text-slate-600 text-[10px] uppercase ml-1">Nova Senha Administrativa</Label>
                      <Input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-slate-600 text-[10px] uppercase ml-1">Repetir Senha</Label>
                      <Input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100">
                    <Save size={16} /> Atualizar Acesso
                  </Button>
                </form>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-8">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase text-center">
                    A alteração é imediata e afetará o próximo login.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;