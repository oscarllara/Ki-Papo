"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, LogOut, KeyRound, Save, ShieldCheck, FileText, Eye, Search, ExternalLink, Trash2, Calendar, Download, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    if (isAuth !== 'true') { navigate('/admin-login'); return; }
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    setUsers(savedUsers);
  }, [navigate]);

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (user.name || '').toLowerCase().includes(search) || (user.cpf || '').includes(searchTerm) || (user.city || '').toLowerCase().includes(search);
  });

  const exportCSV = () => {
    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Cidade", "UF", "Rede Social", "Link"];
    const rows = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.city, u.state, u.socialMedia, u.socialLink]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_kipapo.csv`;
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
              <h1 className="text-2xl font-black text-slate-900">Painel de Gestão</h1>
              <Badge variant="outline" className="text-[10px] uppercase font-black px-3">Administrador</Badge>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-red-500 font-bold gap-2">
            <LogOut size={16} /> Sair
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-3xl mb-8">
            <TabsTrigger value="users" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest">Usuários</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 bg-slate-50/30 flex justify-between items-center">
                <Input placeholder="Buscar por nome, cidade ou CPF..." className="w-96 h-14 rounded-2xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Badge className="bg-primary/10 text-primary px-4 py-2 font-black text-[10px]">{filteredUsers.length} REGISTROS</Badge>
              </div>
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-black text-[10px] uppercase py-6 pl-10">Nome</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Cidade/UF</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">CPF</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Rede Social</TableHead>
                    <TableHead className="text-right pr-10">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="pl-10 font-bold">{user.name}</TableCell>
                      <TableCell className="font-medium text-xs text-slate-500">{user.city} - {user.state}</TableCell>
                      <TableCell className="font-mono text-xs text-primary">{user.cpf}</TableCell>
                      <TableCell><Badge className="bg-secondary text-secondary-foreground text-[9px] font-black uppercase">{user.socialMedia}</Badge></TableCell>
                      <TableCell className="text-right pr-10">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold gap-2">
                          <Eye size={14} /> Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-none shadow-xl rounded-[3rem] bg-white p-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">Exportar Base de Dados</h3>
                <p className="text-sm text-slate-400 font-medium">Extraia todos os dados dos usuários em formato CSV.</p>
              </div>
              <Button onClick={exportCSV} className="h-14 px-8 bg-primary rounded-2xl font-black uppercase tracking-widest gap-2">
                <Download size={20} /> Baixar Relatório
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-0 overflow-hidden">
          {selectedUser && (
            <>
              <div className="bg-primary p-8 text-white text-center">
                <DialogTitle className="text-2xl font-black">Ficha do Usuário</DialogTitle>
                <p className="text-[10px] uppercase font-bold opacity-60">Cadastro Verificado</p>
              </div>
              <div className="p-10 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-[10px] uppercase text-slate-400 font-black">Cidade</Label><p className="font-bold">{selectedUser.city}</p></div>
                  <div><Label className="text-[10px] uppercase text-slate-400 font-black">UF</Label><p className="font-bold">{selectedUser.state}</p></div>
                </div>
                <div><Label className="text-[10px] uppercase text-slate-400 font-black">WhatsApp</Label><p className="font-bold text-primary">{selectedUser.whatsapp}</p></div>
                <div>
                  <Label className="text-[10px] uppercase text-slate-400 font-black">Link de Perfil</Label>
                  <a href={selectedUser.socialLink} target="_blank" className="flex items-center gap-2 text-primary font-bold text-xs bg-slate-50 p-3 rounded-xl break-all">
                    {selectedUser.socialLink} <ExternalLink size={14} />
                  </a>
                </div>
                <Button onClick={() => setSelectedUser(null)} className="w-full h-14 bg-slate-900 rounded-2xl font-black uppercase">Fechar</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;