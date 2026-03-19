"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Glasses, Ruler, Weight, Palette, UserCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface AvatarData {
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  glasses: boolean;
  hairStyle: string;
}

interface AvatarCreatorProps {
  data: AvatarData;
  onChange: (data: AvatarData) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const AvatarCreator = ({ data, onChange, onConfirm, onCancel }: AvatarCreatorProps) => {
  const styles = [
    { id: 'short', name: 'Curto' },
    { id: 'long', name: 'Longo' },
    { id: 'bald', name: 'Calvo' },
    { id: 'side', name: 'De lado' },
    { id: 'curly', name: 'Cacheado' },
    { id: 'mohawk', name: 'Moicano' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Ruler size={14} /> Altura</Label>
          <Select value={data.height} onValueChange={(v) => onChange({ ...data, height: v })}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Weight size={14} /> Peso</Label>
          <Select value={data.weight} onValueChange={(v) => onChange({ ...data, weight: v })}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="magro">Magro</SelectItem>
              <SelectItem value="atletico">Atlético</SelectItem>
              <SelectItem value="robusto">Robusto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Palette size={14} /> Cabelo</Label>
          <Select value={data.hairColor} onValueChange={(v) => onChange({ ...data, hairColor: v })}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Cor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preto">Preto</SelectItem>
              <SelectItem value="castanho">Castanho</SelectItem>
              <SelectItem value="loiro">Loiro</SelectItem>
              <SelectItem value="ruivo">Ruivo</SelectItem>
              <SelectItem value="grisalho">Grisalho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Palette size={14} /> Olhos</Label>
          <Select value={data.eyeColor} onValueChange={(v) => onChange({ ...data, eyeColor: v })}>
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Cor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="castanho">Castanho</SelectItem>
              <SelectItem value="azul">Azul</SelectItem>
              <SelectItem value="verde">Verde</SelectItem>
              <SelectItem value="preto">Preto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase">Estilo de Cabelo</Label>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => (
            <Button
              key={style.id}
              variant={data.hairStyle === style.id ? "default" : "outline"}
              onClick={() => onChange({ ...data, hairStyle: style.id })}
              className={cn(
                "h-10 text-[10px] font-bold rounded-xl",
                data.hairStyle === style.id ? "bg-primary" : "bg-white"
              )}
            >
              {style.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <Glasses size={18} /> Usa óculos?
        </div>
        <Switch 
          checked={data.glasses} 
          onCheckedChange={(v) => onChange({ ...data, glasses: v })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-bold">Pular</Button>
        <Button onClick={onConfirm} className="flex-1 h-14 rounded-2xl font-black bg-primary">Salvar</Button>
      </div>
    </div>
  );
};

export default AvatarCreator;