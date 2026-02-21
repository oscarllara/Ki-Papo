"use client";

export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades";

export const fetchStates = async (): Promise<IBGEState[]> => {
  const response = await fetch(`${BASE_URL}/estados?orderBy=nome`);
  const states: IBGEState[] = await response.json();
  
  // Reordenar para colocar MG (Minas Gerais) em primeiro
  const mgIndex = states.findIndex(s => s.sigla === "MG");
  if (mgIndex > -1) {
    const [mg] = states.splice(mgIndex, 1);
    return [mg, ...states];
  }
  
  return states;
};

export const fetchCitiesByState = async (uf: string): Promise<IBGECity[]> => {
  const response = await fetch(`${BASE_URL}/estados/${uf}/municipios?orderBy=nome`);
  return response.json();
};