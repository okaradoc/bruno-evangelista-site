import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BedDouble, Bath, Maximize, MapPin, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PropertyWithImages, PropertyImage } from '../types/property';
import { storageService } from '../services/storageService';

export function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isVideo = (img: PropertyImage) => {
    if (img.tipo === 'video') return true;
    const ext = img.nome_arquivo?.toLowerCase().split('.').pop();
    return ['mp4', 'webm', 'mov', 'quicktime'].includes(ext || '');
  };

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('imoveis')
          .select('*, imagens:imovel_imagens(*)')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Map images to include URLs
        const propertyWithUrls = {
          ...data,
          imagens: (data.imagens || []).map((img: any) => ({
            ...img,
            url: storageService.getPublicUrl(img.storage_path)
          }))
        };

        setProperty(propertyWithUrls);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen || !property?.imagens) return;
      
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % property.imagens.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + property.imagens.length) % property.imagens.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, property]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-copper-500"></div></div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-serif text-petroleum-900 mb-4">Imóvel não encontrado</h2>
        <Link to="/" className="text-copper-600 hover:text-copper-700 font-medium flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o início
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(property.preco);

  const whatsappMessage = encodeURIComponent(`Olá Bruno, tenho interesse no imóvel: ${property.titulo} (Ref: ${property.id}). Pode me passar mais informações?`);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property.imagens) {
      setCurrentImageIndex((prev) => (prev + 1) % property.imagens.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property.imagens) {
      setCurrentImageIndex((prev) => (prev - 1 + property.imagens.length) % property.imagens.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Lightbox */}
      {isLightboxOpen && property.imagens && property.imagens.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
          >
            <X size={32} />
          </button>
          
          {property.imagens.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
              >
                <ChevronLeft size={48} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-50"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
            {isVideo(property.imagens[currentImageIndex]) ? (
              <video 
                src={property.imagens[currentImageIndex].url} 
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img 
                src={property.imagens[currentImageIndex].url} 
                alt={`${property.titulo} - Foto ampliada`}
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-widest">
            {currentImageIndex + 1} / {property.imagens.length}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-copper-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o catálogo
        </Link>

        <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col">
            <div 
              className="h-[400px] md:h-[500px] w-full relative cursor-pointer group bg-black"
              onClick={() => setIsLightboxOpen(true)}
            >
              {property.imagens && property.imagens.length > 0 && isVideo(property.imagens[currentImageIndex]) ? (
                <div className="w-full h-full relative">
                  <video 
                    src={property.imagens[currentImageIndex].url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    muted
                    playsInline
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full text-white opacity-80 group-hover:opacity-0 transition-opacity">
                      <Play size={48} fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={property.imagens?.[currentImageIndex]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'} 
                  alt={property.titulo} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm text-petroleum-900 px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                  {property.imagens && property.imagens.length > 0 && isVideo(property.imagens[currentImageIndex]) ? (
                    <><Play size={18} /> Ver vídeo</>
                  ) : (
                    <><Maximize size={18} /> Ampliar imagem</>
                  )}
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-petroleum-900 text-white px-4 py-1 text-sm font-medium rounded-sm shadow-md">
                  {property.tipo}
                </div>
                {property.transacao && (
                  <div className="bg-copper-600 text-white px-4 py-1 text-sm font-medium rounded-sm shadow-md">
                    {property.transacao}
                  </div>
                )}
              </div>
            </div>
            
            {property.imagens && property.imagens.length > 1 && (
              <div className="flex overflow-x-auto p-4 gap-4 bg-gray-50 border-b border-gray-100">
                {property.imagens.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-sm overflow-hidden border-2 transition-all relative ${
                      currentImageIndex === idx ? 'border-copper-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {isVideo(img) ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <video 
                          src={img.url} 
                          className="w-full h-full object-cover opacity-60"
                        />
                        <Play className="absolute text-white w-8 h-8 opacity-80" />
                      </div>
                    ) : (
                      <img 
                        src={img.url} 
                        alt={`${property.titulo} - Foto ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-serif text-petroleum-900 mb-4">{property.titulo}</h1>
              {property.cidade && (
                <p className="text-lg text-gray-500 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-copper-500" />
                  {property.cidade} {property.bairro && <span className="mx-1">- {property.bairro}</span>}
                </p>
              )}
              <p className="text-3xl font-medium text-copper-600 mb-8">{formattedPrice}</p>

              <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <BedDouble className="w-6 h-6 mr-3 text-copper-400" />
                  <span className="text-lg">{property.quartos} Quartos</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Bath className="w-6 h-6 mr-3 text-copper-400" />
                  <span className="text-lg">{property.banheiros} Banheiros</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Maximize className="w-6 h-6 mr-3 text-copper-400" />
                  <span className="text-lg">{property.area} m²</span>
                </div>
                {property.aceita_financiamento && (
                  <div className="flex items-center text-gray-600">
                    <div className="w-6 h-6 mr-3 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <span className="text-lg">
                      Aceita Financiamento
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-serif text-petroleum-900 mb-4">Descrição do Imóvel</h2>
              <div className="text-gray-600 font-light leading-relaxed whitespace-pre-line">
                {property.descricao}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-petroleum-50 p-8 rounded-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-serif text-petroleum-900 mb-4">Interesse neste imóvel?</h3>
                <p className="text-gray-600 text-sm mb-6">Fale diretamente com o corretor responsável para agendar uma visita ou tirar dúvidas.</p>
                
                <a
                  href={`https://wa.me/5511968667275?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-6 py-4 text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors rounded-sm font-medium mb-4 shadow-md"
                >
                  Falar no WhatsApp
                </a>
                
                <a
                  href="mailto:engenhariaeimoveis@hotmail.com"
                  className="w-full flex items-center justify-center px-6 py-4 text-petroleum-900 border border-petroleum-900 hover:bg-petroleum-900 hover:text-white transition-colors rounded-sm font-medium"
                >
                  Enviar E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
