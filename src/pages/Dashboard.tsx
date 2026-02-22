"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  LogOut,
  KeyRound,
  Save,
  ShieldCheck,
  FileText,
  Eye,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  Download,
  FileDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    try {
      const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
      setUsers(Array.isArray(savedUsers) ? savedUsers : []);
    } catch (e) {
      setUsers([]);
    }
  }, [navigate]);

  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredUsers = users.filter(user => {
    const search = normalize(searchTerm);
    return normalize(user.name || '').includes(search) ||
           (user.cpf || '').includes(searchTerm) ||
           (user.whatsapp || '').includes(searchTerm);
  });

  const maskCPF = (cpf: string) => {
    if (!cpf) return '';
    // Formato esperado: 000.000.000-00
    const parts = cpf.split(/[.-]/);
    if (parts.length < 4) return cpf;
    return `${parts[0]}.xxx.xxx-${parts[3]}`;
  };

  const exportCSV = () => {
    if (users.length === 0) {
      toast({ variant: "destructive", title: "Erro", description: "Não há dados para exportar." });
      return;
    }

    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Rede Social", "Perfil"];
    const rows = users.map(u => [
      u.date, 
      u.name, 
      u.cpf, 
      u.whatsapp, 
      u.socialMedia, 
      u.socialLink
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `usuarios_kipapo_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (users.length === 0) {
      toast({ variant: "destructive", title: "Erro", description: "Não há dados para exportar." });
      return;
    }

    const doc = new jsPDF();
    doc.text("Relatório de Usuários - Ki Papo", 14, 15);
    
    const tableRows = users.map(u => [
      u.date, 
      u.name, 
      u.cpf, 
      u.whatsapp, 
      u.socialMedia
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['Data', 'Nome', 'CPF', 'WhatsApp', 'Origem']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [35, 119, 187] } // Azul Ki Papo
    });

    doc.save(`relatorio_kipapo_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleDeleteAll = () => {
    if(confirm('Atenção: Isso apagará TODOS os usuários registrados permanentemente. Deseja continuar?')) {
      localStorage.removeItem('kipapo_users');
      setUsers([]);
      toast({ title: "Base de dados limpa", description: "Todos os registros foram removidos." });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Senha muito curta", description: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Senhas não coincidem", description: "Verifique a confirmação da senha." });
      return;
    }
    localStorage.setItem('admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    toast({ title: "Senha atualizada", description: "A senha administrativa foi alterada com sucesso." });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-4 rounded-3xl">
              <ShieldCheck className="text-primary" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Gestão</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary px-3">Administrador</Badge>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sistema Ki Papo v1.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-2xl border-slate-200 font-bold gap-2">
              <ArrowLeft size={16} /> Ver App
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:bg-red-50 rounded-2xl font-bold gap-2">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full space-y-8">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-3xl w-full md:w-fit h-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest gap-2">
              <Users size={14} /> Usuários
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest gap-2">
              <KeyRound size={14} /> Segurança
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest gap-2">
              <FileText size={14} /> Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Pesquisar por nome, CPF ou Celular..."
                    className="pl-12 h-14 rounded-2xl border-none bg-white shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-700 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-black text-[10px]">
                    {filteredUsers.length} REGISTROS
                  </Badge>
                  <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 text-red-400 hover:text-red-600 hover:bg-red-50 border-slate-100" onClick={handleDeleteAll}>
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest py-6 pl-10">Cadastro</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Nome Completo</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Identificação (CPF)</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">WhatsApp</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Origem</TableHead>
                      <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-right pr-10">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-60 text-center text-slate-300 font-bold italic">Nenhum usuário cadastrado até o momento.</TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-10 py-6">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px]">
                              <Calendar size={12} /> {user.date}
                            </div>
                          </TableCell>
                          <TableCell className="font-black text-slate-800 text-sm">{user.name}</TableCell>
                          <TableCell className="font-mono text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg w-fit">
                            {maskCPF(user.cpf)}
                          </TableCell>
                          <TableCell className="text-slate-600 font-bold text-xs">{user.whatsapp}</TableCell>
                          <TableCell>
                            <Badge className="bg-secondary text-secondary-foreground text-[9px] font-black uppercase tracking-tighter">
                              {user.socialMedia}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="rounded-xl font-bold border-slate-200 text-primary hover:bg-primary hover:text-white transition-all gap-2"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye size={14} /> Detalhes
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

          <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-xl mx-auto">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-12 text-center space-y-8">
                <div className="bg-primary/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-inner">
                  <KeyRound size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Senha Administrativa</h3>
                  <p className="text-sm text-slate-400 font-medium">Altere a senha de acesso ao painel de gestão.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 text-left">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-black text-slate-500 text-[10px] uppercase tracking-widest ml-1">Nova Senha</Label>
                      <Input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 dígitos"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black text-slate-500 text-[10px] uppercase tracking-widest ml-1">Confirmar Nova Senha</Label>
                      <Input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 mt-6 transition-all active:scale-95">
                    <Save size={20} /> Atualizar Senha
                  </Button>
                </form>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[3rem] bg-white p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">Extração de Relatórios</h3>
                    <p className="text-sm text-slate-400 font-medium">Exporte a base de usuários verificados.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={exportCSV} variant="outline" className="rounded-2xl font-bold gap-2 border-slate-200">
                    <Download size={18} /> Exportar CSV
                  </Button>
                  <Button onClick={exportPDF} className="rounded-2xl font-bold gap-2 bg-primary text-white hover:bg-primary/90">
                    <FileDown size={18} /> Exportar PDF
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3 border border-slate-100">
                  <h4 className="font-black text-primary text-xs uppercase tracking-widest">Aviso de Privacidade</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    O acesso aos relatórios completos com CPFs expostos é auditado. Garanta que a extração de dados esteja em conformidade com as finalidades administrativas do Ki Papo.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl space-y-3 border border-slate-100">
                  <h4 className="font-black text-primary text-xs uppercase tracking-widest">Total de Registros</h4>
                  <p className="text-3xl font-black text-slate-900">{users.length}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Usuários verificados na base</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden font-sans">
          <div className="bg-primary p-8 text-white text-center">
            <div className="bg-white/20 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <Users size={40} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Ficha do Usuário</DialogTitle>
            <DialogDescription className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest mt-1">
              Registro Administrativo Completo
            </DialogDescription>
          </div>

          {selectedUser && (
            <div className="p-10 bg-white space-y-8">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome do Cidadão</Label>
                  <p className="text-sm font-black text-slate-800">{selectedUser.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nascimento</Label>
                  <p className="text-sm font-black text-slate-800">{selectedUser.birth?.split('-').reverse().join('/')}</p>
                </div>
                <div className="col-span-2 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary tracking-wider">Documento Identificado (CPF Completo)</Label>
                  <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter leading-none">{selectedUser.cpf}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp / Celular</Label>
                  <p className="text-sm font-black text-slate-800">{selectedUser.whatsapp}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Rede Social</Label>
                  <Badge className="bg-secondary text-secondary-foreground font-black text-[9px]">{selectedUser.socialMedia}</Badge>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Link de Perfil</Label>
                  <a 
                    href={selectedUser.socialLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs font-bold break-all flex items-center gap-2 bg-primary/5 p-3 rounded-xl"
                  >
                    {selectedUser.socialLink} <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <Button onClick={() => setSelectedUser(null)} className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest">
                Fechar Detalhes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;