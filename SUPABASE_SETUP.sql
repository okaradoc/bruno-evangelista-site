-- SQL para refatoração do sistema de imóveis
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar tabela de imóveis (imoveis)
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tipo TEXT DEFAULT 'Casa', -- Casa, Apartamento, Terreno, Comercial, Chácara/Sítio
  transacao TEXT DEFAULT 'Venda', -- Venda, Aluguel
  cidade TEXT DEFAULT 'Santa Isabel',
  bairro TEXT,
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  area DECIMAL(10, 2) DEFAULT 0,
  aceita_financiamento BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de imagens dos imóveis (imovel_imagens)
CREATE TABLE IF NOT EXISTS imovel_imagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  tipo TEXT NOT NULL, -- capa, galeria, planta
  ordem INTEGER DEFAULT 0,
  nome_arquivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE imovel_imagens ENABLE ROW LEVEL SECURITY;

-- 4. Criar Políticas de Segurança (Policies)
-- Permitir leitura pública
CREATE POLICY "Leitura pública de imoveis" ON imoveis FOR SELECT TO public USING (true);
CREATE POLICY "Leitura pública de imovel_imagens" ON imovel_imagens FOR SELECT TO public USING (true);

-- Permitir gestão total para usuários autenticados (Admin)
CREATE POLICY "Gestão total para admin em imoveis" ON imoveis FOR ALL TO authenticated USING (true);
CREATE POLICY "Gestão total para admin em imovel_imagens" ON imovel_imagens FOR ALL TO authenticated USING (true);

-- 5. Configuração do Storage
-- Certifique-se de criar o bucket 'site-assets' no painel do Supabase Storage
-- e definir as políticas de acesso para o bucket:
-- - SELECT: public (true)
-- - INSERT/UPDATE/DELETE: authenticated (true)
