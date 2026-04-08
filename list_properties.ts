import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, price');

  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  console.log('Current Properties in DB:');
  data.forEach(p => {
    console.log(`ID: ${p.id} | Title: ${p.title} | Price: ${p.price}`);
  });
}

listProperties();
