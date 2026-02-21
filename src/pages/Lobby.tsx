"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MapPin, Heart, Users, Cross, MessageSquare, Flame } from 'lucide-react';
import { cn } from "@/lib/utils";

const Lobby = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('São Paulo');

  const regions = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador", "Brasília", "Recife"];
  
  const interests = [
    { id: 'sexo', name: 'Sexo', icon: <Flame size={20} />, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'amizade', name: 'Amizade', icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'namoro', name: 'Namoro', icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'evangelico', name: 'Relacionamento Evangélico', icon: <Cross size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      <header className="p-6 bg-white border-b border-slate-100">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">Ki papo</h1>
        <p className="text-sm text-slate-500">Escolha onde quer conversar hoje</p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Cidades / Regiões */}
        <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col">
          <div className="p-4 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <MapPin size={14} /> Região
          </div>
          <ScrollArea className="flex-1 px-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl text-sm font-semibold transition-all mb-1",
                  selectedRegion === region ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {region}
              </button>
            ))}
          </ScrollArea>
        </aside>

        {/* Salas por Interesse */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Salas em <span className="text-indigo-600">{selectedRegion}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interests.map((interest) => (
                <Card 
                  key={interest.id}
                  onClick={() => navigate(`/room/${selectedRegion.toLowerCase()}-${interest.id}`)}
                  className="group cursor-pointer border-none shadow-sm hover:shadow-md transition-all p-6 rounded-3xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", interest.bg, interest.color)}>
                      {interest.icon}
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      {Math.floor(Math.random() * 500)} online
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{interest.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Conheça pessoas interessadas em {interest.name.toLowerCase()} em {selectedRegion}.</p>
                  <div className="mt-4 flex items-center text-indigo-600 font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Entrar na sala <MessageSquare size={16} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lobby;