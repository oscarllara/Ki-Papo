"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  Search,
  FileText,
  Table as TableIcon,
  Trash2,
  Plus,
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
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useToast } from "@/hooks/use-toast";
import { Ad } from '@/components/ads/AdSlot';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  
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
      (user.id?.toString() || '').includes(searchTerm) || 
      (user.city || '').toLowerCase().includes(search)
    );
  });

  const handleCreateAd = () => {
    if (!newAd.link) {
      toast({ variant: "destructive", title: "Link obrigatório" });
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
    setIsAdDialogOpen(false);
    setNewAd({ imageUrls: ['', '', '', ''], link: '', city: 'Global', slotIndex: 0 });
    toast({ title: "Anúncio Publicado" });
  };

  const deleteAd = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    localStorage.setItem('kipapo_ads', JSON.stringify(updated));
    setAds(updated);
    toast({ title: "Anúncio Removido" });
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    const headers = ["ID", "Data", "Nome", "CPF", "WhatsApp", "Cidade", "Contato Social", "Indicado Por"];
    const rows = users.map(u => [u.id, u.date, u.name, u.cpf, u.whatsapp, u.city, u.socialLink || "-", u.indicatedBy || "-"]);
    const csvContent = [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "usuarios_kipapo.csv");
    link.click();
  };

  const exportPDF = () => {
    if (users.length === 0) return;
    const doc = new jsPDF('landscape');
    doc.text("Relatório Geral de Usuários Ki Papo", 14, 20);
    autoTable(doc, {
      head: [["ID", "Data", "Nome", "WhatsApp", "Cidade", "Rede Social / E-mail", "Indicado Por"]],
      body: users.map(u => [u.id, u.date, u.name, u.whatsapp, u.city, u.socialLink || "-", u.indicatedBy || "-"]),
      startY: 30,
      styles: { fontSize: 8 }
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
          <Button onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/'); }} variant="ghost" className="text-red-500 font-bold gap-2 rounded-2xl"><LogOut size={16} /> Sair</Button>
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
                <Input placeholder="Buscar por ID, Nome ou Cidade..." className="max-w-md h-14 rounded-2xl border-none shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Rede Social / E-mail</TableHead>
                    <TableHead>Indicado Por</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-black text-primary">{user.id}</TableCell>
                      <TableCell className="font-bold">{user.name}</TableCell>
                      <TableCell>{user.whatsapp}</TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-500 font-medium">
                        {user.socialLink || "-"}
                      </TableCell>
                      <TableCell>
                        {user.indicatedBy ? (
                          <Badge variant="secondary" className="font-bold">{user.indicatedBy}</Badge>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-xl font-bold">Ver</Button>
                      </TableCell>
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
                              <img src={url} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{ad.city}</Badge></TableCell>
                      <TableCell>{ad.slotIndex === 0 ? "Topo" : ad.slotIndex === 1 ? "Lateral" : "Geral"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => deleteAd(ad.id)} className="text-red-500"><Trash2 size={18} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white text-center space-y-4">
                <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-red-600"><FileText size={32} /></div>
                <h3 className="text-xl font-black">Relatório em PDF</h3>
                <p className="text-slate-400 text-sm">Gere um documento pronto para impressão com ID, Rede Social e indicações.</p>
                <Button onClick={exportPDF} className="w-full h-16 font-black rounded-2xl bg-red-600 hover:bg-red-700">Exportar PDF</Button>
              </Card>
              <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white text-center space-y-4">
                <div className="bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-emerald-600"><TableIcon size={32} /></div>
                <h3 className="text-xl font-black">Base em CSV/Excel</h3>
                <p className="text-slate-400 text-sm">Exporte a base completa de dados para planilhas.</p>
                <Button onClick={exportCSV} variant="outline" className="w-full h-16 font-black rounded-2xl border-emerald-200 text-emerald-600 hover:bg-emerald-50">Exportar CSV</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-[3rem] p-10 max-w-md">
          {selectedUser && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <Badge className="bg-primary text-white h-8 px-4 rounded-full font-black mb-2">ID: {selectedUser.id}</Badge>
                <h2 className="text-2xl font-black text-slate-800">{selectedUser.name}</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cadastrado em {selectedUser.date}</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4 border border-slate-100">
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Rede Social / E-mail</span>
                  <span className="font-bold text-indigo-600 break-all ml-4 text-right">{selectedUser.socialLink || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Indicado por</span>
                  <span className="font-bold text-primary">{selectedUser.indicatedBy || "Ninguém"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">WhatsApp</span>
                  <span className="font-bold">{selectedUser.whatsapp}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Cidade/UF</span>
                  <span className="font-bold">{selectedUser.city}/{selectedUser.state}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">CPF</span>
                  <span className="font-bold">{selectedUser.cpf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Nascimento</span>
                  <span className="font-bold">{selectedUser.birthDate}</span>
                </div>
              </div>
              
              <Button onClick={() => setSelectedUser(null)} className="w-full h-14 rounded-2xl font-black">Fechar Detalhes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-10">
          <DialogTitle className="text-2xl font-black text-center mb-6">Novo Banner</DialogTitle>
          <div className="space-y-4">
            {newAd.imageUrls.map((url, i) => (
              <Input key={i} placeholder={`URL da Imagem ${i+1}`} value={url} onChange={(e) => {
                const n = [...newAd.imageUrls]; n[i] = e.target.value; setNewAd({...newAd, imageUrls: n});
              }} className="h-12 rounded-xl" />
            ))}
            <Input placeholder="Link de Destino" value={newAd.link} onChange={(e) => setNewAd({...newAd, link: e.target.value})} className="h-14 rounded-xl font-bold" />
            <Button onClick={handleCreateAd} className="w-full h-16 bg-primary rounded-xl font-black">PUBLICAR</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;