import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageType } from '../../types/property';

interface ImagePickerProps {
  type: ImageType;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  label: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  type,
  onFilesSelected,
  multiple = false,
  label,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const newPreviews: { file: File; url: string }[] = [];

    for (const file of files) {
      // Validate type
      if (!allowedTypes.includes(file.type)) {
        setError(`Tipo de arquivo não permitido: ${file.name}`);
        continue;
      }

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande (máx ${maxSizeMB}MB): ${file.name}`);
        continue;
      }

      validFiles.push(file);
      newPreviews.push({
        file,
        url: URL.createObjectURL(file),
      });
    }

    if (validFiles.length > 0) {
      setError(null);
      if (multiple) {
        setPreviews((prev) => [...prev, ...newPreviews]);
        onFilesSelected(validFiles);
      } else {
        // Clean up old previews
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews(newPreviews);
        onFilesSelected([validFiles[0]]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    const removed = previews[index];
    URL.revokeObjectURL(removed.url);
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    // Note: In a real app, you'd need to sync the actual file list back to the parent
    // For simplicity, we'll assume the parent handles the upload of the current batch
  };

  const clearAll = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {type === 'capa' && <ImageIcon className="w-4 h-4" />}
          {type === 'galeria' && <Upload className="w-4 h-4" />}
          {type === 'planta' && <FileText className="w-4 h-4" />}
          {type === 'video' && <Video className="w-4 h-4" />}
          {label}
        </label>
        {previews.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-red-500 hover:underline"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={allowedTypes.join(',')}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs text-gray-400">
            {allowedTypes.map((t) => t.split('/')[1]).join(', ').toUpperCase()} (Máx. {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
              >
                {preview.file.type.startsWith('image/') ? (
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white p-1 truncate">
                  {preview.file.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
