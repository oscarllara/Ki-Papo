"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Glasses, Ruler, Weight, Palette, UserRound } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface AvatarTraits {
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  glasses: boolean;
  hairStyle: string;
}

interface AvatarCreatorProps {
  onSave: (traits: AvatarTraits) => void;
  onCancel: () => void;
}

const AvatarCreator = ({ onSave, onCancel }: AvatarCreatorProps) => {
  const [traits, setTraits] = useState<AvatarTraits>({
    height: '170',
    weight: '70',
    hairColor: 'Preto',
    eyeColor: 'Castanho',
    glasses: false,
    hairStyle: 'Curto'
  });

  const hairStyles = ['Curto', 'Longo', 'Careca', 'De Lado', 'Arrepiado'];
  const colors = [
    { name: 'Preto', bg: 'bg-slate-900', text: 'text-slate-900' },
    { name: 'Castanho', bg: 'bg-amber-900', text: 'text-amber-900' },
    { name: 'Loiro', bg: 'bg-yellow-400', text: 'text-yellow-400' },
    { name: 'Ruivo', bg: 'bg-orange-600', text: 'text-orange-600' }
  ];
  
  const eyeColors = [
    { name: 'Castanho', bg: 'bg-amber-900', text: 'text-amber-900' },
    { name: 'Azul', bg: 'bg-blue-500', text: 'text-blue-500' },
    { name: 'Verde', bg: 'bg-emerald-600', text: 'text-emerald-600' }
  ];

  const activeHairColor = colors.find(c => c.name === traits.hairColor)?.text || 'text-slate-900';
  const activeEyeColor = eyeColors.find(c => c.name === traits.eyeColor)?.text || 'text-amber-900';

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className={cn(
            "w-32 h-32 rounded-full border-4 flex items-center justify-center bg-white overflow-hidden shadow-xl transition-colors",
            traits.hairStyle === 'Careca' ? "pt-4" : ""
          )} style={{ borderColor: eyeColors.find(c => c.name === traits.eyeColor)?.bg.replace('bg-', '') || '#e2e8f0' }}>
            <div className="relative flex flex-col items-center">
              {/* Representação visual do estilo de cabelo */}
              {traits.hairStyle !== 'Careca' && (
                <div className={cn("absolute -top-6 w-16 h-8 rounded-t-full opacity-80", activeHairColor.replace('text-', 'bg-'))} />
              )}
              <UserRound size={80} className="text-slate-300" />
              {traits.glasses && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 text-slate-900">
                  <Glasses size={32} />
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
            <User size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Ruler size={14} /> Altura (cm)
            </Label>
            <input 
              type="range" min="140" max="210" value={traits.height} 
              onChange={(e) => setTraits({...traits, height: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs font-bold text-slate-500">{traits.height} cm</span>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Weight size={14} /> Peso (kg)
            </Label>
            <input 
              type="range" min="40" max="150" value={traits.weight} 
              onChange={(e) => setTraits({...traits, weight: e.target.value})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs font-bold text-slate-500">{traits.weight} kg</span>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="glasses" 
              checked={traits.glasses} 
              onCheckedChange={(checked) => setTraits({...traits, glasses: checked as boolean})} 
              className="rounded-md"
            />
            <Label htmlFor="glasses" className="text-xs font-bold text-slate-700 cursor-pointer">Usa óculos?</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Palette size={14} /> Cor do Cabelo
            </Label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, hairColor: c.name})}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    c.bg,
                    traits.hairColor === c.name ? "border-primary scale-110 shadow-md" : "border-slate-200"
                  )}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               Olhos
            </Label>
            <div className="flex gap-2">
              {eyeColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setTraits({...traits, eyeColor: c.name})}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    c.bg,
                    traits.eyeColor === c.name ? "border-primary scale-110 shadow-md" : "border-slate-200"
                  )}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Estilo de Cabelo</Label>
            <div className="grid grid-cols-2 gap-2">
              {hairStyles.map(style => (
                <Button
                  key={style}
                  variant={traits.hairStyle === style ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTraits({...traits, hairStyle: style})}
                  className="rounded-xl h-10 text-[10px] font-bold"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black">Pular</Button>
        <Button onClick={() => onSave(traits)} className="flex-1 h-14 bg-primary rounded-2xl font-black text-white shadow-xl">Salvar Avatar</Button>
      </div>
    </div>
  );
};

export default AvatarCreator;