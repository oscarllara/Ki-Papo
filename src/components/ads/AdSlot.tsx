"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, PlayCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  city: string; 
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
  const [isNetworkAd, setIsNetworkAd] = useState(false);

  useEffect(() => {
    const loadAds = () => {
      const savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
      const filtered = savedAds.filter((ad: Ad) => 
        ad.slotIndex === slotIndex && 
        (ad.city === 'Global' || (city && ad.city.toLowerCase() === city.toLowerCase()))
      );

      if (filtered.length > 0) {
        setAds(filtered);
        setIsNetworkAd(false);
      } else {
        // Se não houver anúncio manual, gera um anúncio automático da rede (Google/YouTube)
        generateNetworkAd();
      }
    };

    const generateNetworkAd = () => {
      const region = city || "sua região";
      const networkAds: Ad[] = [
        {
          id: 'google-auto-1',
          imageUrl: `https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80`,
          link: 'https://google.com/ads',
          city: region,
          slotIndex: slotIndex,
          type: 'image'
        },
        {
          id: 'youtube-auto-1',
          imageUrl: `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80`,
          link: 'https://youtube.com',
          city: region,
          slotIndex: slotIndex,
          type: 'video'
        }
      ];
      setAds(networkAds);
      setIsNetworkAd(true);
    };

    loadAds();
    window.addEventListener('storage', loadAds);
    return () => window.removeEventListener('storage', loadAds);
  }, [city, slotIndex]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads]);

  if (ads.length === 0) return null;

  const activeAd = ads[currentAdIndex];

  return (
    <a 
      href={activeAd.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block relative rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] group bg-slate-100",
        className
      )}
    >
      <img 
        src={activeAd.imageUrl} 
        alt="Publicidade" 
        className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
      />
      
      {/* Overlay de Conteúdo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-lg">
            {activeAd.type === 'video' ? <PlayCircle size={14} /> : <ExternalLink size={14} />}
            {activeAd.type === 'video' ? 'Assistir Agora' : 'Visitar Site'}
          </div>
          <span className="text-white/60 text-[8px] font-bold uppercase tracking-tighter">
            Patrocinado por Google/Rede
          </span>
        </div>
      </div>

      {/* Badge de Identificação */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="bg-white/90 backdrop-blur-md text-[8px] text-slate-900 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
          {isNetworkAd ? 'Rede Automática' : 'Anúncio Local'}
        </div>
        <div className="bg-primary/90 backdrop-blur-md text-[8px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
          {city || 'Brasil'}
        </div>
      </div>

      {/* Indicador de Rotação */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5">
          {ads.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500", 
                i === currentAdIndex ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/30"
              )} 
            />
          ))}
        </div>
      )}
      
      {/* Selo Google/YT discreto */}
      {isNetworkAd && (
        <div className="absolute top-4 right-4 text-white/40">
          <Megaphone size={14} />
        </div>
      )}
    </a>
  );
};

export default AdSlot;