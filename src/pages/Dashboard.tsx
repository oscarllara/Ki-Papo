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
  Settings,
  Clock,
  User,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Link as LinkIcon,
  UserPlus
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
  const [messageInterval, setMessageInterval] = useState('0');
  
  const [newAd, setNewAd] = useState({
    imageUrls: ['', '', '', ''],
    link: 'https://',
    city: 'Global',
    slotIndex: 0,
    text: ''
  });

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
    const config = JSON.parse(localStorage.getItem('kipapo_msg_config') || '{"content":"","interval":"0"}');
    
    setDefaultMessage(config.content || '');
    setMessageInterval(config.interval || '0');
    setUsers(savedUsers);
    setAds(savedAds);
    setIsLoaded(true);
  }, [navigate]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm) ||
    user.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) return null;

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
    const config = { content: defaultMessage, interval: messageInterval, updatedAt: Date.now() };
    localStorage.setItem('kipapo_msg_config', JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));
    toast({ title: "Configurações Salvas" });
  };

  const handleCreateAd = () => {
    if (!newAd.link || newAd.link === 'https://') {
      toast({ variant: "destructive", title: "Link obrigatório" });
      return;
    }
    const validImages = newAd.imageUrls.filter(url => url.trim() !== '');
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
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-sm gap-4">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="bg-primary/10 p-3 md:p-4 rounded-2xl md:rounded-3xl"><ShieldCheck className="text-primary" size={24} /></div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">Gestão Ki Papo</h1>
          </div>
          <Button onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/'); }} variant="ghost" className="text-red-500 font-bold gap-2 rounded-xl w-full md:w-auto">
            <LogOut size={16} /> Sair
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 rounded-2xl md:rounded-[2rem] mb-6 md:mb-8 flex overflow-x-auto scrollbar-hide">
            <TabsTrigger value="users" className="rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex-1 md:flex-none">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex-1 md:flex-none">Publicidade</TabsTrigger>
            <TabsTrigger value="config" className="rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex-1 md:flex-none">Configurações</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest flex-1 md:flex-none">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-none shadow-xl md:shadow-2xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-white">
              <div className="p-4 md:p-8 bg-slate-50/50">
                <Input placeholder="Buscar por ID, Nome ou Cidade..." className="w-full max-w-md h-12 md:h-14 rounded-xl md:rounded-2xl border-none shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">WhatsApp</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-black text-primary text-xs md:text-sm">{user.id}</TableCell>
                        <TableCell className="font-bold text-xs md:text-sm">{user.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs md:text-sm">{user.whatsapp}</TableCell>
                        <TableCell className="text-xs md:text-sm">{user.city}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)} className="rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs">Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card className="border-none shadow-xl md:shadow-2xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-white">
              <div className="p-4 md:p-8 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 border-b gap-4">
                <h3 className="text-lg md:text-xl font-black">Banners de Publicidade</h3>
                <Button onClick={() => setIsAdDialogOpen(true)} className="rounded-xl md:rounded-2xl bg-primary h-12 md:h-14 font-black px-6 w-full md:w-auto"><Plus size={18} className="mr-2" /> Novo Banner</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Banner</TableHead><TableHead>Cidade</TableHead><TableHead>Posição</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {ads.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <div className="flex -space-x-2 md:-space-x-3">
                            {(ad.imageUrls || []).map((url, i) => (
                              <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                <img src={url} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{ad.city}</Badge></TableCell>
                        <TableCell className="text-xs">{ad.slotIndex === 0 ? "Topo" : ad.slotIndex === 1 ? "Lateral" : "Lobby"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" onClick={() => deleteAd(ad.id)} className="text-red-500"><Trash2 size={18} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="config">
            <Card className="border-none shadow-xl md:shadow-2xl rounded-2xl md:rounded-[3rem] p-6 md:p-14 bg-white space-y-8 md:space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="bg-primary/10 p-3 md:p-5 rounded-2xl md:rounded-[2rem] text-primary shadow-inner"><Settings size={24} md:size={36} /></div>
                   <div>
                      <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">Mensagem Padrão</h3>
                      <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Aparece em todas as salas</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <Clock className="text-slate-300" size={20} />
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Repetir (min)</Label>
                    <Input type="number" value={messageInterval} onChange={(e) => setMessageInterval(e.target.value)} className="h-8 w-16 border-none bg-transparent font-black text-base p-0 focus-visible:ring-0" min="0" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <Textarea value={defaultMessage} onChange={(e) => setDefaultMessage(e.target.value)} placeholder="Ex: Sejam bem-vindos ao Ki Papo!..." className="min-h-[150px] md:min-h-[200px] rounded-2xl md:rounded-[2.5rem] border-slate-100 p-6 md:p-10 font-bold text-base md:text-xl focus-visible:ring-primary/10 shadow-inner bg-slate-50/50 leading-relaxed" />
                 <Button onClick={handleSaveMessage} className="w-full md:w-auto h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl bg-primary font-black text-lg md:text-xl text-white shadow-xl shadow-primary/20 gap-3">
                    <MessageCircle size={20} /> Salvar Mensagem
                 </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <Card className="p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-none shadow-lg bg-white text-center space-y-4">
                <div className="bg-red-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto text-red-600"><FileText size={24} md:size={32} /></div>
                <h3 className="text-lg md:text-xl font-black">Exportar PDF</h3>
                <Button onClick={() => {}} className="w-full h-14 md:h-16 font-black rounded-xl md:rounded-2xl bg-red-600">Exportar PDF</Button>
              </Card>
              <Card className="p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-none shadow-lg bg-white text-center space-y-4">
                <div className="bg-emerald-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto text-emerald-600"><TableIcon size={24} md:size={32} /></div>
                <h3 className="text-lg md:text-xl font-black">Exportar CSV</h3>
                <Button onClick={() => {}} variant="outline" className="w-full h-14 md:h-16 font-black rounded-xl md:rounded-2xl border-emerald-200 text-emerald-600">Exportar CSV</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-md rounded-2xl md:rounded-[3rem] p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4 md:mb-6">
            <DialogTitle className="text-2xl md:text-3xl font-black text-center tracking-tighter">Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                <div className="bg-primary/10 p-2 md:p-3 rounded-lg md:rounded-xl text-primary"><User size={20} /></div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Nome Completo</p>
                  <p className="font-bold text-sm md:text-base text-slate-900">{selectedUser.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-slate-400"><Calendar size={12} /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Nascimento</span></div>
                  <p className="font-bold text-sm md:text-base text-slate-900">{selectedUser.birthDate}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-slate-400"><CreditCard size={12} /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">CPF</span></div>
                  <p className="font-bold text-sm md:text-base text-slate-900">{selectedUser.cpf}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-slate-400"><Phone size={12} /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">WhatsApp</span></div>
                  <p className="font-bold text-sm md:text-base text-slate-900">{selectedUser.whatsapp}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-slate-400"><MapPin size={12} /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Localização</span></div>
                  <p className="font-bold text-sm md:text-base text-slate-900">{selectedUser.city} - {selectedUser.state}</p>
                </div>
              </div>

              <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl">
                <div className="flex items-center gap-2 mb-1 text-slate-400"><LinkIcon size={12} /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Rede Social / E-mail</span></div>
                <p className="font-bold text-xs md:text-sm text-slate-900 break-all">{selectedUser.socialLink || "-"}</p>
              </div>

              <Button onClick={() => setSelectedUser(null)} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 font-black text-white">Fechar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl rounded-2xl md:rounded-[3.5rem] p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4 md:mb-6">
            <DialogTitle className="text-2xl md:text-3xl font-black text-center tracking-tighter">Novo Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                   <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Imagem {i+1}</Label>
                   <div className="flex gap-2">
                      <Input placeholder="URL" value={newAd.imageUrls[i]} onChange={(e) => { const n = [...newAd.imageUrls]; n[i] = e.target.value; setNewAd({...newAd, imageUrls: n}); }} className="h-10 md:h-12 rounded-lg md:rounded-xl flex-1" />
                      <input type="file" ref={fileRefs[i]} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(i, e)} />
                      <Button variant="outline" size="icon" onClick={() => fileRefs[i].current?.click()} className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl border-slate-100"><Upload size={16} /></Button>
                   </div>
                </div>
              ))}
            </div>
            <Input placeholder="Descrição do banner..." value={newAd.text} onChange={(e) => setNewAd({...newAd, text: e.target.value})} className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold" />
            <Input placeholder="https://exemplo.com" value={newAd.link} onChange={(e) => setNewAd({...newAd, link: e.target.value})} className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold border-indigo-100" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input placeholder="Cidade ou Global" value={newAd.city} onChange={(e) => setNewAd({...newAd, city: e.target.value})} className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold" />
               <select value={newAd.slotIndex} onChange={(e) => setNewAd({...newAd, slotIndex: Number(e.target.value)})} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-bold border-slate-200 px-4 bg-transparent outline-none">
                  <option value={0}>Topo (Bate Papo)</option>
                  <option value={1}>Lateral (Bate Papo)</option>
                  <option value={2}>Página Inicial (Lobby)</option>
               </select>
            </div>
            <Button onClick={handleCreateAd} className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl shadow-xl shadow-primary/20 transition-all active:scale-95">PUBLICAR</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;