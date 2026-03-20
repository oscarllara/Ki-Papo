"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Ruler, Weight, Glasses, User as UserIcon, Palette, Check, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface AvatarTraits {
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  glasses: boolean;
  hairStyle: string;
  skinTone: string;
  facialHair: string;
  clothingColor: string;
}

interface AvatarCreatorProps {
  onSave: (traits: AvatarTraits) => void;
  onCancel: () => void;
}

const AvatarCreator = ({ onSave, onCancel }: AvatarCreatorProps) => {
  const [traits, setTraits] = useState<AvatarTraits>({
    height: '175',
    weight: '75',
    hairColor: '#1A1A1A', // Preto
    eyeColor: '#4A90E2', // Azul
    glasses: false,
    hairStyle: 'Topete',
    skinTone: '#C68642', // Pardo
    facialHair: 'Nenhuma',
    clothingColor: '#2377bb' // Azul Ki Papo
  });

  const hairStyles = ['Topete', 'Curto', 'Social', 'Longo', 'Careca'];
  const facialHairStyles = ['Nenhuma', 'Barba Curta', 'Cavanhaque', 'Sombreada'];
  
  const skinTones = [
    { name: 'Claro', color: '#FFDBAC' },
    { name: 'Pardo', color: '#C68642' },
    { name: 'Moreno', color: '#8D5524' },
    { name: 'Negro', color: '#3C2E28' }
  ];
  
  const colors = [
    { name: 'Preto', color: '#1A1A1A' },
    { name: 'Castanho', color: '#4E2D11' },
    { name: 'Loiro', color: '#E5C453' },
    { name: 'Azul', color: '#3D4551' },
    { name: 'Grisalho', color: '#808080' }
  ];

  const clothingColors = [
    { name: 'Azul', color: '#2377bb' },
    { name: 'Vinho', color: '#7B1D25' },
    { name: 'Verde', color: '#2D5A27' },
    { name: 'Preto', color: '#1A1A1A' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
      
      {/* PREVIEW DO AVATAR VETORIAL */}
      <div className="flex justify-center py-6">
        <div className="relative w-64 h-64 bg-slate-50 rounded-[3rem] flex items-center justify-center shadow-inner border border-slate-100">
          <div className="relative w-40 h-52 flex flex-col items-center">
            
            {/* CABEÇA */}
            <div className="relative w-32 h-40 z-20">
              {/* Rosto */}
              <div 
                className="w-full h-full rounded-[38%_38%_45%_45%] shadow-lg relative overflow-hidden transition-all duration-500"
                style={{ backgroundColor: traits.skinTone }}
              >
                {/* Sombra de contorno */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                
                {/* Olhos Profissionais */}
                <div className="absolute top-[42%] left-0 right-0 flex justify-center gap-8 z-20">
                  {[1, 2].map(i => (
                    <div key={i} className="w-8 h-4.5 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                      <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: traits.eyeColor }}>
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sobrancelhas */}
                <div className="absolute top-[34%] left-0 right-0 flex justify-center gap-10 z-20">
                   <div className="w-9 h-2 rounded-full rotate-[-4deg]" style={{ backgroundColor: traits.hairColor, opacity: 0.8 }} />
                   <div className="w-9 h-2 rounded-full rotate-[4deg]" style={{ backgroundColor: traits.hairColor, opacity: 0.8 }} />
                </div>

                {/* Nariz Clean */}
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-4 h-2 bg-black/5 rounded-full" />

                {/* Barba / Cavanhaque */}
                {traits.facialHair !== 'Nenhuma' && (
                  <div className={cn(
                    "absolute bottom-[10%] left-1/2 -translate-x-1/2 transition-all duration-300",
                    traits.facialHair === 'Barba Curta' && "w-24 h-16 rounded-[40%_40%_50%_50%] bg-black/20",
                    traits.facialHair === 'Cavanhaque' && "w-14 h-10 rounded-full bg-black/20",
                    traits.facialHair === 'Sombreada' && "w-24 h-14 rounded-full bg-black/10 blur-[1px]"
                  )} style={{ backgroundColor: traits.facialHair !== 'Sombreada' ? traits.hairColor : undefined, opacity: traits.facialHair === 'Sombreada' ? 0.3 : 0.6 }} />
                )}

                {/* Boca / Sorriso */}
                <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-10 h-0.5 bg-black/20 rounded-full" />
              </div>

              {/* Cabelo Vetorial */}
              {traits.hairStyle !== 'Careca' && (
                <div className="absolute -top-4 -left-1 -right-1 h-[50%] z-30">
                  <div 
                    className={cn(
                      "w-full h-full transition-all duration-500 relative",
                      traits.hairStyle === 'Topete' && "rounded-[45%_65%_15%_15%] scale-x-110 rotate-[-3deg]",
                      traits.hairStyle === 'Curto' && "rounded-[40%_40%_10%_10%]",
                      traits.hairStyle === 'Social' && "rounded-[30%_50%_10%_10%] scale-x-105",
                      traits.hairStyle === 'Longo' && "h-[140%] rounded-[45%_45%_25%_25%] -top-2"
                    )}
                    style={{ backgroundColor: traits.hairColor, boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.2)' }}
                  >
                    <div className="absolute top-2 left-6 w-1/3 h-1.5 bg-white/10 rounded-full" />
                  </div>
                </div>
              )}

              {/* Óculos */}
              {traits.glasses && (
                <div className="absolute top-[38%] left-[4%] right-[4%] flex items-center justify-between z-40">
                  <div className="w-12 h-10 border-[2.5px] border-slate-900 rounded-xl bg-white/5 backdrop-blur-[1px]" />
                  <div className="w-5 h-[2.5px] bg-slate-900" />
                  <div className="w-12 h-10 border-[2.5px] border-slate-900 rounded-xl bg-white/5 backdrop-blur-[1px]" />
                </div>
              )}
            </div>

            {/* CORPO / CAMISA POLO */}
            <div className="absolute bottom-0 w-48 h-20 z-10">
              <div className="w-full h-full rounded-[3rem_3rem_0_0] relative overflow-hidden shadow-lg" style={{ backgroundColor: traits.clothingColor }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Detalhe da Gola Polo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-10 flex justify-center">
                  <div className="w-10 h-10 rotate-45 -translate-y-5 rounded-md shadow-sm" style={{ backgroundColor: traits.clothingColor, filter: 'brightness(0.9)' }} />
                  <div className="w-10 h-10 -rotate-45 -translate-y-5 rounded-md shadow-sm" style={{ backgroundColor: traits.clothingColor, filter: 'brightness(0.9)' }} />
                </div>
                {/* Botões */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-1">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CONTROLES DE CRIAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Lado Esquerdo: Físico */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dimensões Reais</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Ruler size={12}/> Altura</span>
                <Input type="number" value={traits.height} onChange={(e) => setTraits({...traits, height: e.target.value})} className="h-10 font-black text-lg bg-transparent border-none p-0 focus-visible:ring-0" />
                <span className="text-[10px] text-slate-300 font-bold">Centímetros</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><Weight size={12}/> Peso</span>
                <Input type="number" value={traits.weight} onChange={(e) => setTraits({...traits, weight: e.target.value})} className="h-10 font-black text-lg bg-transparent border-none p-0 focus-visible:ring-0" />
                <span className="text-[10px] text-slate-300 font-bold">Quilos</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estilo Facial</Label>
            <div className="grid grid-cols-2 gap-2">
              {facialHairStyles.map(style => (
                <Button 
                  key={style} 
                  variant={traits.facialHair === style ? 'default' : 'outline'} 
                  onClick={() => setTraits({...traits, facialHair: style})}
                  className={cn("h-11 rounded-xl text-[10px] font-black uppercase", traits.facialHair === style ? "bg-primary shadow-lg" : "border-slate-100")}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setTraits({...traits, glasses: !traits.glasses})}
            className={cn(
              "w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between",
              traits.glasses ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-transparent"
            )}
          >
            <span className="text-xs font-black text-slate-700 flex items-center gap-3"><Glasses size={20} /> Uso óculos de grau</span>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-all", traits.glasses ? "bg-primary text-white" : "bg-slate-200")}>
              {traits.glasses && <Check size={14} />}
            </div>
          </button>
        </div>

        {/* Lado Direito: Cores e Cabelo */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tom de Pele</Label>
            <div className="flex gap-3">
              {skinTones.map(s => (
                <button 
                  key={s.name} 
                  onClick={() => setTraits({...traits, skinTone: s.color})}
                  className={cn("w-10 h-10 rounded-full border-4 transition-all hover:scale-110", traits.skinTone === s.color ? "border-primary shadow-lg" : "border-white")}
                  style={{ backgroundColor: s.color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cabelo e Cor</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {hairStyles.map(style => (
                <Button 
                  key={style} 
                  size="sm" 
                  variant={traits.hairStyle === style ? 'default' : 'outline'}
                  onClick={() => setTraits({...traits, hairStyle: style})}
                  className={cn("rounded-lg h-9 text-[9px] font-black uppercase px-3", traits.hairStyle === style ? "bg-primary" : "border-slate-100")}
                >
                  {style}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {colors.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => setTraits({...traits, hairColor: c.color})}
                  className={cn("w-9 h-9 rounded-lg border-2 transition-all", traits.hairColor === c.color ? "border-primary scale-110 shadow-md" : "border-slate-100")}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cor da Roupa</Label>
            <div className="flex gap-3">
              {clothingColors.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => setTraits({...traits, clothingColor: c.color})}
                  className={cn("w-10 h-10 rounded-2xl border-4 transition-all", traits.clothingColor === c.color ? "border-primary shadow-lg" : "border-white")}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="pt-6 flex flex-col md:flex-row gap-4">
        <Button variant="ghost" onClick={onCancel} className="h-16 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]">Pular Personalização</Button>
        <Button 
          onClick={() => onSave(traits)} 
          className="flex-1 h-20 bg-primary hover:bg-[#1c629d] rounded-[2rem] font-black text-white shadow-2xl shadow-primary/20 transition-all active:scale-95 text-lg gap-3"
        >
          <Sparkles size={24} /> FINALIZAR MEU AVATAR
        </Button>
      </div>

    </div>
  );
};

export default AvatarCreator;