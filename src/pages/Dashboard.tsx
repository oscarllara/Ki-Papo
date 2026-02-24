"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  Eye, 
  MapPin,
  Search,
  FileText,
  Table as TableIcon,
  ExternalLink,
  Link as LinkIcon,
  Trash2,
  UserPlus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  
  // Estado para novo admin
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin-login');
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    setUsers(savedUsers);
    setIsLoaded(true);
  }, [navigate]);

  if (!isLoaded) return null;

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(search) || 
      (user.cpf || '').includes(searchTerm) || 
      (user.city || '').toLowerCase().includes(search)
    );
  });

  const handleCreateAdmin = () => {
    if (!newAdmin.username || !newAdmin.password) {
      toast({ variant: "destructive", title: "Campos vazios", description: "Preencha usuário e senha." });
      return;
    }

    const admins = JSON.parse(localStorage.getItem('kipapo_admins') || '[]');
    admins.push(newAdmin);
    localStorage.setItem('kipapo_admins', JSON.stringify(admins));
    
    toast({ title: "Admin Cadastrado", description: `O usuário ${newAdmin.username} agora tem acesso.` });
    setNewAdmin({ username: '', password: '' });
    setIsAdminDialogOpen(false);
  };

  const clearAllUsers = () => {
    localStorage.removeItem('kipapo_users');
    setUsers([]);
    toast({ title: "Base de Dados Zerada", description: "Todos os cadastros foram removidos." });
  };

  const exportCSV = () => {
    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Rede Social/E-mail", "Cidade", "Estado"];
    const rows = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, u.city, u.state]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_usuarios_kipapo.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text("Relatório de Usuários Ki Papo", 14, 20);
    const data = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, `${u.city}/${u.state}`]);
    autoTable(doc, {
      head: [["Data", "Nome", "CPF", "WhatsApp", "Link Social", "Cidade/UF"]],
      body: data,
      startY: 30,
    });
    doc.save(`relatorio_kipapo.pdf`);
  };

  const handleLogout = () => { 
    sessionStorage.removeItem('admin_auth'); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-4 rounded-3xl"><ShieldCheck className="text-primary" size={32} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Gestão Ki Papo</h1>
              <Badge variant="outline" className="text-[10px] uppercase font-black px-3 py-1">Administrador</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAdminDialogOpen(true)} variant="outline" className="rounded-2xl font-bold gap-2 text-primary border-primary/20">
              <UserPlus size={16} /> Novo Admin
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 font-bold gap-2 rounded-2xl">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 w-fit">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Usuários Ativos</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Relatórios & Limpeza</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    placeholder="Nome, CPF ou Cidade..." 
                    className="pl-12 h-14 rounded-2xl border-none shadow-inner" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <Badge className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px]">{filteredUsers.length} USUÁRIOS</Badge>
              </div>
              <ScrollArea className="max-h-[600px]">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b">
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase py-6 pl-10">Data/Usuário</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">CPF/WhatsApp</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Rede Social/E-mail</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Cidade/UF</TableHead>
                      <TableHead className="text-right pr-10">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                        <TableCell className="pl-10 py-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase">{user.date}</span>
                            <span className="font-black text-slate-800">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-600">{user.cpf}</span>
                            <span className="text-xs font-black text-primary">{user.whatsapp}</span>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-xs font-bold text-slate-600 truncate max-w-[150px] block">{user.socialLink}</span></TableCell>
                        <TableCell><span className="font-bold text-sm">{user.city}/{user.state}</span></TableCell>
                        <TableCell className="text-right pr-10">
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold h-10">
                            <Eye size={14} className="mr-2" /> Ficha
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white p-8">
                <h3 className="text-xl font-black mb-6">Relatórios Rápidos</h3>
                <div className="flex gap-4">
                  <Button onClick={exportPDF} className="h-14 rounded-2xl bg-indigo-600 font-bold gap-2"><FileText size={18}/> PDF</Button>
                  <Button onClick={exportCSV} variant="outline" className="h-14 rounded-2xl font-bold gap-2"><TableIcon size={18}/> CSV</Button>
                </div>
              </Card>
              <Card className="border-none shadow-2xl rounded-[3rem] bg-red-50 p-8 border border-red-100">
                <h3 className="text-xl font-black text-red-900 mb-4">Área de Perigo</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full h-14 rounded-2xl font-black gap-2"><Trash2 size={18}/> Limpar Base</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Zerar todos os cadastros?</AlertDialogTitle>
                      <AlertDialogDescription>Iso removerá permanentemente todos os usuários registrados.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllUsers} className="bg-red-600">Sim, apagar tudo</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Cadastro Admin */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-sm rounded-[2.5rem] p-10 border-none shadow-2xl">
          <div className="text-center space-y-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary"><UserPlus size={32} /></div>
            <DialogTitle className="text-2xl font-black">Novo Administrador</DialogTitle>
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400">Usuário/Nome</Label>
                <Input value={newAdmin.username} onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400">Senha</Label>
                <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} className="h-12 rounded-xl" />
              </div>
            </div>
            <Button onClick={handleCreateAdmin} className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase tracking-widest">Salvar Acesso</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ficha de Usuário */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-10 border-none shadow-2xl bg-white">
          {selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><ShieldCheck size={32} /></div>
                <DialogTitle className="text-2xl font-black">{selectedUser.name}</DialogTitle>
                <Badge className="mt-2">{selectedUser.date}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div><Label className="text-[10px] font-black uppercase text-slate-400">CPF</Label><p className="font-bold">{selectedUser.cpf}</p></div>
                <div><Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label><p className="font-bold text-primary">{selectedUser.whatsapp}</p></div>
                <div><Label className="text-[10px] font-black uppercase text-slate-400">Cidade</Label><p className="font-bold">{selectedUser.city}</p></div>
                <div><Label className="text-[10px] font-black uppercase text-slate-400">UF</Label><p className="font-bold">{selectedUser.state}</p></div>
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase text-slate-400">Rede Social/Link</Label>
                <p className="text-sm font-medium bg-slate-50 p-4 rounded-xl mt-1 truncate">{selectedUser.socialLink}</p>
              </div>
              <Button onClick={() => setSelectedUser(null)} className="w-full h-14 bg-slate-900 text-white rounded-xl font-black">Fechar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;