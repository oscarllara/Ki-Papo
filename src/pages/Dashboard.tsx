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
  
  const [newAd, setNewAd] = useState({
    imageUrls: ['', '', '', ''],
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

  const handleCreateAd = () => {
    if (!newAd.link) {
      toast({ variant: "destructive", title: "Link obrigatório", description: "O link de destino deve ser preenchido." });
      return;
    }

    const validImages = newAd.imageUrls.filter(url => url.trim() !== '');
    
    const adToAdd: Ad = {
      id: Date.now().toString(),
      imageUrls: validImages,
      link: newAd.link,
      city: newAd.city || 'Global',
      slotIndex: Number(newAd.slotIndex) || 0
    };

    const updatedAds = [...ads, adToAdd];
    localStorage.setItem('kipapo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    toast({ title: "Anúncio Publicado" });
    setIsAdDialogOpen(false);
    setNewAd({ imageUrls: ['', '', '', ''], link: '', city: 'Global', slotIndex: 0 });
  };

  const deleteAd = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    localStorage.setItem('kipapo_ads', JSON.stringify(updated));
    setAds(updated);
    toast({ title: "Anúncio Removido" });
  };

  const handleLogout = () => { 
    sessionStorage.removeItem('admin_auth'); 
    navigate('/'); 
  };

  const getSlotName = (index: number) => {
    const slots = ["Topo (Banner)", "Lateral (Sidebar)", "Rodapé", "Entre Conteúdo"];
    return slots[index] || "Geral";
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    const headers = ["Data", "Nome", "CPF", "WhatsApp", "Social/Email", "Cidade"];
    const rows = users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, u.city]);
    const csvContent = [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "usuarios.csv");
    link.click();
  };

  const exportPDF = () => {
    if (users.length === 0) return;
    const doc = new jsPDF('landscape');
    doc.text("Relatório Geral de Usuários Ki Papo", 14, 20);
    autoTable(doc, {
      head: [["Data", "Nome", "CPF", "WhatsApp", "Rede Social/Email", "Cidade"]],
      body: users.map(u => [u.date, u.name, u.cpf, u.whatsapp, u.socialLink, u.city]),
      startY: 30,
    });
    doc.save(`relatorio_kipapo.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-4 rounded-3xl"><ShieldCheck className="text-primary" size={32} /></div>
            <div><h1 className="text-2xl font-black text-slate-900">Gestão Ki Papo</h1></div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-red-500 font-bold gap-2 rounded-2xl"><LogOut size={16} /> Sair</Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 w-fit">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest">Publicidade</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <Input placeholder="Buscar..." className="max-w-md h-14 rounded-2xl border-none shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>WhatsApp</TableHead><TableHead>Cidade</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-bold">{user.name}</TableCell>
                      <TableCell>{user.whatsapp}</TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl">Ver</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="p-8 flex justify-between items-center bg-slate-50/50 border-b">
                <h3 className="text-xl font-black">Banners de Publicidade</h3>
                <Button onClick={() => setIsAdDialogOpen(true)} className="rounded-2xl bg-primary h-14 font-black px-6"><Plus size={18} className="mr-2" /> Novo Banner</Button>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Banner</TableHead><TableHead>Cidade</TableHead><TableHead>Posição</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex -space-x-3">
                          {(ad.imageUrls || [ad.imageUrl]).map((url, i) => (
                            <div key={i} className="w-10 h-10 rounded-lg border-2 border-white bg-slate-100 overflow-hidden">
                              <img src={url || `https://www.google.com/s2/favicons?domain=${new URL(ad.link).hostname}&sz=64`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{ad.city}</Badge></TableCell>
                      <TableCell>{getSlotName(ad.slotIndex)}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" onClick={() => deleteAd(ad.id)} className="text-red-500"><Trash2 size={18} /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid grid-cols-2 gap-8">
              <Card className="p-10 rounded-[3rem]"><Button onClick={exportPDF} className="w-full h-16 font-black rounded-2xl"><FileText className="mr-2"/> Exportar PDF</Button></Card>
              <Card className="p-10 rounded-[3rem]"><Button onClick={exportCSV} variant="outline" className="w-full h-16 font-black rounded-2xl"><TableIcon className="mr-2"/> Exportar CSV</Button></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-10">
          <DialogTitle className="text-2xl font-black text-center mb-6">Cadastrar Banner</DialogTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {newAd.imageUrls.map((url, i) => (
                <div key={i} className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Imagem {i+1} (URL)</Label>
                  <Input 
                    placeholder="https://..." 
                    value={url} 
                    onChange={(e) => {
                      const newUrls = [...newAd.imageUrls];
                      newUrls[i] = e.target.value;
                      setNewAd({...newAd, imageUrls: newUrls});
                    }}
                    className="h-12 rounded-xl"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-bold italic">Se nenhuma imagem for adicionada, buscaremos o ícone do site automaticamente.</p>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase">Link de Destino</Label>
              <Input placeholder="https://..." value={newAd.link} onChange={(e) => setNewAd({...newAd, link: e.target.value})} className="h-14 rounded-xl font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Cidade</Label><Input value={newAd.city} onChange={(e) => setNewAd({...newAd, city: e.target.value})} className="h-12 rounded-xl" /></div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase">Posição</Label>
                <select value={newAd.slotIndex} onChange={(e) => setNewAd({...newAd, slotIndex: Number(e.target.value)})} className="w-full h-12 rounded-xl border px-3 text-sm">
                  <option value={0}>Topo (Banner)</option><option value={1}>Lateral (Sidebar)</option><option value={2}>Rodapé</option><option value={3}>Entre Conteúdo</option>
                </select>
              </div>
            </div>
            <Button onClick={handleCreateAd} className="w-full h-16 bg-primary rounded-xl font-black text-lg">PUBLICAR ANÚNCIO</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-[3rem] p-10">
          {selectedUser && (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-black">{selectedUser.name}</h2>
              <div className="text-left bg-slate-50 p-6 rounded-2xl space-y-2">
                <p><strong>WhatsApp:</strong> {selectedUser.whatsapp}</p>
                <p><strong>Social/E-mail:</strong> {selectedUser.socialLink}</p>
                <p><strong>Cidade:</strong> {selectedUser.city}/{selectedUser.state}</p>
                <p><strong>CPF:</strong> {selectedUser.cpf}</p>
                <p><strong>Nascimento:</strong> {selectedUser.birthDate}</p>
              </div>
              <Button onClick={() => setSelectedUser(null)} className="w-full h-14 rounded-xl">Fechar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;