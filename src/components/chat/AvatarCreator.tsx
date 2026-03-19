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
    { name: 'Claro', color: '#ffdbac' },
    { name: 'Pardo', color: '#e0ac69' },
    { name: 'Moreno', color: '#8d5524' },
    { name: 'Negro', color: '#4b2c20' }
  ];
  
  const hairColors = [
    { name: 'Preto', color: '#090806' },
    { name: 'Castanho', color: '#4e2d11' },
    { name: 'Loiro', color: '#d6b37a' },
    { name: 'Ruivo', color: '#a5452d' },
    { name: 'Grisalho', color: '#b8b8b8' }
  ];
  
  const eyeColors = [
    { name: 'Castanho', color: '#634e34' },
    { name: 'Azul', color: '#2e536f' },
    { name: 'Verde', color: '#3d671d' },
    { name: 'Mel', color: '#8a6e45' }
  ];

  const activeSkin = skinTones.find(s => s.name === traits.skinTone)?.color || '#e0ac69';
  const activeHair = hairColors.find(c => c.name === traits.hairColor)?.color || '#4e2d11';
  const activeEye = eyeColors.find(c => c.name === traits.eyeColor)?.color || '#634e34';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Caricatura Preview Realista */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48 group">
          <div 
            className="w-full h-full rounded-[3rem] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-700 bg-gradient-to-b from-transparent to-black/5"
            style={{ backgroundColor: activeSkin }}
          >
            {/* Cabelo Caricatura */}
            {traits.hairStyle !== 'Careca' && (
              <div 
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-[115%] h-[50%] transition-all duration-500",
                  traits.hairStyle === 'Curto' && "rounded-b-[30%] rounded-t-[50%] -top-2",
                  traits.hairStyle === 'Longo' && "h-[85%] rounded-b-[45%] rounded-t-[50%] -top-1",
                  traits.hairStyle === 'De Lado' && "h-[45%] -rotate-12 rounded-b-[60%] rounded-tl-[100%] left-[45%]",
                  traits.hairStyle === 'Arrepiado' && "h-[40%] rounded-b-[10%] rounded-t-[80%] -top-4 scale-y-110",
                  traits.hairStyle === 'Black Power' && "h-[65%] w-[130%] rounded-full -top-4 shadow-inner"
                )}
                style={{ backgroundColor: activeHair, boxShadow: `inset 0 -10px 20px rgba(0,0,0,0.2)` }}
              />
            )}

            {/* Rosto com profundidade */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              {/* Sombrancelhas */}
              {traits.hairStyle !== 'Careca' && (
                <div className="absolute top-[35%] left-0 right-0 flex justify-center gap-10">
                   <div className="w-8 h-1.5 rounded-full opacity-60" style={{ backgroundColor: activeHair }} />
                   <div className="w-8 h-1.5 rounded-full opacity-60" style={{ backgroundColor: activeHair }} />
                </div>
              )}

              {/* Olhos Realistas */}
              <div className="absolute top-[42%] left-[22%] w-5 h-3 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <div className="w-3 h-3 rounded-full relative" style={{ backgroundColor: activeEye }}>
                   <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              <div className="absolute top-[42%] right-[22%] w-5 h-3 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <div className="w-3 h-3 rounded-full relative" style={{ backgroundColor: activeEye }}>
                   <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>

              {/* Óculos Caricatura */}
              {traits.glasses && (
                <div className="absolute top-[38%] left-[10%] right-[10%] flex items-center justify-between z-20">
                  <div className="w-12 h-10 border-[3px] border-slate-900/80 rounded-xl bg-blue-100/10 backdrop-blur-[1px]" />
                  <div className="w-6 h-[3px] bg-slate-900/80" />
                  <div className="w-12 h-10 border-[3px] border-slate-900/80 rounded-xl bg-blue-100/10 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Nariz e Boca */}
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-4 h-6 border-r-2 border-b-2 border-black/10 rounded-br-lg" />
              <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-10 h-3 bg-black/5 rounded-full border-b-2 border-black/10" />
            </div>
          </div>
          
          <div className="absolute -bottom-2 -right-2 bg-[#a3cc16] text-[#2377bb] p-3 rounded-2xl shadow-xl border-4 border-white animate-bounce">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500"><Ruler size={14} /> Altura (cm)</span>
              <div className="relative">
                <Input 
                  type="number" 
                  value={traits.height} 
                  onChange={(e) => setTraits({...traits, height: e.target.value})}
                  className="w-20 h-9 text-right pr-8 font-black border-slate-200 rounded-xl bg-slate-50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">CM</span>
              </div>
            </Label>
            <input 
              type="range" min="140" max="230" value={traits.height} 
              onChange={(e) => setTraits({...traits, height: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500"><Weight size={14} /> Peso (kg)</span>
              <div className="relative">
                <Input 
                  type="number" 
                  value={traits.weight} 
                  onChange={(e) => setTraits({...traits, weight: e.target.value})}
                  className="w-20 h-9 text-right pr-8 font-black border-slate-200 rounded-xl bg-slate-50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">KG</span>
              </div>
            </Label>
            <input 
              type="range" min="30" max="200" value={traits.weight} 
              onChange={(e) => setTraits({...traits, weight: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]"
            />
          </div>

          <div className={cn(
            "flex items-center space-x-3 p-5 rounded-2xl border-2 transition-all cursor-pointer",
            traits.glasses ? "bg-blue-50 border-[#2377bb]/20 shadow-inner" : "bg-slate-50 border-transparent"
          )} onClick={() => setTraits({...traits, glasses: !traits.glasses})}>
            <Checkbox checked={traits.glasses} className="w-5 h-5 rounded-md" />
            <Label className="text-sm font-black text-slate-700 flex items-center gap-3 cursor-pointer">
              <Glasses size={20} className={traits.glasses ? "text-[#2377bb]" : "text-slate-400"} /> Usa óculos de grau?
            </Label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pele & Cabelo</Label>
            <div className="flex flex-wrap gap-2.5">
              {skinTones.map(s => (
                <button
                  key={s.name}
                  onClick={() => setTraits({...traits, skinTone: s.name})}
                  className={cn(
                    "w-10 h-10 rounded-xl border-4 transition-all hover:scale-110",
                    traits.skinTone === s.name ? "border-[#2377bb] shadow-lg scale-110" : "border-white shadow-sm"
                  )}
                  style={{ backgroundColor: s.color }}
                  title={`Pele ${s.name}`}
                />
              ))}
              <div className="w-px h-10 bg-slate-100 mx-1" />
              {hairColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, hairColor: c.name})}
                  className={cn(
                    "w-10 h-10 rounded-xl border-4 transition-all hover:scale-110",
                    traits.hairColor === c.name ? "border-[#2377bb] shadow-lg scale-110" : "border-white shadow-sm"
                  )}
                  style={{ backgroundColor: c.color }}
                  title={`Cabelo ${c.name}`}
                />
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
                    traits.eyeColor === c.name ? "border-[#2377bb] shadow-lg scale-110" : "border-white shadow-sm"
                  )}
                  style={{ backgroundColor: c.color }}
                  title={`Olhos ${c.name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Estilo de Cabelo</Label>
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
        </div>
      </div>

      <div className="pt-8 flex gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black text-slate-300 hover:text-red-400 transition-colors uppercase tracking-widest text-xs">PULAR</Button>
        <Button onClick={() => onSave(traits)} className="flex-[2] h-16 bg-[#2377bb] hover:bg-[#1c629d] rounded-[1.5rem] font-black text-white shadow-2xl shadow-blue-200 transition-all active:scale-95 text-lg">
          CRIAR MINHA CARICATURA
        </Button>
      </div>
    </div>
  );
};

export default AvatarCreator;