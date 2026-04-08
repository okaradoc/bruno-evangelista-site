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

async function updateProperty() {
  const propertyTitle = "CHÁCARA - GEREMUNIZ – Próxima ao Centro – Santa Isabel/SP";
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .ilike('title', `%${propertyTitle}%`)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return;
  }

  if (!data) {
    console.error('Property not found.');
    return;
  }

  const images = data.images;
  if (images && images.length >= 2) {
    // Penultimate photo is at index length - 2
    const penultimateIndex = images.length - 2;
    const penultimatePhoto = images[penultimateIndex];
    
    // Remove the penultimate photo from its current position
    const newImages = [...images];
    newImages.splice(penultimateIndex, 1);
    
    // Add it to the beginning of the array
    newImages.unshift(penultimatePhoto);

    const { error: updateError } = await supabase
      .from('properties')
      .update({ images: newImages })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating property:', updateError);
    } else {
      console.log('Property updated successfully!');
    }
  } else {
    console.error('Property does not have enough images.');
  }
}

updateProperty();
