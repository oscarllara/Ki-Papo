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
  Trash2
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

  const clearAllUsers = () => {
    localStorage.removeItem('kipapo_users');
    setUsers([]);
    toast({
      title: "Base de Dados Zerada",
      description: "Todos os cadastros foram removidos com sucesso.",
    });
  };

  const exportCSV = () => {
    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Rede Social/E-mail", "Cidade", "Estado"];
    const rows = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, u.city, u.state]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_usuarios_kipapo_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Relatório de Usuários Ki Papo", 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28);

    const headers = [["Data", "Nome", "CPF", "WhatsApp", "Link Social/E-mail", "Cidade/UF"]];
    const data = users.map(u => [
      u.date || '-', 
      u.name || '-', 
      u.cpf || '-', 
      u.whatsapp || '-', 
      u.socialLink || '-',
      `${u.city || '-'}/${u.state || '-'}`
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [35, 119, 187] },
      styles: { fontSize: 8 }
    });

    doc.save(`relatorio_usuarios_kipapo_${new Date().toLocaleDateString()}.pdf`);
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
          <Button onClick={handleLogout} variant="ghost" className="text-red-500 font-bold gap-2 rounded-2xl">
            <LogOut size={16} /> Sair
          </Button>
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
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b">
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase py-6 pl-10 text-slate-400">Data/Usuário</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400">CPF/WhatsApp</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400">Rede Social/E-mail</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400">Cidade/UF</TableHead>
                      <TableHead className="text-right pr-10 text-slate-400">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 font-bold">Nenhum usuário cadastrado.</TableCell></TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                          <TableCell className="pl-10 py-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase">{user.date}</span>
                              <span className="font-black text-slate-800 text-base">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-600">{user.cpf}</span>
                              <span className="text-xs font-black text-primary">{user.whatsapp}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 max-w-[200px]">
                              <LinkIcon size={12} className="text-slate-300 shrink-0" />
                              <span className="text-xs font-bold text-slate-600 truncate">{user.socialLink || user.email || 'Não informado'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={14} className="text-primary opacity-50" />
                              <span className="font-bold text-sm">{user.city}/{user.state}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold h-10 border-slate-200">
                              <Eye size={14} className="mr-2" /> Ficha
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

          <TabsContent value="logs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800">Pré-visualização do Relatório</h3>
                  <Badge variant="outline" className="font-bold">{users.length} Registros</Badge>
                </div>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase py-4 pl-8">Data</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Nome</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Link/Rede</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Cidade/UF</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">Sem dados para exportar.</TableCell></TableRow>
                      ) : (
                        users.map((u, i) => (
                          <TableRow key={i} className="border-b border-slate-50">
                            <TableCell className="pl-8 text-xs font-bold text-slate-400">{u.date}</TableCell>
                            <TableCell className="text-xs font-black text-slate-700">{u.name}</TableCell>
                            <TableCell className="text-xs font-bold text-slate-500 truncate max-w-[150px]">{u.socialLink}</TableCell>
                            <TableCell className="text-xs font-bold text-slate-500">{u.city}/{u.state}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-indigo-600 p-10 text-white space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">Ações</h3>
                    <p className="text-indigo-100 text-sm opacity-80">Gerencie a exportação e a base de usuários.</p>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={exportPDF} disabled={users.length === 0} className="w-full h-16 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl disabled:opacity-50">
                      <FileText size={20} /> Baixar PDF
                    </Button>
                    <Button onClick={exportCSV} disabled={users.length === 0} variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest gap-3 disabled:opacity-50">
                      <TableIcon size={20} /> Baixar CSV
                    </Button>
                    
                    <div className="pt-4 mt-4 border-t border-white/10">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest gap-3 bg-red-500/20 hover:bg-red-500 text-white border-2 border-red-500/50">
                            <Trash2 size={20} /> Zerar Base de Dados
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-none p-10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium">
                              Esta ação irá excluir permanentemente todos os {users.length} usuários cadastrados até agora. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="rounded-xl h-12 font-bold">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={clearAllUsers} className="rounded-xl h-12 bg-red-600 hover:bg-red-700 font-black">Sim, Limpar Tudo</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          {selectedUser && (
            <>
              <div className="bg-primary p-10 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 backdrop-blur-md"><ShieldCheck size={40} /></div>
                <DialogTitle className="text-2xl font-black mb-1">Perfil do Usuário</DialogTitle>
                <p className="text-[10px] uppercase font-bold opacity-60">Último Acesso: {selectedUser.date}</p>
              </div>
              <div className="p-10 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div><Label className="text-[10px] uppercase text-slate-400 font-black">UF</Label><p className="font-black text-slate-800">{selectedUser.state}</p></div>
                  <div><Label className="text-[10px] uppercase text-slate-400 font-black">Cidade</Label><p className="font-black text-slate-800">{selectedUser.city}</p></div>
                </div>
                <div><Label className="text-[10px] uppercase text-slate-400 font-black">CPF</Label><p className="font-black text-slate-800">{selectedUser.cpf}</p></div>
                <div><Label className="text-[10px] uppercase text-slate-400 font-black">WhatsApp</Label><p className="font-black text-primary text-lg">{selectedUser.whatsapp}</p></div>
                <div>
                  <Label className="text-[10px] uppercase text-slate-400 font-black">Link Rede Social / E-mail</Label>
                  <div className="mt-2 flex items-center justify-between gap-2 text-primary font-bold text-sm bg-slate-50 p-4 rounded-2xl">
                    <span className="truncate">{selectedUser.socialLink || 'Não informado'}</span>
                    <a href={selectedUser.socialLink?.startsWith('http') ? selectedUser.socialLink : `https://${selectedUser.socialLink}`} target="_blank" rel="noreferrer">
                      <ExternalLink size={16} className="shrink-0 opacity-40 hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
                <Button onClick={() => setSelectedUser(null)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Fechar Ficha</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;