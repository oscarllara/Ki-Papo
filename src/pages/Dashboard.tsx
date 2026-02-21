"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  ShieldAlert, 
  History, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  EyeOff
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();

  // Simulação de dados de usuários
  const users = [
    { id: 1, name: "Usuário 01", cpf: "123.***.***-01", birth: "10/05/1990", status: "Verificado", date: "2023-10-25" },
    { id: 2, name: "Usuário 02", cpf: "456.***.***-02", birth: "22/11/1985", status: "Verificado", date: "2023-10-26" },
    { id: 3, name: "Usuário 03", cpf: "789.***.***-03", birth: "05/01/2000", status: "Pendente", date: "2023-10-27" },
  ];

  // Simulação de logs de sistema
  const logs = [
    { id: 1, event: "Login Realizado", user: "User_SP", ip: "192.168.1.1", time: "14:30:05", status: "Sucesso" },
    { id: 2, event: "Verificação de CPF", user: "Novo_User", ip: "172.16.0.10", time: "14:32:10", status: "Sucesso" },
    { id: 3, event: "Entrada em Sala", user: "Gatinha_Legal", ip: "10.0.0.5", time: "14:35:00", status: "Privado" },
    { id: 4, event: "Tentativa de Acesso Menor", user: "Desconhecido", ip: "189.10.5.2", time: "14:40:22", status: "Bloqueado" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lobby')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
              <p className="text-slate-500 font-medium">Gestão de segurança, usuários e conformidade do Ki papo.</p>
            </div>
          </div>
          <Badge variant="outline" className="px-4 py-1 text-xs font-bold bg-white border-slate-200 gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Sistema Online
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total de Usuários</CardTitle>
              <div className="text-4xl font-black">1.284</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs opacity-70">+12% em relação ao mês passado</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Alertas de Segurança</CardTitle>
              <div className="text-4xl font-black text-amber-500">03</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Tentativas de acesso bloqueadas hoje</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Status de Privacidade</CardTitle>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <EyeOff size={24} /> Ativo
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Histórico de bate-papo: <b>Não Armazenado</b></p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-2xl mb-6">
            <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Users size={16} /> Usuários
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <History size={16} /> Logs de Acesso
            </TabsTrigger>
            <TabsTrigger value="docs" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <FileText size={16} /> Documentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">CPF (Mascarado)</TableHead>
                    <TableHead className="font-bold">Nascimento</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Data Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">#{user.id}</TableCell>
                      <TableCell>{user.cpf}</TableCell>
                      <TableCell>{user.birth}</TableCell>
                      <TableCell>
                        <Badge className={user.status === 'Verificado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{user.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Evento</TableHead>
                    <TableHead className="font-bold">Usuário</TableHead>
                    <TableHead className="font-bold">Endereço IP</TableHead>
                    <TableHead className="font-bold">Horário</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-semibold">{log.event}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-500">{log.ip}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                          {log.status === 'Bloqueado' ? <XCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-emerald-500" />}
                          {log.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                  <ShieldAlert size={24} />
                  <h3 className="font-bold text-lg">Termos de Uso</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Regras de convivência, proibição de conteúdos ilícitos e diretrizes para maiores de 18 anos. 
                  O Ki papo preza pela segurança total dos dados sensíveis.
                </p>
                <Button variant="outline" className="w-full rounded-xl">Visualizar Documento</Button>
              </Card>
              <Card className="border-none shadow-sm rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Lock size={24} />
                  <h3 className="font-bold text-lg">Política de Privacidade</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Como tratamos o seu CPF e Data de Nascimento. Garantia de que as mensagens são efêmeras e nunca armazenadas em nossos servidores.
                </p>
                <Button variant="outline" className="w-full rounded-xl">Visualizar Documento</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;