"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl: string;
  link: string;
  city: string; 
  slotIndex: number; 
  type?: 'image' | 'video';
  provider?: 'manual' | 'google' | 'youtube';
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
      const filtered = savedAds.filter((ad: Ad) => 
        ad.slotIndex === slotIndex && 
        (ad.city === 'Global' || (city && ad.city.toLowerCase() === city.toLowerCase()))
      ).map((ad: any) => ({ ...ad, provider: 'manual' }));

      if (filtered.length > 0) {
        setAds(filtered);
      } else {
        generateNetworkAds();
      }
      setImgError(false);
    };

    const generateNetworkAds = () => {
      const region = city || "Brasil";
      const keywords = ["business", "tech", "food", "store", "delivery"];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      // Gera anúncios simulando Google/YouTube com imagens dinâmicas do Unsplash
      const networkAds: Ad[] = [
        {
          id: `google-${slotIndex}`,
          imageUrl: `https://source.unsplash.com/featured/800x400?${randomKeyword},advertising&sig=${slotIndex}1`,
          link: 'https://www.google.com/adsense',
          city: region,
          slotIndex: slotIndex,
          type: 'image',
          provider: 'google'
        },
        {
          id: `youtube-${slotIndex}`,
          imageUrl: `https://source.unsplash.com/featured/800x400?commercial,video&sig=${slotIndex}2`,
          link: 'https://www.youtube.com/ads',
          city: region,
          slotIndex: slotIndex,
          type: 'video',
          provider: 'youtube'
        }
      ];
      setAds(networkAds);
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

  if (ads.length === 0) return null;

  const activeAd = ads[currentAdIndex];

  const handleImageError = () => {
    console.error("Erro ao carregar imagem da publicidade:", activeAd.imageUrl);
    setImgError(true);
    // Se for um anúncio manual com erro, remove da lista temporária para mostrar o automático
    if (activeAd.provider === 'manual') {
      const remaining = ads.filter(a => a.id !== activeAd.id);
      if (remaining.length === 0) {
        // Se era o único anúncio, forçamos os da rede
        const region = city || "Brasil";
        setAds([
          {
            id: 'fallback-google',
            imageUrl: 'https://source.unsplash.com/featured/800x400?advertising',
            link: 'https://google.com',
            city: region,
            slotIndex: slotIndex,
            provider: 'google'
          }
        ]);
      } else {
        setAds(remaining);
      }
    }
  };

  return (
    <a 
      href={activeAd.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block relative rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group bg-slate-100 border border-slate-100",
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4">
          <AlertCircle size={24} className="mb-2 opacity-20" />
          <span className="text-[10px] font-black uppercase tracking-widest">Carregando Publicidade...</span>
        </div>
      )}
      
      {/* Overlay Dinâmico */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-primary px-4 py-2 rounded-full shadow-lg">
            {activeAd.type === 'video' ? <PlayCircle size={14} /> : <ExternalLink size={14} />}
            {activeAd.provider === 'youtube' ? 'Ver no YouTube' : 'Ver Oferta'}
          </div>
          <span className="text-white/60 text-[8px] font-bold uppercase tracking-tighter">
            {activeAd.provider === 'manual' ? 'Anúncio Local' : `Rede ${activeAd.provider === 'google' ? 'Google' : 'YouTube'}`}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="bg-white/90 backdrop-blur-md text-[8px] text-slate-900 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm border border-slate-100">
          Publicidade
        </div>
        {city && (
          <div className="bg-primary/90 backdrop-blur-md text-[8px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
            {city}
          </div>
        )}
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
      
      {/* Ícone do Provedor */}
      <div className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors">
        <Megaphone size={14} />
      </div>
    </a>
  );
};

export default AdSlot;