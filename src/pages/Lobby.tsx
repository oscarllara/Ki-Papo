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
  Search,
  Globe,
  Loader2,
  Music,
  ChevronRight
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

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchStates();
        setStates(data);
        const homeStateSigla = sessionStorage.getItem('kipapo_home_state');
        if (homeStateSigla) {
          const found = data.find(s => s.sigla === homeStateSigla);
          if (found) setSelectedState(found);
          else if (data.length > 0) setSelectedState(data[0]);
          sessionStorage.removeItem('kipapo_home_state');
        } else if (data.length > 0) {
          setSelectedState(data[0]);
        }
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
        const homeCity = sessionStorage.getItem('kipapo_home_city');
        if (homeCity) {
          setSelectedCity(homeCity);
          sessionStorage.removeItem('kipapo_home_city');
        } else {
          setSelectedCity(null);
        }
        setCitySearch("");
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedState]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const search = normalize(citySearch);
    return cities.filter(city => normalize(city.nome).includes(search));
  }, [cities, citySearch]);

  const interests = [
    { id: 'network', name: 'Network', icon: <Globe size={24} />, color: 'text-primary', bg: 'bg-primary/5' },
    { id: 'amizade', name: 'Amizade', icon: <Users size={24} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'namoro', name: 'Namoro', icon: <Heart size={24} />, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'evangelico', name: 'Evangélico', icon: <Cross size={24} />, color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'role', name: 'Rolê', icon: <Music size={24} />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'sexo', name: 'Sexo', icon: <Flame size={24} />, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col h-screen overflow-hidden font-sans">
      <header className="px-8 h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-[1.25rem] text-white shadow-xl shadow-primary/20"><MessageSquare size={24} className="fill-current" /></div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary tracking-tighter">Ki</span>
            <span className="text-3xl font-black text-secondary tracking-tighter">Papo</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate('/admin-login')} className="rounded-2xl text-slate-300 hover:text-primary h-12 w-12 hover:bg-primary/5">
            <Settings size={22} />
          </Button>
          <div className="h-10 w-px bg-slate-100 mx-2" />
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Localização Atual</span>
             <span className="text-sm font-bold text-slate-700">{selectedCity || "Selecionando..."}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-24 md:w-80 bg-white border-r border-slate-100 flex flex-col shrink-0 z-10 shadow-2xl shadow-slate-200/20">
          <div className="p-8 pb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Filtrar por Estado</h3>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-1 pb-10">
              {loadingStates ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl mb-2" />) : (
                states.map((state) => (
                  <button 
                    key={state.sigla} 
                    onClick={() => setSelectedState(state)} 
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative", 
                      selectedState?.sigla === state.sigla 
                        ? "bg-primary text-white shadow-2xl shadow-primary/30 translate-x-1" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors", 
                      selectedState?.sigla === state.sigla ? "bg-white/20" : "bg-slate-100"
                    )}>{state.sigla}</div>
                    <span className="hidden md:block font-black text-sm truncate uppercase tracking-tight">{state.nome}</span>
                    {selectedState?.sigla === state.sigla && <ChevronRight size={16} className="absolute right-4 opacity-50" />}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 md:p-12 bg-white/50 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="bg-primary/10 p-6 rounded-[2.5rem] shadow-inner text-primary"><MapPin size={36} /></div>
                  <div className="space-y-1">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                      {selectedCity || selectedState?.nome || "Escolha uma Cidade"}
                    </h2>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                      {selectedCity ? `Salas disponíveis para conversa` : `Selecione seu município em ${selectedState?.nome}`}
                    </p>
                  </div>
                </div>
                {!selectedCity && (
                  <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <Input 
                      placeholder="Buscar sua cidade..." 
                      className="pl-16 h-20 rounded-[2rem] border-none bg-white shadow-2xl shadow-slate-200/50 text-lg font-bold" 
                      value={citySearch} 
                      onChange={(e) => setCitySearch(e.target.value)} 
                    />
                  </div>
                )}
                {selectedCity && (
                  <Button variant="outline" onClick={() => setSelectedCity(null)} className="rounded-2xl h-16 font-black px-8 border-slate-200 hover:bg-slate-50 uppercase tracking-widest text-[11px] gap-2">
                    <RefreshCw size={16} /> Trocar Cidade
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              {loadingCities ? (
                <div className="flex flex-col items-center py-40">
                  <Loader2 className="animate-spin text-primary mb-6" size={56} />
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Mapeando Salas...</p>
                </div>
              ) : !selectedCity ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                  {filteredCities.map(city => (
                    <button 
                      key={city.id} 
                      onClick={() => setSelectedCity(city.nome)} 
                      className="p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:scale-[1.03] transition-all duration-500 text-center group active:scale-95 border border-transparent hover:border-secondary/20"
                    >
                      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/10 transition-colors">
                        <MapPin size={28} className="text-slate-300 group-hover:text-secondary transition-colors" />
                      </div>
                      <span className="font-black text-slate-800 block truncate text-base">{city.nome}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase mt-2 block tracking-widest">Entrar na Sala</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-12 pb-20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {interests.map((interest) => (
                      <Card 
                        key={interest.id} 
                        onClick={() => navigate(`/room/${selectedCity?.toLowerCase().replace(/\s+/g, '-')}-${interest.id}`)} 
                        className="group cursor-pointer border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 p-12 rounded-[3.5rem] bg-white relative overflow-hidden active:scale-[0.98] border border-transparent hover:border-primary/10"
                      >
                        <div className="flex items-center justify-between mb-10">
                          <div className={cn("w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500", interest.bg, interest.color)}>
                            {interest.icon}
                          </div>
                          <div className="flex flex-col items-end">
                             <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] px-3 py-1.5 uppercase tracking-widest shadow-lg shadow-emerald-500/20">AO VIVO</Badge>
                             <span className="text-[9px] font-black text-slate-300 mt-2 uppercase">24 Online</span>
                          </div>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{interest.name}</h3>
                        <p className="text-sm text-slate-400 mt-4 font-bold leading-relaxed">Pessoas reais de <span className="text-primary">{selectedCity}</span> prontas para um papo.</p>
                      </Card>
                    ))}
                  </div>
                  <AdSlot city={selectedCity} slotIndex={2} className="h-44 w-full rounded-[3rem]" />
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default Lobby;