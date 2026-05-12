"use client";

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
}

const Logo = ({ className, size = 'md', showSlogan = false }: LogoProps) => {
  const sizes = {
    sm: { box: 'w-10 h-10 rounded-xl', text: 'text-2xl', icon: 12, slogan: 'text-[8px]' },
    md: { box: 'w-14 h-14 rounded-2xl', text: 'text-4xl', icon: 16, slogan: 'text-[10px]' },
    lg: { box: 'w-20 h-20 rounded-[2rem]', text: 'text-6xl', icon: 20, slogan: 'text-xs' },
    xl: { box: 'w-28 h-28 rounded-[2.5rem]', text: 'text-8xl', icon: 28, slogan: 'text-sm' },
  };

  const current = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-3">
        {/* O Quadrado "Ki" Metálico */}
        <div className={cn(
          "relative flex items-center justify-center shadow-2xl transform transition-transform hover:scale-105 duration-500",
          "bg-gradient-to-br from-[#4a7eb5] via-[#2b5a8f] to-[#1e3f66]",
          "border-b-4 border-r-4 border-black/20",
          current.box
        )}>
          <span className="text-white font-black tracking-tighter drop-shadow-md">Ki</span>
          
          {/* O Balãozinho Verde Lima */}
          <div className="absolute -top-1 -right-1 bg-[#9ACD32] p-1 rounded-lg shadow-lg border-2 border-white animate-bounce-slow">
            <MessageSquare size={current.icon} className="text-[#1e3f66] fill-current" />
          </div>
          
          {/* Efeito de Brilho/Vidro */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 rounded-inherit pointer-events-none" />
        </div>

        {/* O Texto "Papo" em Verde Lima */}
        <h1 className={cn(
          "font-black tracking-tighter text-[#9ACD32] drop-shadow-sm",
          current.text
        )}>
          Papo
        </h1>
      </div>

      {showSlogan && (
        <p className={cn(
          "font-black text-slate-400 uppercase tracking-[0.3em] mt-1",
          current.slogan
        )}>
          Conexões que falam o seu idioma
        </p>
      )}
    </div>
  );
};

export default Logo;