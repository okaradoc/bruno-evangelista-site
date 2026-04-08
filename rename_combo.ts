import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function renameCombo() {
  const { error } = await supabase
    .from('properties')
    .update({ title: "2 Imóveis - Centro - Santa Isabel/SP" })
    .eq('id', 9);

  if (error) {
    console.error('Error renaming combo:', error);
  } else {
    console.log('Combo renamed successfully!');
  }
}

renameCombo();
