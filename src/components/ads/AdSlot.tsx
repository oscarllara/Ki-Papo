"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  city: string; // Pode ser 'Global' ou cidades separadas por vírgula
  slotIndex: number; 
  type?: 'image' | 'video';
}

interface AdSlotProps {
  city?: string | null;
  slotIndex: number;
  className?: string;
}

const AdSlot = ({ city, slotIndex, className }: AdSlotProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<Ad[]>([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadAds = () => {
      const savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
      
      const filtered = savedAds.filter((ad: Ad) => {
        // Verifica se o slot coincide
        if (ad.slotIndex !== slotIndex) return false;

        // Se for Global, sempre mostra
        if (ad.city.toLowerCase() === 'global') return true;

        // Se houver uma cidade selecionada, verifica se ela está na lista de cidades do anúncio
        if (city) {
          const targetCities = ad.city.split(',').map(c => c.trim().toLowerCase());
          return targetCities.includes(city.toLowerCase());
        }

        return false;
      });

      setAds(filtered);
      setImgError(false);
    };

    loadAds();
    window.addEventListener('storage', loadAds);
    return () => window.removeEventListener('storage', loadAds);
  }, [city, slotIndex]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setImgError(false);
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [ads]);

  // Regra solicitada: Se não houver propaganda, não incluir o banner
  if (ads.length === 0) return null;

  const activeAd = ads[currentAdIndex];

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <a 
      href={activeAd.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block relative rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group bg-slate-50 border border-slate-100",
        className
      )}
    >
      {!imgError ? (
        <img 
          src={activeAd.imageUrl} 
          alt="Publicidade" 
          onError={handleImageError}
          className="w-full h-full object-cover animate-in fade-in duration-700"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 p-4">
          <AlertCircle size={20} className="mb-2 opacity-20" />
          <span className="text-[9px] font-black uppercase tracking-widest">Publicidade Indisponível</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-lg w-fit">
          {activeAd.type === 'video' ? <PlayCircle size={14} /> : <ExternalLink size={14} />}
          Acessar Oferta
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <div className="bg-white/90 backdrop-blur-md text-[8px] text-slate-900 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm border border-slate-100">
          Publicidade
        </div>
      </div>

      {ads.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5">
          {ads.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500", 
                i === currentAdIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
              )} 
            />
          ))}
        </div>
      )}
    </a>
  );
};

export default AdSlot;