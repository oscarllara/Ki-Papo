"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  Eye, 
  Search,
  FileText,
  Table as TableIcon,
  Trash2,
  UserPlus,
  Megaphone,
  Plus,
  Image as ImageIcon,
  MapPin,
  Link as LinkIcon
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
import { Ad } from '@/components/ads/AdSlot';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  
  const [newAd, setNewAd] = useState<Partial<Ad>>({
    imageUrl: '',
    link: '',
    city: 'Global',
    slotIndex: 0
  });

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin-login');
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    const savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
    setUsers(savedUsers);
    setAds(savedAds);
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
    toast({ title: "Admin Cadastrado" });
    setNewAdmin({ username: '', password: '' });
    setIsAdminDialogOpen(false);
  };

  const handleCreateAd = () => {
    if (!newAd.imageUrl || !newAd.link) {
      toast({ variant: "destructive", title: "Campos vazios", description: "Imagem e Link são obrigatórios." });
      return;
    }
    const adToAdd: Ad = {
      id: Date.now().toString(),
      imageUrl: newAd.imageUrl!,
      link: newAd.link!,
      city: newAd.city || 'Global',
      slotIndex: Number(newAd.slotIndex) || 0
    };
    const updatedAds = [...ads, adToAdd];
    localStorage.setItem('kipapo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    toast({ title: "Anúncio Publicado" });
    setIsAdDialogOpen(false);
    setNewAd({ imageUrl: '', link: '', city: 'Global', slotIndex: 0 });
  };

  const deleteAd = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    localStorage.setItem('kipapo_ads', JSON.stringify(updated));
    setAds(updated);
    toast({ title: "Anúncio Removido" });
  };

  const clearAllUsers = () => {
    localStorage.removeItem('kipapo_users');
    setUsers([]);
    toast({ title: "Base de Dados Zerada" });
  };

  const exportCSV = () => {
    if (users.length === 0) {
      toast({ variant: "destructive", title: "Sem dados", description: "Não há usuários para exportar." });
      return;
    }
    const headers = ["Data", "Nome", "Nascimento", "CPF", "WhatsApp", "Rede Social/Email", "Cidade", "Estado"];
    const rows = users.map(u => [u.date, u.name, u.birthDate || '', u.cpf, u.whatsapp, u.socialLink, u.city, u.state]);
    
    // Usando vírgula como separador padrão internacional ou ponto e vírgula para Excel PT-BR
    const csvContent = [headers.join(";"), ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_usuarios_kipapo_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "CSV Gerado com sucesso" });
  };

  const exportPDF = () => {
    if (users.length === 0) return;
    const doc = new jsPDF('landscape');
    doc.text("Relatório Geral de Usuários Ki Papo", 14, 20);
    autoTable(doc, {
      head: [["Data", "Nome", "CPF", "WhatsApp", "Rede Social/Email", "Cidade"]],
      body: users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, u.city]),
      startY: 30,
      styles: { fontSize: 8 },
    });
    doc.save(`relatorio_kipapo_${new Date().getTime()}.pdf`);
    toast({ title: "PDF Gerado com sucesso" });
  };

  const handleLogout = () => { 
    sessionStorage.removeItem('admin_auth'); 
    navigate('/'); 
  };

  const getSlotName = (index: number) => {
    const slots = ["Topo (Banner)", "Lateral (Sidebar)", "Rodapé", "Entre Conteúdo"];
    return slots[index] || "Geral";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-4 rounded-3xl"><ShieldCheck className="text-primary" size={32} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Gestão Ki Papo</h1>
              <Badge variant="outline" className="text-[10px] uppercase font-black px-3 py-1">Admin Panel</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAdminDialogOpen(true)} variant="outline" className="rounded-2xl font-bold gap-2"><UserPlus size={16} /> Admins</Button>
            <Button onClick={handleLogout} variant="ghost" className="text-red-500 font-bold gap-2 rounded-2xl"><LogOut size={16} /> Sair</Button>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 w-fit">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Publicidade</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input placeholder="Buscar por nome, CPF ou cidade..." className="pl-12 h-14 rounded-2xl border-none shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Badge className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px]">{filteredUsers.length} TOTAL</Badge>
              </div>
              <ScrollArea className="max-h-[600px]">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b">
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase py-6 pl-10">Data/Nome</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">CPF/Whats</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Cidade/UF</TableHead>
                      <TableHead className="text-right pr-10">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="pl-10 py-6">
                          <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400">{user.date}</span><span className="font-black text-slate-800">{user.name}</span></div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col"><span className="text-xs font-bold text-slate-600">{user.cpf}</span><span className="text-xs font-black text-primary">{user.whatsapp}</span></div>
                        </TableCell>
                        <TableCell><span className="font-bold text-sm">{user.city}/{user.state}</span></TableCell>
                        <TableCell className="text-right pr-10"><Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold"><Eye size={14} /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 flex justify-between items-center bg-slate-50/50 border-b">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Banners Publicitários</h3>
                  <p className="text-slate-400 text-xs font-bold mt-1">Gerencie a rotatividade de anúncios por cidade</p>
                </div>
                <Button onClick={() => setIsAdDialogOpen(true)} className="rounded-2xl bg-primary h-14 font-black px-6 gap-2">
                  <Plus size={18} /> Novo Anúncio
                </Button>
              </div>
              <ScrollArea className="max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase pl-10">Visualização</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Cidade Alvo</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Posição (Slot)</TableHead>
                      <TableHead className="text-right pr-10">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="pl-10 py-4">
                          <div className="w-24 h-14 rounded-xl overflow-hidden bg-slate-100 border relative group">
                            <img src={ad.imageUrl} alt="Ad" className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ad.city === 'Global' ? 'outline' : 'default'} className="rounded-lg font-black text-[10px]">
                            {ad.city}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="font-bold text-sm text-slate-600">{getSlotName(ad.slotIndex)}</span></TableCell>
                        <TableCell className="text-right pr-10">
                          <Button variant="ghost" size="icon" onClick={() => deleteAd(ad.id)} className="text-red-400 hover:text-red-600 rounded-full">
                            <Trash2 size={18} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {ads.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-xs">Nenhum anúncio manual cadastrado</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-10">
                <h3 className="text-xl font-black mb-6">Relatórios de Exportação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={exportPDF} className="h-16 rounded-2xl bg-indigo-600 font-black gap-2"><FileText size={20}/> PDF</Button>
                  <Button onClick={exportCSV} variant="outline" className="h-16 rounded-2xl font-black gap-2 border-slate-200"><TableIcon size={20}/> CSV</Button>
                </div>
              </Card>
              <Card className="border-none shadow-2xl rounded-[3rem] bg-red-50 p-10 border border-red-100">
                <h3 className="text-xl font-black text-red-900 mb-6">Limpeza de Dados</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full h-16 rounded-2xl font-black gap-3"><Trash2 size={20}/> Zerar Cadastros</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem]">
                    <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão?</AlertDialogTitle><AlertDialogDescription>Todos os usuários serão removidos permanentemente.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Voltar</AlertDialogCancel><AlertDialogAction onClick={clearAllUsers} className="bg-red-600">Apagar Tudo</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-10 border-none shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary mb-4"><Megaphone size={32} /></div>
              <DialogTitle className="text-2xl font-black">Configurar Anúncio</DialogTitle>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400">URL da Imagem (Banner)</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input placeholder="https://..." value={newAd.imageUrl} onChange={(e) => setNewAd({...newAd, imageUrl: e.target.value})} className="pl-10 h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400">Link de Destino</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input placeholder="https://..." value={newAd.link} onChange={(e) => setNewAd({...newAd, link: e.target.value})} className="pl-10 h-12 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Cidade (ou 'Global')</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <Input value={newAd.city} onChange={(e) => setNewAd({...newAd, city: e.target.value})} className="pl-10 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Posição</Label>
                  <select 
                    value={newAd.slotIndex} 
                    onChange={(e) => setNewAd({...newAd, slotIndex: Number(e.target.value)})}
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-bold focus-visible:ring-primary"
                  >
                    <option value={0}>Topo (Banner)</option>
                    <option value={1}>Lateral (Sidebar)</option>
                    <option value={2}>Rodapé</option>
                    <option value={3}>Entre Conteúdo</option>
                  </select>
                </div>
              </div>
            </div>
            <Button onClick={handleCreateAd} className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase tracking-widest">Publicar Agora</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-sm rounded-[2.5rem] p-10 border-none shadow-2xl">
          <div className="text-center space-y-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary"><UserPlus size={32} /></div>
            <DialogTitle className="text-2xl font-black">Novo Acesso</DialogTitle>
            <div className="space-y-4 text-left">
              <Input placeholder="Usuário" value={newAdmin.username} onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})} className="h-12 rounded-xl" />
              <Input type="password" placeholder="Senha" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <Button onClick={handleCreateAdmin} className="w-full h-14 bg-primary rounded-xl font-black uppercase">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md rounded-[3rem] p-10 border-none shadow-2xl bg-white">
          {selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><ShieldCheck size={32} /></div>
                <DialogTitle className="text-2xl font-black">{selectedUser.name}</DialogTitle>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge>{selectedUser.date}</Badge>
                  <Badge variant="outline">{selectedUser.birthDate || 'N/A'}</Badge>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-[10px] uppercase font-black text-slate-400">CPF</Label><p className="font-bold">{selectedUser.cpf}</p></div>
                  <div><Label className="text-[10px] uppercase font-black text-slate-400">WhatsApp</Label><p className="font-bold text-primary">{selectedUser.whatsapp}</p></div>
                </div>
                <div><Label className="text-[10px] uppercase font-black text-slate-400">Social Link / Email</Label><p className="font-bold text-xs break-all">{selectedUser.socialLink}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-[10px] uppercase font-black text-slate-400">Cidade</Label><p className="font-bold">{selectedUser.city}</p></div>
                  <div><Label className="text-[10px] uppercase font-black text-slate-400">Estado</Label><p className="font-bold">{selectedUser.state}</p></div>
                </div>
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