"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  city: string; // 'Global' ou nome da cidade
  slotIndex: number; // 0, 1, 2, 3
}

interface AdSlotProps {
  city?: string | null;
  slotIndex: number;
  className?: string;
}

const AdSlot = ({ city, slotIndex, className }: AdSlotProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const loadAds = () => {
      const savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
      // Filtra anúncios para a cidade atual ou globais, para este slot específico
      const filtered = savedAds.filter((ad: Ad) => 
        ad.slotIndex === slotIndex && 
        (ad.city === 'Global' || (city && ad.city.toLowerCase() === city.toLowerCase()))
      );
      setAds(filtered);
    };

    loadAds();
    // Escuta mudanças no localStorage (caso o admin mude algo)
    window.addEventListener('storage', loadAds);
    return () => window.removeEventListener('storage', loadAds);
  }, [city, slotIndex]);

  // Efeito de rotação/dinamismo
  useEffect(() => {
    if (ads.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [ads]);

  // Se não houver anúncio manual, simula/prepara o espaço para Google Ads
  if (ads.length === 0) {
    return (
      <div className={cn(
        "bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-6 text-slate-400 group overflow-hidden relative min-h-[120px]",
        className
      )}>
        <div className="absolute top-2 right-4 text-[8px] font-black uppercase tracking-widest opacity-30">Anúncio Google</div>
        <Megaphone size={24} className="mb-2 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-center">
          Propaganda Local <br/> 
          <span className="text-primary/40">{city || 'Sua Região'}</span>
        </p>
        {/* Aqui entraria o script do Google AdSense futuramente */}
      </div>
    );
  }

  const activeAd = ads[currentAdIndex];

  return (
    <a 
      href={activeAd.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block relative rounded-[2rem] overflow-hidden shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] group",
        className
      )}
    >
      <img 
        src={activeAd.imageUrl} 
        alt="Publicidade" 
        className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
        <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
          Saiba Mais <ExternalLink size={12} />
        </div>
      </div>
      <div className="absolute top-2 right-4 bg-white/20 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase">
        Publicidade
      </div>
      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {ads.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 rounded-full transition-all", 
                i === currentAdIndex ? "w-4 bg-white" : "w-1 bg-white/40"
              )} 
            />
          ))}
        </div>
      )}
    </a>
  );
};

export default AdSlot;