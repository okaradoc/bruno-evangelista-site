import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updatePricesById() {
  const updates = [
    { id: 5, newPrice: 280000, title: "CASA - Jardim Monte Serrat" },
    { id: 3, newPrice: 290000, title: "TERRENO - Jardim Monte Serrat" }
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('properties')
      .update({ price: update.newPrice })
      .eq('id', update.id);

    if (error) {
      console.error(`Error updating ID ${update.id} (${update.title}):`, error);
    } else {
      console.log(`Updated ID ${update.id} (${update.title}) to R$ ${update.newPrice}`);
    }
  }
}

updatePricesById();
