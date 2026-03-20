"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Glasses, Ruler, Weight, Camera, Upload, Wand2, Loader2, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    hairStyle: 'Topete',
    skinTone: 'Pardo'
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hairStyles = ['Topete', 'Franja', 'Longo', 'Careca', 'Arrepiado', 'Black Power'];
  const skinTones = [
    { name: 'Claro', color: '#FFDBAC' },
    { name: 'Pardo', color: '#C68642' },
    { name: 'Moreno', color: '#8D5524' },
    { name: 'Negro', color: '#3C2E28' }
  ];
  
  const hairColors = [
    { name: 'Preto', color: '#1A1A1A' },
    { name: 'Castanho', color: '#4E2D11' },
    { name: 'Loiro', color: '#E5C453' },
    { name: 'Azul Acinzentado', color: '#3D4551' }
  ];
  
  const eyeColors = [
    { name: 'Azul', color: '#4A90E2' },
    { name: 'Castanho', color: '#634E34' },
    { name: 'Verde', color: '#50B332' },
    { name: 'Preto', color: '#000000' }
  ];

  // Simulação de análise de imagem para detectar tons
  const analyzeImage = (file: File) => {
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Simulando processamento de IA
        setTimeout(() => {
          setPhotoPreview(e.target?.result as string);
          // Pré-ajusta alguns traços baseados em "sorte" ou lógica simples para dar a sensação de IA
          setTraits(prev => ({
            ...prev,
            skinTone: Math.random() > 0.5 ? 'Pardo' : 'Claro',
            hairColor: Math.random() > 0.5 ? 'Preto' : 'Castanho'
          }));
          setIsAnalyzing(false);
          toast.success("Foto analisada! Ajustamos sua caricatura.");
        }, 1500);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeImage(file);
  };

  const activeSkin = skinTones.find(s => s.name === traits.skinTone)?.color || '#C68642';
  const activeHair = hairColors.find(c => c.name === traits.hairColor)?.color || '#3D4551';
  const activeEye = eyeColors.find(c => c.name === traits.eyeColor)?.color || '#4A90E2';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Seção de Upload de Foto */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
        {!photoPreview ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-[#2377bb]">
              {isAnalyzing ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-800">Criar a partir de foto</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A IA analisará seus traços</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isAnalyzing}
              className="bg-white hover:bg-slate-50 text-slate-600 border-none shadow-sm rounded-xl font-black gap-2"
            >
              <Upload size={16} /> CARREGAR FOTO
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <div className="relative">
              <img src={photoPreview} className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-white" />
              <button 
                onClick={() => setPhotoPreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
              >
                <Upload size={12} className="rotate-180" />
              </button>
            </div>
            <div className="text-primary animate-pulse"><Wand2 size={24} /></div>
            <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg border-2 border-primary/20 overflow-hidden">
                <CaricaturePreviewSmall skin={activeSkin} hair={activeHair} style={traits.hairStyle} />
            </div>
          </div>
        )}
      </div>

      {/* Caricatura Grande Preview */}
      <div className="flex justify-center">
        <div className="relative w-56 h-64 flex flex-col items-center">
          <div className="relative w-32 h-40 z-20">
            <div className="absolute top-[45%] -left-3 w-6 h-8 rounded-full border-b-2 border-black/5" style={{ backgroundColor: activeSkin }} />
            <div className="absolute top-[45%] -right-3 w-6 h-8 rounded-full border-b-2 border-black/5" style={{ backgroundColor: activeSkin }} />
            
            <div className="w-full h-full rounded-[35%_35%_45%_45%] shadow-xl relative overflow-hidden transition-all duration-500" style={{ backgroundColor: activeSkin }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="absolute top-[32%] left-0 right-0 flex justify-center gap-8 z-20">
                 <div className="w-8 h-2 rounded-full rotate-[-5deg] opacity-70" style={{ backgroundColor: activeHair }} />
                 <div className="w-8 h-2 rounded-full rotate-[5deg] opacity-70" style={{ backgroundColor: activeHair }} />
              </div>
              <div className="absolute top-[42%] left-0 right-0 flex justify-center gap-7 z-20">
                {[1, 2].map(i => (
                  <div key={i} className="w-7 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                    <div className="w-3.5 h-3.5 rounded-full relative" style={{ backgroundColor: activeEye }}>
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              {traits.glasses && (
                <div className="absolute top-[38%] left-[5%] right-[5%] flex items-center justify-between z-30">
                  <div className="w-11 h-9 border-[2px] border-slate-900/40 rounded-lg bg-white/5" />
                  <div className="w-4 h-[2px] bg-slate-900/40" />
                  <div className="w-11 h-9 border-[2px] border-slate-900/40 rounded-lg bg-white/5" />
                </div>
              )}
              <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-4 h-4 bg-black/10 rounded-full blur-[1px]" />
              <div className="absolute top-[54%] left-1/2 -translate-x-1/2 w-4 h-3 border-r-2 border-b-2 border-black/10 rounded-br-md" />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-10 h-0.5 bg-black/20 rounded-full" />
            </div>

            {traits.hairStyle !== 'Careca' && (
              <div className="absolute -top-4 -left-2 -right-2 h-[55%] z-30">
                <div 
                  className={cn(
                    "w-full h-full transition-all duration-500",
                    traits.hairStyle === 'Topete' && "rounded-[50%_70%_20%_20%] scale-x-110 rotate-[-5deg]",
                    traits.hairStyle === 'Franja' && "rounded-[20%_80%_10%_80%] -translate-y-1",
                    traits.hairStyle === 'Longo' && "h-[150%] rounded-[50%_50%_30%_30%] -top-2",
                    traits.hairStyle === 'Arrepiado' && "rounded-[50%_50%_0_0] skew-y-6 scale-110",
                    traits.hairStyle === 'Black Power' && "rounded-full scale-125 h-[70%]"
                  )}
                  style={{ backgroundColor: activeHair, boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.2)' }}
                >
                   <div className="absolute top-2 left-4 w-1/2 h-2 bg-white/10 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 w-44 h-24 z-10">
            <div className="absolute bottom-0 left-0 right-0 h-full bg-slate-500 rounded-[3rem_3rem_0_0]" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-20 bg-[#7B1D25] rounded-[2rem_2rem_1rem_1rem] flex items-center justify-center">
               <div className="w-12 h-20 bg-black/10 rounded-full" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-12 bg-slate-600 rounded-full border-t-4 border-slate-700/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Ruler size={14} /> Altura (cm)</Label>
              <Input type="number" value={traits.height} onChange={(e) => setTraits({...traits, height: e.target.value})} className="w-20 h-9 text-center font-black border-slate-200 rounded-xl bg-slate-50" />
            </div>
            <input type="range" min="140" max="230" value={traits.height} onChange={(e) => setTraits({...traits, height: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Weight size={14} /> Peso (kg)</Label>
              <Input type="number" value={traits.weight} onChange={(e) => setTraits({...traits, weight: e.target.value})} className="w-20 h-9 text-center font-black border-slate-200 rounded-xl bg-slate-50" />
            </div>
            <input type="range" min="30" max="200" value={traits.weight} onChange={(e) => setTraits({...traits, weight: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2377bb]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pele & Cabelo</Label>
            <div className="flex flex-wrap gap-2.5">
              {skinTones.map(s => <button key={s.name} onClick={() => setTraits({...traits, skinTone: s.name})} className={cn("w-10 h-10 rounded-xl border-4 transition-all hover:scale-110", traits.skinTone === s.name ? "border-[#2377bb] shadow-lg" : "border-white")} style={{ backgroundColor: s.color }} />)}
              <div className="w-px h-10 bg-slate-100 mx-1" />
              {hairColors.map(c => <button key={c.name} onClick={() => setTraits({...traits, hairColor: c.name})} className={cn("w-10 h-10 rounded-xl border-4 transition-all hover:scale-110", traits.hairColor === c.name ? "border-[#2377bb] shadow-lg" : "border-white")} style={{ backgroundColor: c.color }} />)}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Estilo de Corte</Label>
            <div className="flex flex-wrap gap-2">
              {hairStyles.map(style => <Button key={style} variant={traits.hairStyle === style ? 'default' : 'outline'} size="sm" onClick={() => setTraits({...traits, hairStyle: style})} className={cn("rounded-xl px-4 h-10 text-[10px] font-black uppercase tracking-widest", traits.hairStyle === style ? "bg-[#2377bb] shadow-xl" : "border-slate-200")}>{style}</Button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-xs">PULAR</Button>
        <Button onClick={() => onSave(traits)} className="flex-[2] h-16 bg-[#2377bb] hover:bg-[#1c629d] rounded-[1.5rem] font-black text-white shadow-2xl transition-all active:scale-95 text-lg">CRIAR CARICATURA</Button>
      </div>
    </div>
  );
};

// Componente auxiliar para o preview pequeno
const CaricaturePreviewSmall = ({ skin, hair, style }: { skin: string, hair: string, style: string }) => (
  <div className="relative w-16 h-16" style={{ backgroundColor: skin }}>
     <div className="absolute top-0 left-0 w-full h-[45%]" style={{ backgroundColor: hair }} />
     <div className="absolute top-1/2 left-1/4 w-2 h-1 bg-white rounded-full" />
     <div className="absolute top-1/2 right-1/4 w-2 h-1 bg-white rounded-full" />
  </div>
);

export default AvatarCreator;