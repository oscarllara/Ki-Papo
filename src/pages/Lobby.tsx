"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Globe
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Dados simulados de Estados e Cidades
const brazilianStates = [
  { sigla: "SP", nome: "São Paulo", cidades: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "Osasco"] },
  { sigla: "RJ", nome: "Rio de Janeiro", cidades: ["Rio de Janeiro", "Niterói", "Búzios", "Petrópolis", "Duque de Caxias"] },
  { sigla: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"] },
  { sigla: "BA", nome: "Bahia", cidades: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari"] },
  { sigla: "PR", nome: "Paraná", cidades: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"] },
  { sigla: "RS", nome: "Rio Grande do Sul", cidades: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas"] },
  { sigla: "PE", nome: "Pernambuco", cidades: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"] },
  { sigla: "CE", nome: "Ceará", cidades: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú"] },
  { sigla: "DF", nome: "Distrito Federal", cidades: ["Brasília"] },
  { sigla: "SC", nome: "Santa Catarina", cidades: ["Florianópolis", "Joinville", "Blumenau", "São José"] },
  { sigla: "GO", nome: "Goiás", cidades: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde"] },
  { sigla: "AM", nome: "Amazonas", cidades: ["Manaus", "Parintins", "Itacoatiara"] },
];

const Lobby = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [selectedState, setSelectedState] = useState(brazilianStates[0]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");

  const displayedStates = expanded ? brazilianStates : brazilianStates.slice(0, 7);

  const filteredCities = useMemo(() => {
    const allCitiesInState = selectedState.cidades;
    if (!citySearch.trim()) return allCitiesInState;
    return allCitiesInState.filter(city => 
      city.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [selectedState, citySearch]);

  const interests = [
    { id: 'sexo', name: 'Sexo', icon: <Flame size={20} />, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'amizade', name: 'Amizade', icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'namoro', name: 'Namoro', icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'evangelico', name: 'Relacionamento Evangélico', icon: <Cross size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const handleStateClick = (state: typeof brazilianStates[0]) => {
    setSelectedState(state);
    setSelectedCity(null);
    setCitySearch("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      <header className="p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Ki papo</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conectando Regiões</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <Settings size={22} />
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral de Estados */}
        <aside className="w-20 md:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-4 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
            <Globe size={14} className="hidden md:block" /> <span className="hidden md:block">Estados</span>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {displayedStates.map((state) => (
                <button
                  key={state.sigla}
                  onClick={() => handleStateClick(state)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
                    selectedState.sigla === state.sigla 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors",
                    selectedState.sigla === state.sigla ? "bg-white/20" : "bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  )}>
                    {state.sigla}
                  </div>
                  <span className="hidden md:block font-bold text-sm truncate">{state.nome}</span>
                  {selectedState.sigla === state.sigla && <ChevronRight size={16} className="ml-auto hidden md:block opacity-50" />}
                </button>
              ))}
              
              {!expanded && brazilianStates.length > 7 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-sm mt-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Plus size={18} />
                  </div>
                  <span className="hidden md:block">Ver todos</span>
                </button>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Área Principal */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header da Área de Conteúdo */}
          <div className="p-8 bg-white/50 backdrop-blur-sm border-b border-slate-100">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                    <MapPin className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {selectedCity ? selectedCity : selectedState.nome}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      {selectedCity ? `Salas disponíveis em ${selectedCity}` : `Escolha uma cidade em ${selectedState.nome}`}
                    </p>
                  </div>
                </div>

                {!selectedCity && (
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      placeholder={`Buscar cidade em ${selectedState.sigla}...`}
                      className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-slate-700 font-medium"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                    />
                  </div>
                )}
                
                {selectedCity && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCity(null)}
                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 h-12"
                  >
                    Mudar Cidade
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
              {!selectedCity ? (
                /* Seleção de Cidades */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCities.length > 0 ? (
                    filteredCities.map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-1 transition-all text-center group"
                      >
                        <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-50 transition-colors">
                          <MapPin size={20} className="text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <span className="font-bold text-slate-700 block truncate">{city}</span>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center space-y-4">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhuma cidade encontrada com "{citySearch}"</p>
                      <Button onClick={() => setCitySearch("")} variant="link" className="text-indigo-600">Limpar busca</Button>
                    </div>
                  )}
                </div>
              ) : (
                /* Seleção de Salas (Interesses) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {interests.map((interest) => (
                    <Card 
                      key={interest.id}
                      onClick={() => navigate(`/room/${selectedCity.toLowerCase().replace(' ', '-')}-${interest.id}`)}
                      className="group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all p-8 rounded-[2rem] hover:-translate-y-1 bg-white overflow-hidden relative"
                    >
                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", interest.bg, interest.color)}>
                          {interest.icon}
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          {Math.floor(Math.random() * 200)} online
                        </div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{interest.name}</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                          Conecte-se com pessoas de <span className="text-indigo-600 font-bold">{selectedCity}</span> interessadas em {interest.name.toLowerCase()}.
                        </p>
                      </div>
                      <div className="mt-8 flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Entrar na sala <ChevronRight size={14} />
                      </div>
                      
                      {/* Efeito Decorativo de Fundo */}
                      <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] transition-transform duration-500 group-hover:scale-150", interest.bg)} />
                    </Card>
                  ))}
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