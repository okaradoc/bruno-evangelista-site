import { supabase } from '../lib/supabase';
import { ImageType } from '../types/property';

const BUCKET_NAME = 'site-assets';
const ROOT_PATH = 'imoveis';

export const storageService = {
  /**
   * Validates a file by type and size.
   */
  validateFile(file: File, maxSizeMB: number = 5): void {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedImageTypes.includes(file.type)) {
        throw new Error(`Tipo de imagem não suportado: ${file.type}. Use JPEG, PNG ou WebP.`);
      }
    } else if (isVideo) {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedVideoTypes.includes(file.type)) {
        throw new Error(`Tipo de vídeo não suportado: ${file.type}. Use MP4, WebM ou QuickTime.`);
      }
      // Increase size limit for videos to 50MB by default if not specified
      maxSizeMB = Math.max(maxSizeMB, 50);
    } else {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}.`);
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. O limite é ${maxSizeMB}MB.`);
    }
  },

  /**
   * Converts an image to WebP format using HTML5 Canvas.
   */
  async convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('WebP conversion failed'));
          },
          'image/webp',
          0.85 // Quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image loading failed'));
      };
      
      img.src = objectUrl;
    });
  },

  /**
   * Uploads a file to Supabase Storage.
   */
  async uploadImage(
    propertyId: string,
    type: ImageType,
    file: File,
    options: { convertToWebP?: boolean } = {}
  ): Promise<{ path: string; fullPath: string }> {
    try {
      let uploadData: Blob | File = file;
      let fileName = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;

      if (options.convertToWebP && file.type.startsWith('image/')) {
        try {
          uploadData = await this.convertToWebP(file);
          fileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
        } catch (webpErr) {
          console.warn('WebP conversion failed, falling back to original file:', webpErr);
          uploadData = file;
        }
      }

      const path = `${ROOT_PATH}/${propertyId}/${type}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, uploadData, {
          cacheControl: '3600',
          upsert: false,
          contentType: options.convertToWebP && uploadData instanceof Blob ? 'image/webp' : file.type,
        });

      if (error) throw error;
      if (!data) throw new Error('Upload failed: No data returned');

      return {
        path: data.path,
        fullPath: `${BUCKET_NAME}/${data.path}`,
      };
    } catch (err: any) {
      console.error('Error in uploadImage:', err);
      throw new Error(`Erro no upload da imagem: ${err.message || 'Erro desconhecido'}`);
    }
  },

  /**
   * Deletes a file from Supabase Storage.
   */
  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) throw error;
  },

  /**
   * Gets a public URL for a file.
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  },
};
