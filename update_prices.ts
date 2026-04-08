import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updatePrices() {
  const updates = [
    {
      title: "CASA - Jardim Monte Serrat - Santa Isabel/SP",
      newPrice: 280000
    },
    {
      title: "TERRENO - Jardim Monte Serrat - Santa Isabel/SP",
      newPrice: 290000
    }
  ];

  for (const update of updates) {
    const { data, error } = await supabase
      .from('properties')
      .update({ price: update.newPrice })
      .ilike('title', `%${update.title}%`);

    if (error) {
      console.error(`Error updating ${update.title}:`, error);
    } else {
      console.log(`Updated ${update.title} to R$ ${update.newPrice}`);
    }
  }
}

updatePrices();
