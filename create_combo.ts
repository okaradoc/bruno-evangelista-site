import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createComboProperty() {
  // Fetch the two properties to combine their images and descriptions
  const { data: properties, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .ilike('title', '%Avenida Coronel Bertoldo%');

  if (fetchError) {
    console.error('Error fetching properties:', fetchError);
    return;
  }

  if (!properties || properties.length < 2) {
    console.error('Could not find both properties on Coronel Bertoldo.');
    return;
  }

  // Combine images (unique)
  const allImages = [...new Set([...properties[0].images, ...properties[1].images])];
  
  const comboProperty = {
    title: "COMBO: 2 Imóveis Comerciais - Centro - Santa Isabel/SP",
    description: `Oportunidade única de investimento! Combo exclusivo com dois imóveis comerciais localizados na Avenida Coronel Bertoldo, no coração de Santa Isabel.\n\nImóvel 1: ${properties[0].title}\nImóvel 2: ${properties[1].title}\n\nLocalização privilegiada com alto fluxo de pedestres e veículos. Ideal para grandes empreendimentos ou investidores que buscam renda passiva em localização estratégica.`,
    price: 1500000,
    type: "Comercial",
    transactionType: "Venda",
    city: "Santa Isabel",
    bedrooms: 0,
    bathrooms: 0,
    area: properties[0].area + properties[1].area,
    images: allImages,
    financing: false
  };

  const { data, error } = await supabase
    .from('properties')
    .insert([comboProperty]);

  if (error) {
    console.error('Error creating combo property:', error);
  } else {
    console.log('Combo property created successfully!');
  }
}

createComboProperty();
