"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Heart, 
  Users, 
  Cross, 
  MessageSquare, 
  Flame, 
  Settings, 
  Plus, 
  ChevronRight,
  Search,
  Globe,
  Loader2,
  Music
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { fetchStates, fetchCitiesByState, IBGEState, IBGECity } from '@/services/ibge';
import AdSlot from '@/components/ads/AdSlot';

const Lobby = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedState, setSelectedState] = useState<IBGEState | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [expandedStates, setExpandedStates] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchStates();
        setStates(data);
        if (data.length > 0) setSelectedState(data[0]); 
      } catch (error) {
        console.error("Erro ao carregar estados", error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState) return;
      setLoadingCities(true);
      try {
        const data = await fetchCitiesByState(selectedState.sigla);
        setCities(data);
        setSelectedCity(null);
        setCitySearch("");
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedState]);

  const displayedStates = expandedStates ? states : states.slice(0, 8);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const search = normalize(citySearch);
    return cities.filter(city => normalize(city.nome).includes(search));
  }, [cities, citySearch]);

  const interests = [
    { id: 'network', name: 'Network', icon: <Globe size={20} />, color: 'text-[#2377bb]', bg: 'bg-blue-50' },
    { id: 'amizade', name: 'Amizade', icon: <Users size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'namoro', name: 'Namoro', icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'evangelico', name: 'Evangélico', icon: <Cross size={20} />, color: 'text-[#a3cc16]', bg: 'bg-[#a3cc16]/10' },
    { id: 'role', name: 'Rolê', icon: <Music size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'sexo', name: 'Sexo', icon: <Flame size={20} />, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden font-sans">
      <header className="px-8 h-20 bg-white border-b border-slate-100 flex justify-between items-center z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-xl text-white"><MessageSquare size={24} className="fill-current" /></div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary tracking-tighter">Ki</span>
            <span className="text-2xl font-black text-secondary tracking-tighter">Papo</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => navigate('/admin-login')} className="rounded-2xl text-slate-300 hover:text-primary transition-colors h-12 w-12">
            <Settings size={22} />
          </Button>
        </div>
      </header>

      {/* Espaço de Anúncio Topo (Slot 0) */}
      <div className="px-10 py-4 bg-white border-b border-slate-50 shrink-0">
        <AdSlot city={selectedCity} slotIndex={0} className="h-20 max-w-6xl mx-auto" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-24 md:w-72 bg-white border-r border-slate-100 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-200/20">
          <div className="p-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Estado</p>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-6">
              {loadingStates ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-2xl" />) : (
                displayedStates.map((state) => (
                  <button key={state.sigla} onClick={() => setSelectedState(state)} className={cn("w-full flex items-center gap-4 p-4 rounded-[1.25rem] transition-all group", selectedState?.sigla === state.sigla ? "bg-primary text-white shadow-xl scale-[1.02]" : "text-slate-600 hover:bg-slate-50")}>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0", selectedState?.sigla === state.sigla ? "bg-white/20" : "bg-slate-100")}>{state.sigla}</div>
                    <span className="hidden md:block font-bold text-sm truncate">{state.nome}</span>
                  </button>
                ))
              )}
            </div>
            {/* Espaço de Anúncio Lateral (Slot 1) */}
            <div className="mt-8 pb-10">
              <AdSlot city={selectedCity} slotIndex={1} className="h-64 rounded-3xl" />
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-10 bg-white/40 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="bg-primary/10 p-5 rounded-[2rem]"><MapPin className="text-primary" size={32} /></div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{selectedCity || selectedState?.nome || "Carregando..." }</h2>
                    <p className="text-slate-400 font-bold text-sm mt-2">{selectedCity ? `Salas em ${selectedCity}` : `Selecione em ${selectedState?.nome}`}</p>
                  </div>
                </div>
                {!selectedCity && (
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <Input placeholder="Pesquisar cidade..." className="pl-14 h-16 rounded-[1.5rem] border-none bg-white shadow-lg" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
                  </div>
                )}
                {selectedCity && <Button variant="outline" onClick={() => setSelectedCity(null)} className="rounded-2xl h-14 font-bold px-6">Voltar</Button>}
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-10 bg-slate-50/50">
            <div className="max-w-6xl mx-auto space-y-10">
              {loadingCities ? <div className="flex flex-col items-center py-32"><Loader2 className="animate-spin text-primary" size={48} /></div> : !selectedCity ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredCities.map(city => (
                    <button key={city.id} onClick={() => setSelectedCity(city.nome)} className="p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:border-secondary transition-all text-center group active:scale-95">
                      <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/10"><MapPin size={24} className="text-slate-300 group-hover:text-secondary" /></div>
                      <span className="font-black text-slate-800 block truncate text-sm">{city.nome}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {interests.map((interest) => (
                      <Card key={interest.id} onClick={() => navigate(`/room/${selectedCity?.toLowerCase().replace(/\s+/g, '-')}-${interest.id}`)} className="group cursor-pointer border-none shadow-xl hover:shadow-2xl transition-all p-10 rounded-[2.5rem] bg-white relative overflow-hidden active:scale-[0.98]">
                        <div className="flex items-center justify-between mb-8">
                          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner", interest.bg, interest.color)}>{interest.icon}</div>
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] px-4 py-2 uppercase">Ao Vivo</Badge>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{interest.name}</h3>
                        <p className="text-sm text-slate-400 mt-4 font-bold">Pessoas de <span className="text-primary">{selectedCity}</span> agora.</p>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Espaço de Anúncio Entre Conteúdo (Slot 3) */}
                  <div className="py-6">
                    <AdSlot city={selectedCity} slotIndex={3} className="h-40 w-full" />
                  </div>
                </>
              )}
            </div>
            
            {/* Espaço de Anúncio Rodapé (Slot 2) */}
            <div className="max-w-6xl mx-auto mt-10 pb-10">
              <AdSlot city={selectedCity} slotIndex={2} className="h-24 w-full" />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default Lobby;