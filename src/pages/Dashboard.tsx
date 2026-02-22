"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  LogOut,
  Lock,
  KeyRound,
  Save,
  ShieldCheck,
  FileText,
  Eye,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm) ||
    user.whatsapp.includes(searchTerm)
  );

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Senha curta", description: "Mínimo 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Erro", description: "As senhas não coincidem." });
      return;
    }
    localStorage.setItem('admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast({ title: "Sucesso", description: "Senha administrativa atualizada." });
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
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Gestão e Segurança Ki papo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 rounded-full font-black text-[10px]">
              SISTEMA PROTEGIDO
            </Badge>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl h-10 font-bold px-4">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-2xl mb-8 flex w-full md:w-fit h-auto overflow-x-auto">
            <TabsTrigger value="users" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md font-black text-[10px] gap-2 uppercase whitespace-nowrap">
              <Users size={14} /> Usuários
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md font-black text-[10px] gap-2 uppercase whitespace-nowrap">
              <ShieldCheck size={14} /> Segurança Admin
            </TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md font-black text-[10px] gap-2 uppercase whitespace-nowrap">
              <FileText size={14} /> Privacidade (LGPD)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    placeholder="Filtrar por nome, CPF ou WhatsApp..."
                    className="pl-10 h-10 rounded-xl border-slate-200 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg font-bold text-[10px] uppercase h-8" onClick={() => {
                    if(confirm('Isso apagará todos os usuários salvos. Continuar?')) {
                      localStorage.removeItem('kipapo_users');
                      setUsers([]);
                      toast({ title: "Base limpa" });
                    }
                  }}>Limpar Base</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase pl-6 py-4">Data</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Nome</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">WhatsApp</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">CPF (Completo)</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4">Rede</TableHead>
                      <TableHead className="font-black text-slate-400 text-[9px] uppercase py-4 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-40 text-center text-slate-400 font-bold text-xs uppercase tracking-widest italic">Nenhum registro encontrado</TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                          <TableCell className="pl-6">
                            <span className="text-[10px] text-slate-400 font-bold">{user.date}</span>
                          </TableCell>
                          <TableCell className="font-bold text-slate-700 text-xs">{user.name}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-600">{user.whatsapp}</TableCell>
                          <TableCell className="font-mono text-[11px] font-bold text-indigo-600">{user.cpf}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] font-black uppercase border-indigo-100 text-indigo-600 bg-indigo-50/30">
                              {user.socialMedia}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-2xl mx-auto">
              <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10">
                <div className="mb-10 text-center">
                  <div className="bg-indigo-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <KeyRound size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Senha Administrativa</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Segurança de Acesso ao Painel</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-black text-slate-600 text-[10px] uppercase ml-1">Nova Senha de Acesso</Label>
                      <Input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 dígitos"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-slate-600 text-[10px] uppercase ml-1">Confirmar Senha</Label>
                      <Input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-indigo-100 transition-all">
                    <Save size={18} /> Salvar Nova Senha
                  </Button>
                </form>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <Lock className="text-blue-600" /> Proteção de Dados (LGPD)
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Operação em total conformidade com a LGPD. O acesso a dados sensíveis como CPF completo é restrito a administradores autenticados.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-3xl flex items-center justify-center mb-4 text-indigo-600">
              <Users size={32} />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-800">Ficha Completa</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Registro de Auditoria Administrativa
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome</Label>
                  <p className="text-sm font-bold text-slate-800">{selectedUser.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</Label>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black">Ativo</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp</Label>
                  <p className="text-sm font-bold text-slate-800">{selectedUser.whatsapp}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nascimento</Label>
                  <p className="text-sm font-bold text-slate-800">{selectedUser.birth?.split('-').reverse().join('/')}</p>
                </div>
                <div className="space-y-1 col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Label className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">CPF COMPLETO</Label>
                  <p className="text-xl font-black text-slate-900 font-mono tracking-tighter mt-1">{selectedUser.cpf}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Rede Social</Label>
                  <p className="text-sm font-bold text-slate-800">{selectedUser.socialMedia}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cadastro em</Label>
                  <p className="text-sm font-bold text-slate-800">{selectedUser.date}</p>
                </div>
              </div>
              <Button onClick={() => setSelectedUser(null)} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold">
                Fechar Visualização
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;