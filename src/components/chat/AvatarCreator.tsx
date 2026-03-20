"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Glasses, Ruler, Weight, Palette, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface AvatarTraits {
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  glasses: boolean;
  hairStyle: string;
  skinTone: string;
}

interface AvatarCreatorProps {
  onSave: (traits: AvatarTraits) => void;
  onCancel: () => void;
}

const AvatarCreator = ({ onSave, onCancel }: AvatarCreatorProps) => {
  const [traits, setTraits] = useState<AvatarTraits>({
    height: '175',
    weight: '75',
    hairColor: 'Castanho',
    eyeColor: 'Castanho',
    glasses: false,
    hairStyle: 'Curto',
    skinTone: 'Pardo'
  });

  const hairStyles = ['Curto', 'Longo', 'Careca', 'De Lado', 'Arrepiado', 'Black Power'];
  const skinTones = [
    { name: 'Claro', color: '#FFDBAC' },
    { name: 'Pardo', color: '#F1C27D' },
    { name: 'Moreno', color: '#8D5524' },
    { name: 'Negro', color: '#4B2C20' }
  ];
  
  const hairColors = [
    { name: 'Preto', color: '#1A1A1A' },
    { name: 'Castanho', color: '#4E2D11' },
    { name: 'Loiro', color: '#E5C453' },
    { name: 'Ruivo', color: '#B55239' },
    { name: 'Grisalho', color: '#A0A0A0' }
  ];
  
  const eyeColors = [
    { name: 'Castanho', color: '#634E34' },
    { name: 'Azul', color: '#4A90E2' },
    { name: 'Verde', color: '#50B332' },
    { name: 'Mel', color: '#C5934E' }
  ];

  const activeSkin = skinTones.find(s => s.name === traits.skinTone)?.color || '#F1C27D';
  const activeHair = hairColors.find(c => c.name === traits.hairColor)?.color || '#4E2D11';
  const activeEye = eyeColors.find(c => c.name === traits.eyeColor)?.color || '#634E34';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Caricatura Estilo Bitmoji Preview */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Cabeça e Rosto */}
          <div 
            className="w-40 h-44 mx-auto rounded-[45%] border-[3px] border-black/10 shadow-2xl relative overflow-hidden transition-all duration-500"
            style={{ backgroundColor: activeSkin }}
          >
            {/* Cabelo estilo adesivo */}
            {traits.hairStyle !== 'Careca' && (
              <div 
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-[110%] transition-all duration-500 z-10",
                  traits.hairStyle === 'Curto' && "h-[35%] rounded-b-[40%] rounded-t-[50%] -top-1",
                  traits.hairStyle === 'Longo' && "h-[85%] rounded-b-[45%] rounded-t-[50%] -top-1",
                  traits.hairStyle === 'De Lado' && "h-[40%] -rotate-12 rounded-b-[60%] rounded-tl-[100%] left-[45%]",
                  traits.hairStyle === 'Arrepiado' && "h-[35%] rounded-b-[20%] rounded-t-[50%] -top-4 skew-y-6",
                  traits.hairStyle === 'Black Power' && "h-[55%] w-[130%] rounded-full -top-4"
                )}
                style={{ backgroundColor: activeHair }}
              />
            )}

            {/* Detalhes do Rosto Amigável */}
            <div className="absolute inset-0 pt-20">
              {/* Olhos Grandes e Expressivos */}
              <div className="flex justify-center gap-8">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center relative shadow-sm border border-black/5">
                  <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: activeEye }}>
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center relative shadow-sm border border-black/5">
                  <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: activeEye }}>
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Óculos Bitmoji */}
              {traits.glasses && (
                <div className="absolute top-[76px] left-[15%] right-[15%] flex items-center justify-between z-20">
                  <div className="w-12 h-10 border-[3px] border-black rounded-xl bg-blue-100/5 backdrop-blur-[1px]" />
                  <div className="w-6 h-[3px] bg-black" />
                  <div className="w-12 h-10 border-[3px] border-black rounded-xl bg-blue-100/5 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Nariz e Sorriso Curvo */}
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="w-2.5 h-1.5 bg-black/10 rounded-full" />
                <div className="w-10 h-5 border-b-[3px] border-black/20 rounded-[50%]" />
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-2 -right-2 bg-[#a3cc16] text-[#2377bb] p-3 rounded-2xl shadow-xl border-4 border-white">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Ruler size={14} /> Altura (cm)
              </Label>
              <Input 
                type="number" 
                value={traits.height} 
                onChange={(e) => setTraits({...traits, height: e.target.value})}
                className="w-20 h-9 text-center font-black border-slate-200 rounded-xl bg-slate-50 focus:ring-primary/20"
              />
            </div>
            <input 
              type="range" min="140" max="230" value={traits.height} 
              onChange={(e) => setTraits({...traits, height: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Weight size={14} /> Peso (kg)
              </Label>
              <Input 
                type="number" 
                value={traits.weight} 
                onChange={(e) => setTraits({...traits, weight: e.target.value})}
                className="w-20 h-9 text-center font-black border-slate-200 rounded-xl bg-slate-50 focus:ring-primary/20"
              />
            </div>
            <input 
              type="range" min="30" max="200" value={traits.weight} 
              onChange={(e) => setTraits({...traits, weight: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]"
            />
          </div>

          <div className={cn(
            "flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer",
            traits.glasses ? "bg-blue-50 border-[#2377bb]/20" : "bg-slate-50 border-transparent"
          )} onClick={() => setTraits({...traits, glasses: !traits.glasses})}>
            <Checkbox checked={traits.glasses} className="w-5 h-5" />
            <Label className="text-sm font-black text-slate-700 flex items-center gap-3 cursor-pointer">
              <Glasses size={20} className={traits.glasses ? "text-[#2377bb]" : "text-slate-400"} /> Usa óculos?
            </Label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tom de Pele & Cabelo</Label>
            <div className="flex flex-wrap gap-2.5">
              {skinTones.map(s => (
                <button
                  key={s.name}
                  onClick={() => setTraits({...traits, skinTone: s.name})}
                  className={cn(
                    "w-10 h-10 rounded-xl border-4 transition-all hover:scale-110",
                    traits.skinTone === s.name ? "border-[#2377bb] shadow-lg" : "border-white"
                  )}
                  style={{ backgroundColor: s.color }}
                />
              ))}
              <div className="w-px h-10 bg-slate-100 mx-1" />
              {hairColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, hairColor: c.name})}
                  className={cn(
                    "w-10 h-10 rounded-xl border-4 transition-all hover:scale-110",
                    traits.hairColor === c.name ? "border-[#2377bb] shadow-lg" : "border-white"
                  )}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Corte de Cabelo</Label>
            <div className="flex flex-wrap gap-2">
              {hairStyles.map(style => (
                <Button
                  key={style}
                  variant={traits.hairStyle === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTraits({...traits, hairStyle: style})}
                  className={cn(
                    "rounded-xl px-4 h-10 text-[10px] font-black uppercase tracking-widest transition-all",
                    traits.hairStyle === style ? "bg-[#2377bb] shadow-xl" : "border-slate-200"
                  )}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Cor dos Olhos</Label>
            <div className="flex gap-2.5">
              {eyeColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, eyeColor: c.name})}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                    traits.eyeColor === c.name ? "border-[#2377bb] shadow-lg" : "border-white"
                  )}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-xs">PULAR</Button>
        <Button onClick={() => onSave(traits)} className="flex-[2] h-16 bg-[#2377bb] hover:bg-[#1c629d] rounded-[1.5rem] font-black text-white shadow-2xl transition-all active:scale-95 text-lg">
          SALVAR MINHA CARINHA
        </Button>
      </div>
    </div>
  );
};

export default AvatarCreator;