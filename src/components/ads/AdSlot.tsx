"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl?: string;
  imageUrls?: string[]; 
  link: string;
  city: string; 
  slotIndex: number; 
  type?: 'image' | 'video';
  text?: string; // Novo campo para texto abaixo da imagem
}

interface AdSlotProps {
  city?: string | null;
  slotIndex: number;
  className?: string;
}

const AdSlot = ({ city, slotIndex, className }: AdSlotProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentImageSubIndex, setCurrentImageSubIndex] = useState(0);
  const [ads, setAds] = useState<Ad[]>([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadAds = () => {
      let savedAds = JSON.parse(localStorage.getItem('kipapo_ads') || '[]');
      
      const filtered = savedAds.filter((ad: Ad) => {
        if (ad.slotIndex !== slotIndex) return false;
        if (ad.city.toLowerCase() === 'global') return true;
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
    if (ads.length === 0) return;
    
    const interval = setInterval(() => {
      const activeAd = ads[currentAdIndex];
      const images = activeAd.imageUrls || (activeAd.imageUrl ? [activeAd.imageUrl] : []);
      
      if (images.length > 1 && currentImageSubIndex < images.length - 1) {
        setCurrentImageSubIndex(prev => prev + 1);
      } else {
        setCurrentImageSubIndex(0);
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }
      setImgError(false);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [ads, currentAdIndex, currentImageSubIndex]);

  if (ads.length === 0) return null;

  const activeAd = ads[currentAdIndex];
  const allImages = activeAd.imageUrls || (activeAd.imageUrl ? [activeAd.imageUrl] : []);
  
  const getDisplayImage = () => {
    if (allImages.length > 0 && allImages[currentImageSubIndex]) {
      return allImages[currentImageSubIndex];
    }
    try {
      const domain = new URL(activeAd.link).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return 'https://via.placeholder.com/800x400?text=Ki+Papo+Publicidade';
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <a 
        href={activeAd.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group bg-slate-100 border border-slate-200 aspect-[2/1]"
      >
        <img 
          src={getDisplayImage()} 
          alt="Publicidade" 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="bg-white text-primary text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2">
            Ver Site <ExternalLink size={12} />
          </div>
        </div>

        <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Anúncio
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-4 flex gap-1">
            {allImages.map((_, i) => (
              <div key={i} className={cn("h-1 rounded-full transition-all", i === currentImageSubIndex ? "w-4 bg-white" : "w-1 bg-white/40")} />
            ))}
          </div>
        )}
      </a>
      {activeAd.text && (
        <p className="text-center text-xs font-bold text-slate-500 px-4 line-clamp-2">
          {activeAd.text}
        </p>
      )}
    </div>
  );
};

export default AdSlot;