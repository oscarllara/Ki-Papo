"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogOut, 
  Search,
  FileText,
  Table as TableIcon,
  Trash2,
  Plus,
  Upload,
  MessageCircle,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
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
  const [defaultMessage, setDefaultMessage] = useState('');
  
  const [newAd, setNewAd] = useState({
    imageUrls: ['', '', '', ''],
    link: 'https://',
    city: 'Global',
    slotIndex: 0,
    text: ''
  });

  // Usando refs individuais para evitar erros de renderização
  const fileRef0 = useRef<HTMLInputElement>(null);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);
  const fileRefs = [fileRef0, fileRef1, fileRef2, fileRef3];

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin-login');
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('kipapo_users') || '[]');
    const savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
    const savedMsg = localStorage.getItem('kipapo_default_message') || '';
    setUsers(savedUsers);
    setAds(savedAds);
    setDefaultMessage(savedMsg);
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

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const n = [...newAd.imageUrls];
        n[index] = base64String;
        setNewAd({...newAd, imageUrls: n});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMessage = () => {
    localStorage.setItem('kipapo_default_message', defaultMessage);
    toast({ title: "Mensagem Salva", description: "A mensagem aparecerá nas salas de chat." });
  };

  const handleCreateAd = () => {
    if (!newAd.link || newAd.link === 'https://') {
      toast({ variant: "destructive", title: "Link obrigatório", description: "O site de destino é obrigatório." });
      return;
    }
    const validImages = newAd.imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      toast({ variant: "destructive", title: "Imagem obrigatória", description: "Adicione pelo menos uma imagem ou URL." });
      return;
    }

    const adToAdd: Ad = {
      id: Date.now().toString(),
      imageUrls: validImages,
      link: newAd.link,
      city: newAd.city || 'Global',
      slotIndex: Number(newAd.slotIndex) || 0,
      text: newAd.text
    };

    const updatedAds = [...ads, adToAdd];
    localStorage.setItem('kipapo_ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    setIsAdDialogOpen(false);
    setNewAd({ imageUrls: ['', '', '', ''], link: 'https://', city: 'Global', slotIndex: 0, text: '' });
    toast({ title: "Anúncio Publicado" });
  };

  const deleteAd = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    localStorage.setItem('kipapo_ads', JSON.stringify(updated));
    setAds(updated);
    toast({ title: "Anúncio Removido" });
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
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 w-fit overflow-x-auto max-w-full">
            <TabsTrigger value="users" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest shrink-0">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest shrink-0">Publicidade</TabsTrigger>
            <TabsTrigger value="config" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest shrink-0">Configurações</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-2xl px-8 py-3 font-black text-[10px] uppercase tracking-widest shrink-0">Relatórios</TabsTrigger>
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
                      <TableCell className="max-w-[200px] truncate text-slate-500">{user.socialLink || "-"}</TableCell>
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
                          {(ad.imageUrls || []).map((url, i) => (
                            <div key={i} className="w-10 h-10 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                              <img src={url} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{ad.city}</Badge></TableCell>
                      <TableCell>{ad.slotIndex === 0 ? "Topo" : ad.slotIndex === 1 ? "Lateral" : "Lobby"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => deleteAd(ad.id)} className="text-red-500"><Trash2 size={18} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="config">
            <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-white space-y-8">
              <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-4 rounded-3xl text-primary"><Settings size={32} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800">Mensagem Padrão</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Aparece ao entrar na sala</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Texto de Boas-vindas</Label>
                 <Textarea 
                   value={defaultMessage} 
                   onChange={(e) => setDefaultMessage(e.target.value)} 
                   placeholder="Ex: Bem-vindos ao Bate Papo! Respeite as regras..." 
                   className="min-h-[160px] rounded-[2rem] border-slate-100 p-8 font-bold text-lg focus-visible:ring-primary/10 shadow-inner bg-slate-50/50"
                 />
                 <Button onClick={handleSaveMessage} className="h-16 px-10 rounded-2xl bg-primary font-black text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                    <MessageCircle className="mr-2" size={20} /> Salvar Mensagem
                 </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white text-center space-y-4">
                <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-red-600"><FileText size={32} /></div>
                <h3 className="text-xl font-black">Exportar PDF</h3>
                <Button onClick={() => {}} className="w-full h-16 font-black rounded-2xl bg-red-600">Exportar PDF</Button>
              </Card>
              <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white text-center space-y-4">
                <div className="bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-emerald-600"><TableIcon size={32} /></div>
                <h3 className="text-xl font-black">Exportar CSV</h3>
                <Button onClick={() => {}} variant="outline" className="w-full h-16 font-black rounded-2xl border-emerald-200 text-emerald-600">Exportar CSV</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[3.5rem] p-10 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black text-center tracking-tighter">Novo Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagem {i+1}</Label>
                   <div className="flex gap-2">
                      <Input 
                        placeholder="URL da Imagem" 
                        value={newAd.imageUrls[i]} 
                        onChange={(e) => {
                          const n = [...newAd.imageUrls]; n[i] = e.target.value; setNewAd({...newAd, imageUrls: n});
                        }} 
                        className="h-12 rounded-xl flex-1" 
                      />
                      <input 
                        type="file" 
                        ref={fileRefs[i]} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(i, e)} 
                      />
                      <Button variant="outline" size="icon" onClick={() => fileRefs[i].current?.click()} className="h-12 w-12 rounded-xl border-slate-100">
                        <Upload size={18} />
                      </Button>
                   </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Texto Abaixo do Banner (Opcional)</Label>
               <Input placeholder="Digite uma descrição para o banner..." value={newAd.text} onChange={(e) => setNewAd({...newAd, text: e.target.value})} className="h-14 rounded-2xl font-bold" />
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Site de Destino</Label>
               <Input placeholder="https://exemplo.com" value={newAd.link} onChange={(e) => setNewAd({...newAd, link: e.target.value})} className="h-14 rounded-2xl font-bold border-indigo-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cidade</Label>
                  <Input placeholder="Global ou Nome da Cidade" value={newAd.city} onChange={(e) => setNewAd({...newAd, city: e.target.value})} className="h-14 rounded-2xl font-bold" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posição</Label>
                  <select value={newAd.slotIndex} onChange={(e) => setNewAd({...newAd, slotIndex: Number(e.target.value)})} className="w-full h-14 rounded-2xl font-bold border-slate-200 px-4 bg-transparent outline-none">
                     <option value={0}>Topo (Bate Papo)</option>
                     <option value={1}>Lateral (Bate Papo)</option>
                     <option value={2}>Página Inicial (Lobby)</option>
                  </select>
               </div>
            </div>

            <Button onClick={handleCreateAd} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all active:scale-95">
               PUBLICAR ANÚNCIO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-[3rem] p-10 max-w-md">
          {selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <Badge className="bg-primary text-white h-8 px-4 rounded-full font-black mb-2">ID: {selectedUser.id}</Badge>
                <h2 className="text-2xl font-black text-slate-800">{selectedUser.name}</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between"><span className="text-[10px] font-black uppercase text-slate-400">Social/E-mail</span><span className="font-bold">{selectedUser.socialLink || "-"}</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-black uppercase text-slate-400">WhatsApp</span><span className="font-bold">{selectedUser.whatsapp}</span></div>
                <div className="flex justify-between"><span className="text-[10px] font-black uppercase text-slate-400">Cidade</span><span className="font-bold">{selectedUser.city}</span></div>
              </div>
              <Button onClick={() => setSelectedUser(null)} className="w-full h-14 rounded-2xl font-black">Fechar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;