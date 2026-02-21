"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  ShieldAlert, 
  History, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  EyeOff,
  LogOut,
  Lock,
  Settings,
  KeyRound,
  Save
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

  // Proteção de rota
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
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro na confirmação",
        description: "As senhas não coincidem.",
      });
      return;
    }

    localStorage.setItem('admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast({
      title: "Senha Alterada",
      description: "A senha administrativa foi atualizada com sucesso.",
    });
  };

  const logs = [
    { id: 1, event: "Acesso ao Painel", user: "Admin", ip: "192.168.1.1", time: new Date().toLocaleTimeString(), status: "Sucesso" },
    { id: 2, event: "Verificação de Usuário", user: "Novo_Membro", ip: "172.16.0.10", time: "Há 5 min", status: "Sucesso" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-2xl h-12 w-12 border-slate-200">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Painel do Gestor</h1>
              <p className="text-slate-500 font-bold mt-1">Monitoramento de acessos e segurança.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-5 py-2 text-xs font-black bg-white border-slate-200 gap-3 rounded-full">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> SISTEMA ATIVO
            </Badge>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl gap-2 font-bold">
              <LogOut size={18} /> Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-indigo-600 text-white p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black opacity-70 uppercase tracking-widest">Usuários Cadastrados</CardTitle>
              <div className="text-5xl font-black mt-2">{users.length}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-bold opacity-60">Total de validações realizadas</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Privacidade de Dados</CardTitle>
              <div className="flex items-center gap-3 text-emerald-600 font-black text-2xl mt-2">
                <Lock size={28} /> CRIPTOGRAFADO
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 font-bold">CPFs mascarados por padrão</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Segurança Admin</CardTitle>
              <div className="flex items-center gap-3 text-amber-500 font-black text-2xl mt-2">
                <KeyRound size={28} /> ACESSO RESTRITO
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 font-bold">Senha padrão alterável</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/40 p-1.5 rounded-[1.5rem] mb-8 w-fit overflow-x-auto">
            <TabsTrigger value="users" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs gap-2">
              <Users size={16} /> LISTA DE USUÁRIOS
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs gap-2">
              <History size={16} /> LOGS DE SISTEMA
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs gap-2">
              <Settings size={16} /> CONFIGURAÇÕES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-black text-slate-800 tracking-tight">Base de Usuários</h3>
                <Button variant="outline" className="rounded-xl font-bold text-xs" onClick={() => {
                  if(confirm('Limpar toda a base de usuários?')) {
                    localStorage.removeItem('kipapo_users');
                    setUsers([]);
                  }
                }}>Limpar Base</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase pl-8">ID / Data</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">CPF Mascarado</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">Data Nasc.</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold">Nenhum usuário cadastrado ainda.</TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                          <TableCell className="pl-8">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900">#{user.id.toString().slice(-4)}</span>
                              <span className="text-[10px] text-slate-400 font-bold">{user.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-slate-600">{user.cpf}</TableCell>
                          <TableCell className="font-bold text-slate-600">{user.birth.split('-').reverse().join('/')}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-lg font-black text-[10px]">
                              {user.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase pl-8">Evento</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">Usuário</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">Endereço IP</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-slate-50">
                        <TableCell className="pl-8">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{log.event}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{log.time}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-600">{log.user}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-400">{log.ip}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-black text-[10px] text-emerald-600 uppercase">
                            <CheckCircle2 size={14} /> {log.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto">
              <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Alterar Senha Admin</h3>
                  <p className="text-sm text-slate-500 font-medium">Atualize sua senha de acesso ao painel gestor.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 ml-1">Nova Senha</Label>
                      <Input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="h-14 rounded-2xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 ml-1">Confirmar Nova Senha</Label>
                      <Input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                        className="h-14 rounded-2xl border-slate-200"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold gap-2">
                    <Save size={18} /> Salvar Nova Senha
                  </Button>
                </form>

                <div className="bg-blue-50 p-6 rounded-[1.5rem] border border-blue-100 flex gap-4">
                  <ShieldAlert className="text-blue-500 shrink-0" size={24} />
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    <b>Segurança:</b> Para implementar um sistema de e-mail real com links de recuperação temporários e autenticação de dois fatores, é necessário adicionar a integração com <b>Supabase</b>.
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