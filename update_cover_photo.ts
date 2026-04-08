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

async function updateCoverPhoto() {
  const propertyId = 5; // Based on previous list_properties.ts output
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
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
  if (images && images.length >= 3) {
    // Third photo is at index 2
    const thirdPhotoIndex = 2;
    const thirdPhoto = images[thirdPhotoIndex];
    
    // Create new images array
    const newImages = [...images];
    // Remove the third photo from its current position
    newImages.splice(thirdPhotoIndex, 1);
    // Add it to the beginning of the array
    newImages.unshift(thirdPhoto);

    const { error: updateError } = await supabase
      .from('properties')
      .update({ images: newImages })
      .eq('id', propertyId);

    if (updateError) {
      console.error('Error updating property:', updateError);
    } else {
      console.log('Property cover photo updated successfully!');
    }
  } else {
    console.error('Property does not have at least 3 images.');
  }
}

updateCoverPhoto();
