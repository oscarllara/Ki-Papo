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
  Lock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);

  // Proteção de rota
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin-login');
      return;
    }

    // Carregar usuários do "banco" local
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    setUsers(savedUsers);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
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
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Logs de Chat</CardTitle>
              <div className="flex items-center gap-3 text-slate-400 font-black text-2xl mt-2">
                <EyeOff size={28} /> EFÊMERO
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 font-bold">Nenhuma mensagem é armazenada</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/40 p-1.5 rounded-[1.5rem] mb-8 w-fit">
            <TabsTrigger value="users" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs gap-2">
              <Users size={16} /> LISTA DE USUÁRIOS
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-xs gap-2">
              <History size={16} /> LOGS DE SISTEMA
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
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;