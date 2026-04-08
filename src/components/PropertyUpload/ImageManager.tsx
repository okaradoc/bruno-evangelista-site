import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Trash2, Star, GripVertical, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyImage, ImageType } from '../../types/property';
import { storageService } from '../../services/storageService';
import { propertyService } from '../../services/propertyService';

interface ImageManagerProps {
  propertyId: string;
  images: PropertyImage[];
  onImagesChange: () => void;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  propertyId,
  images,
  onImagesChange,
}) => {
  const [localImages, setLocalImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Sort images by order
    const sorted = [...images].sort((a, b) => a.ordem - b.ordem);
    // Add public URLs
    const withUrls = sorted.map((img) => ({
      ...img,
      url: storageService.getPublicUrl(img.storage_path),
    }));
    setLocalImages(withUrls);
  }, [images]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items: PropertyImage[] = Array.from(localImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for responsiveness
    setLocalImages(items);

    // Prepare updates for the database
    const updates = items.map((img, index) => ({
      id: img.id,
      ordem: index,
    }));

    try {
      setLoading('reordering');
      await propertyService.updateImagesOrder(updates);
      onImagesChange();
    } catch (error) {
      console.error('Failed to reorder images:', error);
      // Revert local state on error
      setLocalImages(localImages);
    } finally {
      setLoading(null);
    }
  };

  const [imageToDelete, setImageToDelete] = useState<PropertyImage | null>(null);

  const handleDelete = async (image: PropertyImage) => {
    try {
      setLoading(image.id);
      await propertyService.deleteImage(image);
      onImagesChange();
      setImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Erro ao excluir imagem. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const handleSetAsCover = async (image: PropertyImage) => {
    try {
      setLoading(image.id);
      await propertyService.setAsCover(propertyId, image.id);
      onImagesChange();
    } catch (error) {
      console.error('Failed to set as cover:', error);
    } finally {
      setLoading(null);
    }
  };

  const renderImageCard = (image: PropertyImage, index: number, isDraggable: boolean) => (
    <div
      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
        image.tipo === 'capa' ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-blue-400'
      }`}
    >
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={image.url}
          alt={image.nome_arquivo}
          className="w-full h-full object-cover"
        />
        {loading === image.id && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {image.tipo === 'capa' && (
            <span className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" /> CAPA
            </span>
          )}
          <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {image.tipo.toUpperCase()}
          </span>
        </div>

        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {image.tipo !== 'capa' && (
            <button
              onClick={() => handleSetAsCover(image)}
              className="p-2 bg-white text-yellow-500 rounded-full hover:bg-yellow-50 shadow-lg transition-transform hover:scale-110"
              title="Definir como capa"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setImageToDelete(image)}
            className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 shadow-lg transition-transform hover:scale-110"
            title="Excluir imagem"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isDraggable && (
            <div className="p-2 bg-white text-gray-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      <div className="p-2 bg-white text-[10px] text-gray-500 truncate border-t border-gray-100">
        {image.nome_arquivo}
      </div>
    </div>
  );

  const galleryImages = localImages.filter((img) => img.tipo === 'galeria' || img.tipo === 'capa');
  const plantaImages = localImages.filter((img) => img.tipo === 'planta');

  return (
    <div className="space-y-8">
      {/* Galeria & Capa Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Galeria e Capa
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {galleryImages.length} imagens
            </span>
          </h3>
          <p className="text-xs text-gray-400 italic">Arraste para reordenar a galeria</p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {galleryImages.map((image, index) => (
                  // @ts-ignore
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'z-50' : ''}
                      >
                        {renderImageCard(image, index, true)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      {/* Plantas Section */}
      {plantaImages.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Plantas do Imóvel
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {plantaImages.length} imagens
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {plantaImages.map((image, index) => (
              <div key={image.id}>
                {renderImageCard(image, index, false)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Delete Image Confirmation Modal */}
      <AnimatePresence>
        {imageToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-sm p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-serif text-petroleum-900 mb-4">Excluir Imagem</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setImageToDelete(null)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(imageToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir Permanentemente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
