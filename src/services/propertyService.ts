import { supabase } from '../lib/supabase';
import { Property, PropertyImage, PropertyWithImages, ImageType } from '../types/property';

export const propertyService = {
  /**
   * Creates or updates a property.
   */
  async saveProperty(property: Partial<Property>): Promise<Property> {
    try {
      // Filter only valid fields for the 'imoveis' table
      const validFields = [
        'titulo', 'descricao', 'preco', 'tipo', 'transacao', 
        'cidade', 'bairro', 'quartos', 'banheiros', 'area', 
        'aceita_financiamento'
      ];
      
      const dataToSave: any = {};
      validFields.forEach(field => {
        if (field in property) {
          dataToSave[field] = (property as any)[field];
        }
      });

      // If updating, include the ID
      if (property.id) {
        dataToSave.id = property.id;
      }

      dataToSave.updated_at = new Date().toISOString();

      console.log('Saving property to Supabase:', dataToSave);

      const { data, error } = await supabase
        .from('imoveis')
        .upsert(dataToSave)
        .select()
        .single();

      if (error) {
        console.error('Supabase error in saveProperty:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Erro ao salvar imóvel: Nenhum dado retornado.');
      }

      return data;
    } catch (err: any) {
      console.error('Error in saveProperty:', err);
      throw err;
    }
  },

  /**
   * Saves an image record in the database.
   */
  async saveImageRecord(image: Partial<PropertyImage>): Promise<PropertyImage> {
    const { data, error } = await supabase
      .from('imovel_imagens')
      .insert({
        ...image,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes an image record and its file from Storage.
   */
  async deleteImage(image: PropertyImage): Promise<void> {
    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('site-assets')
        .remove([image.storage_path]);
      
      if (storageError) {
        console.warn('Image might not have been deleted from storage:', storageError);
      }

      // 2. Delete from Database
      const { error: dbError } = await supabase
        .from('imovel_imagens')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;
    } catch (err) {
      console.error('Error in deleteImage:', err);
      throw err;
    }
  },

  /**
   * Deletes an image record from the database.
   */
  async deleteImageRecord(imageId: string): Promise<void> {
    const { error } = await supabase
      .from('imovel_imagens')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  },

  /**
   * Updates the order of images in a gallery.
   */
  async updateImagesOrder(images: { id: string; ordem: number }[]): Promise<void> {
    const { error } = await supabase
      .from('imovel_imagens')
      .upsert(images);

    if (error) throw error;
  },

  /**
   * Sets a specific image as the cover for a property.
   * This involves setting its type to 'capa' and ensuring other images are not 'capa'.
   */
  async setAsCover(propertyId: string, imageId: string): Promise<void> {
    // 1. Set all images of this property to 'galeria' if they were 'capa'
    const { error: resetError } = await supabase
      .from('imovel_imagens')
      .update({ tipo: 'galeria' })
      .eq('imovel_id', propertyId)
      .eq('tipo', 'capa');

    if (resetError) throw resetError;

    // 2. Set the target image as 'capa'
    const { error: setError } = await supabase
      .from('imovel_imagens')
      .update({ tipo: 'capa' })
      .eq('id', imageId);

    if (setError) throw setError;
  },

  /**
   * Fetches a property with all its images.
   */
  async getPropertyWithImages(propertyId: string): Promise<PropertyWithImages> {
    const { data: property, error: propertyError } = await supabase
      .from('imoveis')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError) throw propertyError;

    const { data: images, error: imagesError } = await supabase
      .from('imovel_imagens')
      .select('*')
      .eq('imovel_id', propertyId)
      .order('ordem', { ascending: true });

    if (imagesError) throw imagesError;

    return {
      ...property,
      imagens: images || [],
    };
  },

  /**
   * Deletes a property and all its associated images (DB and Storage).
   */
  async deleteProperty(propertyId: string): Promise<void> {
    try {
      // 1. Get all images for this property
      const { data: images, error: fetchError } = await supabase
        .from('imovel_imagens')
        .select('storage_path')
        .eq('imovel_id', propertyId);

      if (fetchError) throw fetchError;

      // 2. Delete images from Storage
      if (images && images.length > 0) {
        const paths = images.map(img => img.storage_path);
        const { error: storageError } = await supabase.storage
          .from('site-assets')
          .remove(paths);
        
        if (storageError) {
          console.warn('Some images might not have been deleted from storage:', storageError);
        }
      }

      // 3. Delete image records from DB (if no CASCADE)
      const { error: imagesDbError } = await supabase
        .from('imovel_imagens')
        .delete()
        .eq('imovel_id', propertyId);
      
      if (imagesDbError) throw imagesDbError;

      // 4. Delete property record
      const { error: propertyError } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', propertyId);

      if (propertyError) throw propertyError;
    } catch (err) {
      console.error('Error in deleteProperty:', err);
      throw err;
    }
  },
};
