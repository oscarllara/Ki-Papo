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
  clothing: 'Polo' | 'Hoodie';
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
    skinTone: 'Pardo',
    clothing: 'Polo'
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hairStyles = ['Topete', 'Curto', 'Arrepiado', 'Longo', 'Careca'];
  const skinTones = [
    { name: 'Claro', color: '#FFDBAC' },
    { name: 'Pardo', color: '#C68642' },
    { name: 'Moreno', color: '#8D5524' },
    { name: 'Negro', color: '#3C2E28' }
  ];
  
  const hairColors = [
    { name: 'Preto', color: '#1A1A1A' },
    { name: 'Castanho', color: '#4E2D11' },
    { name: 'Grisalho', color: '#707070' },
    { name: 'Loiro', color: '#E5C453' }
  ];
  
  const eyeColors = [
    { name: 'Castanho', color: '#634E34' },
    { name: 'Preto', color: '#000000' },
    { name: 'Azul', color: '#4A90E2' },
    { name: 'Verde', color: '#50B332' }
  ];

  const analyzeImage = (file: File) => {
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        setPhotoPreview(e.target?.result as string);
        setTraits(prev => ({
          ...prev,
          skinTone: 'Pardo',
          hairColor: 'Preto',
          hairStyle: 'Topete',
          clothing: 'Polo'
        }));
        setIsAnalyzing(false);
        toast.success("Foto analisada! Detectamos seu estilo.");
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const activeSkin = skinTones.find(s => s.name === traits.skinTone)?.color || '#C68642';
  const activeHair = hairColors.find(c => c.name === traits.hairColor)?.color || '#1A1A1A';
  const activeEye = eyeColors.find(c => c.name === traits.eyeColor)?.color || '#634E34';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Upload de Foto */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
        {!photoPreview ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-primary">
              {isAnalyzing ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-800">Criar a partir de foto</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A IA ajustará os traços para você</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && analyzeImage(e.target.files[0])} className="hidden" accept="image/*" />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="bg-white hover:bg-slate-50 text-slate-600 shadow-sm rounded-xl font-black gap-2">
              <Upload size={16} /> CARREGAR FOTO
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <img src={photoPreview} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white" />
            <div className="text-primary animate-pulse"><Wand2 size={24} /></div>
            <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-primary/20 overflow-hidden">
                <CaricaturePreviewSmall skin={activeSkin} hair={activeHair} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPhotoPreview(null)} className="text-slate-300"><Upload size={16} className="rotate-180" /></Button>
          </div>
        )}
      </div>

      {/* Caricatura Premium Preview */}
      <div className="flex justify-center py-4">
        <div className="relative w-64 h-72 flex flex-col items-center">
          {/* Cabeça */}
          <div className="relative w-36 h-44 z-20">
            {/* Orelhas com profundidade */}
            <div className="absolute top-[45%] -left-3 w-7 h-9 rounded-full" style={{ backgroundColor: activeSkin, filter: 'brightness(0.9)' }} />
            <div className="absolute top-[45%] -right-3 w-7 h-9 rounded-full" style={{ backgroundColor: activeSkin, filter: 'brightness(0.9)' }} />
            
            {/* Rosto */}
            <div className="w-full h-full rounded-[40%_40%_45%_45%] shadow-2xl relative overflow-hidden transition-all duration-500" style={{ backgroundColor: activeSkin }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              
              {/* Sobrancelhas realistas */}
              <div className="absolute top-[32%] left-0 right-0 flex justify-center gap-9 z-20">
                 <div className="w-9 h-2.5 rounded-full rotate-[-4deg]" style={{ backgroundColor: activeHair, opacity: 0.8 }} />
                 <div className="w-9 h-2.5 rounded-full rotate-[4deg]" style={{ backgroundColor: activeHair, opacity: 0.8 }} />
              </div>

              {/* Olhos com Íris e Brilho */}
              <div className="absolute top-[42%] left-0 right-0 flex justify-center gap-8 z-20">
                {[1, 2].map(i => (
                  <div key={i} className="w-8 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                    <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: activeEye }}>
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {traits.glasses && (
                <div className="absolute top-[38%] left-[5%] right-[5%] flex items-center justify-between z-30">
                  <div className="w-12 h-10 border-[2.5px] border-slate-900 rounded-xl bg-white/5" />
                  <div className="w-6 h-[2.5px] bg-slate-900" />
                  <div className="w-12 h-10 border-[2.5px] border-slate-900 rounded-xl bg-white/5" />
                </div>
              )}

              {/* Nariz e Sorriso (Traços da foto) */}
              <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-5 h-2 bg-black/10 rounded-full blur-[0.5px]" />
              <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-12 h-4 border-b-2 border-black/20 rounded-[50%]" />
            </div>

            {/* Cabelo com textura */}
            {traits.hairStyle !== 'Careca' && (
              <div className="absolute -top-5 -left-2 -right-2 h-[55%] z-30">
                <div 
                  className={cn(
                    "w-full h-full transition-all duration-500 relative",
                    traits.hairStyle === 'Topete' && "rounded-[40%_60%_10%_10%] scale-x-110",
                    traits.hairStyle === 'Curto' && "rounded-[40%_40%_10%_10%]",
                    traits.hairStyle === 'Arrepiado' && "rounded-[30%_30%_0_0] scale-y-110",
                    traits.hairStyle === 'Longo' && "h-[140%] rounded-[40%_40%_20%_20%]"
                  )}
                  style={{ backgroundColor: activeHair, boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.3)' }}
                >
                  {/* Detalhes de mechas */}
                  <div className="absolute top-2 left-4 w-1/3 h-1.5 bg-white/10 rounded-full rotate-[-10deg]" />
                  <div className="absolute top-4 right-6 w-1/4 h-1 bg-white/5 rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* Roupa (Camisa Polo da Foto) */}
          <div className="absolute bottom-0 w-52 h-28 z-10 flex flex-col items-center">
            {/* Ombros */}
            <div className="absolute bottom-0 w-full h-20 bg-slate-900 rounded-[3rem_3rem_0_0]" />
            {/* Gola Polo */}
            <div className="absolute top-2 w-24 h-10 flex justify-center z-20">
               <div className="w-12 h-12 bg-slate-800 rotate-45 -translate-y-4 rounded-lg border-b-4 border-slate-700" />
               <div className="w-12 h-12 bg-slate-800 -rotate-45 -translate-y-4 rounded-lg border-b-4 border-slate-700" />
            </div>
            {/* Botões e Peitilho */}
            <div className="absolute top-8 w-6 h-12 bg-slate-800/50 rounded-b-md flex flex-col items-center gap-1.5 pt-2">
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-2"><Ruler size={14} /> Altura (cm)</span>
              <Input type="number" value={traits.height} onChange={(e) => setTraits({...traits, height: e.target.value})} className="w-20 h-8 text-center font-bold" />
            </Label>
            <input type="range" min="140" max="230" value={traits.height} onChange={(e) => setTraits({...traits, height: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-2"><Weight size={14} /> Peso (kg)</span>
              <Input type="number" value={traits.weight} onChange={(e) => setTraits({...traits, weight: e.target.value})} className="w-20 h-8 text-center font-bold" />
            </Label>
            <input type="range" min="30" max="200" value={traits.weight} onChange={(e) => setTraits({...traits, weight: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          <div className={cn("flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all", traits.glasses ? "bg-blue-50 border-primary/20" : "bg-slate-50 border-transparent")} onClick={() => setTraits({...traits, glasses: !traits.glasses})}>
            <Checkbox checked={traits.glasses} />
            <span className="text-sm font-black text-slate-700 flex items-center gap-2"><Glasses size={18} /> Uso óculos</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pele & Cabelo</Label>
            <div className="flex flex-wrap gap-2">
              {skinTones.map(s => <button key={s.name} onClick={() => setTraits({...traits, skinTone: s.name})} className={cn("w-9 h-9 rounded-xl border-4 transition-all", traits.skinTone === s.name ? "border-primary scale-110 shadow-lg" : "border-white")} style={{ backgroundColor: s.color }} />)}
              <div className="w-px h-9 bg-slate-100 mx-1" />
              {hairColors.map(c => <button key={c.name} onClick={() => setTraits({...traits, hairColor: c.name})} className={cn("w-9 h-9 rounded-xl border-4 transition-all", traits.hairColor === c.name ? "border-primary scale-110 shadow-lg" : "border-white")} style={{ backgroundColor: c.color }} />)}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Estilo de Corte</Label>
            <div className="flex flex-wrap gap-2">
              {hairStyles.map(style => <Button key={style} variant={traits.hairStyle === style ? 'default' : 'outline'} size="sm" onClick={() => setTraits({...traits, hairStyle: style})} className={cn("rounded-xl px-3 h-9 text-[10px] font-black uppercase", traits.hairStyle === style ? "bg-primary" : "border-slate-200")}>{style}</Button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black text-slate-300">PULAR</Button>
        <Button onClick={() => onSave(traits)} className="flex-[2] h-16 bg-primary hover:bg-primary/90 rounded-[1.5rem] font-black text-white shadow-2xl transition-all active:scale-95 text-lg">FINALIZAR CARICATURA</Button>
      </div>
    </div>
  );
};

const CaricaturePreviewSmall = ({ skin, hair }: { skin: string, hair: string }) => (
  <div className="relative w-16 h-16" style={{ backgroundColor: skin }}>
     <div className="absolute top-0 left-0 w-full h-[40%]" style={{ backgroundColor: hair }} />
     <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full shadow-sm" />
     <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full shadow-sm" />
  </div>
);

export default AvatarCreator;