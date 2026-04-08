import React, { useState, useEffect } from 'react';
import { Save, Plus, Loader2, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Property, PropertyImage, PropertyWithImages, ImageType } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { storageService } from '../../services/storageService';
import { ImagePicker } from './ImagePicker';
import { ImageManager } from './ImageManager';

interface PropertyFormProps {
  propertyId?: string;
  onSuccess?: (property: Property) => void;
  onCancel?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  propertyId,
  onSuccess,
  onCancel,
}) => {
  const [property, setProperty] = useState<Partial<Property>>({
    titulo: '',
    descricao: '',
    preco: 0,
    tipo: 'Casa',
    transacao: 'Venda',
    cidade: 'Santa Isabel',
    bairro: '',
    quartos: 0,
    banheiros: 0,
    area: 0,
    aceita_financiamento: false,
  });
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key in ImageType]: File[] }>({
    capa: [],
    galeria: [],
    video: [],
    planta: [], // Keep for type compatibility if needed, but we won't use it in the form
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyWithImages(propertyId!);
      const { imagens, ...propData } = data;
      setProperty(propData);
      setExistingImages(imagens);
    } catch (err) {
      setError('Erro ao carregar imóvel. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelected = (type: ImageType, files: File[]) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [type]: files,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 0. Check Session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      console.log('Submitting property:', property);

      // 1. Save/Update Property to get ID
      const savedProperty = await propertyService.saveProperty(property);
      const id = savedProperty.id;

      console.log('Property saved with ID:', id);

      // 2. Upload Media
      const allUploads: { file: File; type: ImageType }[] = [
        ...selectedFiles.capa.map((f) => ({ file: f, type: 'capa' as ImageType })),
        ...selectedFiles.galeria.map((f) => ({ file: f, type: 'galeria' as ImageType })),
        ...selectedFiles.video.map((f) => ({ file: f, type: 'video' as ImageType })),
      ];

      // Validate all files before starting uploads
      allUploads.forEach(({ file }) => {
        storageService.validateFile(file);
      });

      if (allUploads.length > 0) {
        setUploadProgress({ current: 0, total: allUploads.length });

        for (let i = 0; i < allUploads.length; i++) {
          const { file, type } = allUploads[i];
          
          console.log(`Uploading ${type} image: ${file.name}`);

          // Upload to Storage
          const { path } = await storageService.uploadImage(id, type, file, {
            convertToWebP: true,
          });

          console.log(`Image uploaded to storage: ${path}`);

          // Save to Database
          await propertyService.saveImageRecord({
            imovel_id: id,
            storage_path: path,
            tipo: type,
            ordem: type === 'galeria' ? existingImages.length + i : 0,
            nome_arquivo: file.name,
          });

          console.log(`Image record saved to database`);

          setUploadProgress({ current: i + 1, total: allUploads.length });
        }
      }

      setSuccess(true);
      setSelectedFiles({ capa: [], galeria: [], video: [], planta: [] });
      
      if (propertyId) {
        await fetchProperty();
      } else {
        onSuccess?.(savedProperty);
      }
    } catch (err: any) {
      console.error('Detailed error in handleSubmit:', err);
      setError(err.message || 'Erro ao salvar imóvel. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (loading && !property.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-medium">Carregando dados do imóvel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {propertyId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </h1>
            <p className="text-sm text-gray-500">
              {propertyId ? `ID: ${propertyId}` : 'Preencha as informações para criar um novo anúncio'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          form="property-form"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {propertyId ? 'Salvar Alterações' : 'Criar Imóvel'}
        </button>
      </div>

      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações Básicas</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Título do Imóvel</label>
              <input
                type="text"
                required
                value={property.titulo}
                onChange={(e) => setProperty({ ...property, titulo: e.target.value })}
                placeholder="Ex: Apartamento Luxo Jardins"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo do Imóvel</label>
                <select
                  value={property.tipo}
                  onChange={(e) => setProperty({ ...property, tipo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Chácara/Sítio">Chácara/Sítio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Transação</label>
                <select
                  value={property.transacao}
                  onChange={(e) => setProperty({ ...property, transacao: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  required
                  value={property.cidade}
                  onChange={(e) => setProperty({ ...property, cidade: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  required
                  value={property.bairro}
                  onChange={(e) => setProperty({ ...property, bairro: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quartos</label>
                <input
                  type="number"
                  value={property.quartos}
                  onChange={(e) => setProperty({ ...property, quartos: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banheiros</label>
                <input
                  type="number"
                  value={property.banheiros}
                  onChange={(e) => setProperty({ ...property, banheiros: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Área (m²)</label>
                <input
                  type="number"
                  value={property.area}
                  onChange={(e) => setProperty({ ...property, area: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="financiamento"
                checked={property.aceita_financiamento}
                onChange={(e) => setProperty({ ...property, aceita_financiamento: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="financiamento" className="text-sm font-medium text-gray-700">
                Aceita Financiamento Bancário
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                required
                rows={4}
                value={property.descricao}
                onChange={(e) => setProperty({ ...property, descricao: e.target.value })}
                placeholder="Detalhes sobre o imóvel..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Preço (R$)</label>
              <input
                type="number"
                required
                min="0"
                value={property.preco}
                onChange={(e) => setProperty({ ...property, preco: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">Imóvel salvo com sucesso!</p>
              </motion.div>
            )}

            {uploadProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2"
              >
                <div className="flex justify-between text-xs font-medium text-blue-700">
                  <span>Enviando imagens...</span>
                  <span>{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-blue-600 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Media Uploads */}
        <div className="lg:col-span-2 space-y-8">
          {/* New Uploads Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Adicionar Mídia
            </h2>

            <div className="grid grid-cols-1 gap-8">
              <ImagePicker
                type="capa"
                label="Imagem de Capa (Principal)"
                onFilesSelected={(files) => handleFilesSelected('capa', files)}
                multiple={false}
              />

              <ImagePicker
                type="galeria"
                label="Galeria de Fotos"
                onFilesSelected={(files) => handleFilesSelected('galeria', files)}
                multiple={true}
              />

              <ImagePicker
                type="video"
                label="Vídeos do Imóvel"
                onFilesSelected={(files) => handleFilesSelected('video', files)}
                multiple={true}
                maxSizeMB={50}
                allowedTypes={['video/mp4', 'video/webm', 'video/quicktime']}
              />
            </div>
          </div>

          {/* Existing Media Management */}
          {propertyId && existingImages.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <ImageManager
                propertyId={propertyId}
                images={existingImages}
                onImagesChange={fetchProperty}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
