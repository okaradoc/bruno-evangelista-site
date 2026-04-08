export type ImageType = 'capa' | 'galeria' | 'planta' | 'video';

export interface PropertyImage {
  id: string;
  imovel_id: string;
  storage_path: string;
  tipo: ImageType;
  ordem: number;
  nome_arquivo: string;
  created_at: string;
  url?: string;
}

export interface Property {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  tipo: string;
  transacao: string;
  cidade: string;
  bairro: string;
  quartos: number;
  banheiros: number;
  area: number;
  aceita_financiamento: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithImages extends Property {
  imagens: PropertyImage[];
}
