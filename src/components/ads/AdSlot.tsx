"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Ad {
  id: string;
  imageUrl?: string;
  imageUrls?: string[]; 
  link: string;
  city: string; 
  slotIndex: number; 
  type?: 'image' | 'video';
  text?: string;
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
    return 'https://via.placeholder.com/800x400?text=Ki+Papo+Publicidade';
  };

  // Ajuste de proporção baseado no slot
  const aspectClass = slotIndex === 1 ? "aspect-[3/4]" : "aspect-[21/9] md:aspect-[4/1]";

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <a 
        href={activeAd.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "block relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group bg-slate-100 border border-slate-200",
          aspectClass
        )}
      >
        <img 
          src={getDisplayImage()} 
          alt="Publicidade" 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <div className="bg-white text-primary text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5">
            Ver Site <ExternalLink size={10} />
          </div>
        </div>

        <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm text-[7px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Anúncio
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-3 flex gap-1">
            {allImages.map((_, i) => (
              <div key={i} className={cn("h-0.5 rounded-full transition-all", i === currentImageSubIndex ? "w-3 bg-white" : "w-1 bg-white/40")} />
            ))}
          </div>
        )}
      </a>
      {activeAd.text && (
        <p className="text-center text-[10px] md:text-xs font-bold text-slate-500 px-2 line-clamp-1">
          {activeAd.text}
        </p>
      )}
    </div>
  );
};

export default AdSlot;