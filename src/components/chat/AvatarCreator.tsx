"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Glasses, Ruler, Weight, Palette } from 'lucide-react';
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
    hairColor: 'Preto',
    eyeColor: 'Castanho',
    glasses: false,
    hairStyle: 'Curto',
    skinTone: 'Pardo'
  });

  const hairStyles = ['Curto', 'Longo', 'Careca', 'De Lado', 'Arrepiado'];
  const skinTones = [
    { name: 'Claro', bg: 'bg-[#ffdbac]' },
    { name: 'Pardo', bg: 'bg-[#e0ac69]' },
    { name: 'Escuro', bg: 'bg-[#8d5524]' }
  ];
  
  const hairColors = [
    { name: 'Preto', bg: 'bg-[#090806]' },
    { name: 'Castanho', bg: 'bg-[#4e2d11]' },
    { name: 'Loiro', bg: 'bg-[#d6b37a]' },
    { name: 'Ruivo', bg: 'bg-[#a5452d]' }
  ];
  
  const eyeColors = [
    { name: 'Castanho', bg: 'bg-[#634e34]' },
    { name: 'Azul', bg: 'bg-[#2e536f]' },
    { name: 'Verde', bg: 'bg-[#3d671d]' }
  ];

  const getHairColor = () => hairColors.find(c => c.name === traits.hairColor)?.bg.replace('bg-', '') || '#090806';
  const getEyeColor = () => eyeColors.find(c => c.name === traits.eyeColor)?.bg.replace('bg-', '') || '#634e34';
  const getSkinColor = () => skinTones.find(s => s.name === traits.skinTone)?.bg.replace('bg-', '') || '#e0ac69';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Avatar Preview Moderno */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <div 
            className="w-full h-full rounded-full border-4 border-white shadow-2xl relative overflow-hidden transition-all duration-500"
            style={{ backgroundColor: getSkinColor() }}
          >
            {/* Cabelo */}
            {traits.hairStyle !== 'Careca' && (
              <div 
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-[110%] h-[45%] transition-all",
                  traits.hairStyle === 'Curto' && "rounded-b-[20%] rounded-t-[50%]",
                  traits.hairStyle === 'Longo' && "h-[70%] rounded-b-[40%] rounded-t-[50%]",
                  traits.hairStyle === 'De Lado' && "h-[40%] -rotate-6 rounded-b-[50%] rounded-tl-[100%]",
                  traits.hairStyle === 'Arrepiado' && "h-[35%] rounded-b-[10%] rounded-t-[60%] border-t-8"
                )}
                style={{ backgroundColor: getHairColor() }}
              />
            )}

            {/* Rosto Details */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              {/* Olhos */}
              <div className="absolute top-[45%] left-1/4 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getEyeColor() }} />
              </div>
              <div className="absolute top-[45%] right-1/4 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getEyeColor() }} />
              </div>

              {/* Óculos */}
              {traits.glasses && (
                <div className="absolute top-[42%] left-[15%] right-[15%] flex items-center justify-between z-10">
                  <div className="w-8 h-6 border-2 border-slate-900 rounded-md" />
                  <div className="w-4 h-0.5 bg-slate-900" />
                  <div className="w-8 h-6 border-2 border-slate-900 rounded-md" />
                </div>
              )}

              {/* Sorriso */}
              <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-8 h-4 border-b-2 border-slate-900/20 rounded-full" />
            </div>
          </div>
          
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl">
            <User size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2"><Ruler size={14} className="text-primary" /> Altura (cm)</span>
              <Input 
                type="number" 
                value={traits.height} 
                onChange={(e) => setTraits({...traits, height: e.target.value})}
                className="w-16 h-8 text-center text-xs font-bold border-none bg-slate-100 rounded-lg"
              />
            </Label>
            <input 
              type="range" min="140" max="220" value={traits.height} 
              onChange={(e) => setTraits({...traits, height: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2"><Weight size={14} className="text-primary" /> Peso (kg)</span>
              <Input 
                type="number" 
                value={traits.weight} 
                onChange={(e) => setTraits({...traits, weight: e.target.value})}
                className="w-16 h-8 text-center text-xs font-bold border-none bg-slate-100 rounded-lg"
              />
            </Label>
            <input 
              type="range" min="40" max="180" value={traits.weight} 
              onChange={(e) => setTraits({...traits, weight: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Checkbox 
              id="glasses" 
              checked={traits.glasses} 
              onCheckedChange={(checked) => setTraits({...traits, glasses: checked as boolean})} 
              className="w-5 h-5 rounded-md"
            />
            <Label htmlFor="glasses" className="text-sm font-bold text-slate-700 cursor-pointer flex items-center gap-2">
              <Glasses size={18} /> Usa óculos de grau?
            </Label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Palette size={14} className="text-primary" /> Tons de Pele & Cabelo
            </Label>
            <div className="flex flex-wrap gap-3">
              {skinTones.map(s => (
                <button
                  key={s.name}
                  onClick={() => setTraits({...traits, skinTone: s.name})}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                    s.bg,
                    traits.skinTone === s.name ? "border-primary shadow-lg" : "border-white"
                  )}
                  title={`Pele ${s.name}`}
                />
              ))}
              <div className="w-px h-10 bg-slate-200 mx-1" />
              {hairColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, hairColor: c.name})}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                    c.bg,
                    traits.hairColor === c.name ? "border-primary shadow-lg" : "border-white"
                  )}
                  title={`Cabelo ${c.name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              Olhos
            </Label>
            <div className="flex gap-3">
              {eyeColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, eyeColor: c.name})}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                    c.bg,
                    traits.eyeColor === c.name ? "border-primary shadow-lg" : "border-white"
                  )}
                  title={`Olhos ${c.name}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest">Estilo de Cabelo</Label>
            <div className="flex flex-wrap gap-2">
              {hairStyles.map(style => (
                <Button
                  key={style}
                  variant={traits.hairStyle === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTraits({...traits, hairStyle: style})}
                  className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider h-10"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black text-slate-400">PULAR</Button>
        <Button onClick={() => onSave(traits)} className="flex-[2] h-16 bg-primary hover:bg-primary/90 rounded-[1.5rem] font-black text-white shadow-2xl shadow-primary/20 transition-all active:scale-95">
          FINALIZAR AVATAR
        </Button>
      </div>
    </div>
  );
};

export default AvatarCreator;