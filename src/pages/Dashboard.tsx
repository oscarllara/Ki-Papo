"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  Eye, 
  Download, 
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') { navigate('/admin-login'); return; }
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    setUsers(savedUsers);
  }, [navigate]);

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(search) || 
      (user.cpf || '').includes(searchTerm) || 
      (user.city || '').toLowerCase().includes(search)
    );
  });

  const exportCSV = () => {
    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Cidade", "Estado", "Link de Perfil"];
    const rows = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.city, u.state, u.socialLink]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_usuarios_kipapo.csv`;
    link.click();
  };

  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); navigate('/'); };

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
            <LogOut size={16} /> Sair do Painel
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 w-fit">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Usuários Ativos</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Exportar Dados</TabsTrigger>
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
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px]">{filteredUsers.length} USUÁRIOS</Badge>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b">
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase py-6 pl-10 text-slate-400">Dados do Usuário</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400">Localização</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-slate-400">Rede Social / Link</TableHead>
                      <TableHead className="text-right pr-10 text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold">Nenhum usuário encontrado.</TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                          <TableCell className="pl-10">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800">{user.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">CPF: {user.cpf}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={14} className="text-primary opacity-50" />
                              <span className="font-bold text-sm">{user.city} - {user.state}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge className="w-fit bg-secondary text-secondary-foreground text-[8px] font-black uppercase tracking-widest">{user.socialMedia}</Badge>
                              <a href={user.socialLink} target="_blank" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 truncate max-w-[200px]">
                                <LinkIcon size={12} /> {user.socialLink || 'Sem link'}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold h-10 border-slate-200 hover:bg-primary hover:text-white hover:border-transparent transition-all">
                              <Eye size={14} className="mr-2" /> Visualizar
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
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Relatórios Detalhados</h3>
                <p className="text-slate-400 font-bold max-w-md">Gere uma planilha completa com todos os dados dos usuários, incluindo localização e links de perfis.</p>
              </div>
              <Button onClick={exportCSV} className="h-20 px-10 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-95">
                <Download size={24} /> Baixar Planilha CSV
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          {selectedUser && (
            <>
              <div className="bg-primary p-10 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <ShieldCheck size={40} />
                </div>
                <DialogTitle className="text-2xl font-black mb-1">Perfil do Usuário</DialogTitle>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-[0.2em]">Cadastro Validado em {selectedUser.date}</p>
              </div>
              <div className="p-10 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Estado</Label>
                    <p className="font-black text-slate-800">{selectedUser.state}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Cidade</Label>
                    <p className="font-black text-slate-800">{selectedUser.city}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-50" />
                <div>
                  <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">WhatsApp / Contato</Label>
                  <p className="font-black text-primary text-lg">{selectedUser.whatsapp}</p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Link do Perfil Social</Label>
                  <a href={selectedUser.socialLink} target="_blank" className="mt-2 flex items-center justify-between gap-2 text-primary font-bold text-sm bg-slate-50 p-4 rounded-2xl group">
                    <span className="truncate">{selectedUser.socialLink || 'Não informado'}</span>
                    <ExternalLink size={16} className="shrink-0 opacity-40 group-hover:opacity-100" />
                  </a>
                </div>
                <Button onClick={() => setSelectedUser(null)} className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest transition-all">Fechar Ficha</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;