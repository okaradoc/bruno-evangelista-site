import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BedDouble, Bath, Maximize, Search, Trash2, PlusCircle, MapPin, Play } from 'lucide-react';
import { PropertyRegistrationModal } from './PropertyRegistrationModal';
import { supabase } from '../lib/supabase';
import { PropertyWithImages } from '../types/property';
import { storageService } from '../services/storageService';

export function Catalog() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFinancing, setSelectedFinancing] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('imoveis')
          .select('*, imagens:imovel_imagens(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map images to include URLs
        const propertiesWithUrls = (data || []).map((prop: any) => ({
          ...prop,
          imagens: (prop.imagens || []).map((img: any) => ({
            ...img,
            url: storageService.getPublicUrl(img.storage_path)
          }))
        }));

        setProperties(propertiesWithUrls);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Show only properties with at least one image (new interface)
      if (!property.imagens || property.imagens.length === 0) return false;

      // Search term filter (titulo, descricao, or ID)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        property.titulo.toLowerCase().includes(searchLower) ||
        property.descricao.toLowerCase().includes(searchLower) ||
        property.id.toString().includes(searchLower);

      // Type filter
      const matchesType = selectedType === '' || property.tipo === selectedType;

      // Transaction Type filter
      const matchesTransactionType = selectedTransactionType === '' || property.transacao === selectedTransactionType;

      // City filter
      const matchesCity = selectedCity === '' || property.cidade === selectedCity;

      // Price filter
      const price = property.preco;
      const min = minPrice === '' ? 0 : Number(minPrice);
      const max = maxPrice === '' ? Infinity : Number(maxPrice);
      const matchesPrice = price >= min && price <= max;

      // Financing filter
      const matchesFinancing = selectedFinancing === '' || 
        (selectedFinancing === 'Sim' ? property.aceita_financiamento === true : property.aceita_financiamento === false);

      return matchesSearch && matchesType && matchesTransactionType && matchesCity && matchesPrice && matchesFinancing;
    });
  }, [properties, searchTerm, selectedType, selectedTransactionType, selectedCity, minPrice, maxPrice, selectedFinancing]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedTransactionType('');
    setSelectedCity('');
    setSelectedFinancing('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <section id="imoveis" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-copper-600 font-medium tracking-widest uppercase text-sm mb-3"
            >
              Catálogo Exclusivo
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-serif text-petroleum-900 leading-tight"
            >
              Encontre o Imóvel que você deseja
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-px bg-copper-500 mt-6"
            ></motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 text-petroleum-900 font-medium rounded-sm hover:bg-yellow-400 transition-colors shadow-lg gap-2"
          >
            <PlusCircle size={20} />
            Clique Aqui para Anunciar seu Imóvel
          </motion.button>
        </div>

        {/* Property Registration Modal */}
        <PropertyRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-sm shadow-md border border-gray-100 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Busca</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Título, descrição ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Transação</label>
              <select
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 bg-white"
              >
                <option value="">Comprar/Alugar</option>
                <option value="Venda">Comprar</option>
                <option value="Aluguel">Alugar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Cidade</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 bg-white"
              >
                <option value="">Todas as cidades</option>
                {Array.from(new Set(properties.map(p => p.cidade).filter(Boolean))).sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Categoria</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 bg-white"
              >
                <option value="">Todos os tipos</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
                <option value="Chácara/Sítio">Chácara/Sítio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Financiamento</label>
              <select
                value={selectedFinancing}
                onChange={(e) => setSelectedFinancing(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 bg-white"
              >
                <option value="">Sim/Não</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Preço Mín.</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Preço Máx.</label>
                <input
                  type="number"
                  placeholder="Ilimitado"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-sm transition-colors"
                title="Limpar filtros"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Limpar
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-copper-500"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum imóvel encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col"
              >
                <Link to={`/imovel/${property.id}`} className="block relative h-64 overflow-hidden group">
                  {(() => {
                    const capa = property.imagens?.find(img => img.tipo === 'capa') || property.imagens?.[0];
                    const isVideo = capa?.tipo === 'video' || ['mp4', 'webm', 'mov', 'quicktime'].includes(capa?.nome_arquivo?.toLowerCase().split('.').pop() || '');
                    
                    if (isVideo && capa?.url) {
                      return (
                        <div className="w-full h-full relative">
                          <video 
                            src={capa.url} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            muted
                            playsInline
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full text-white opacity-80 group-hover:opacity-0 transition-opacity">
                              <Play size={32} fill="currentColor" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <img 
                        src={capa?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'} 
                        alt={property.titulo} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    );
                  })()}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-petroleum-900 text-white px-3 py-1 text-xs font-medium rounded-sm shadow-md">
                      {property.tipo}
                    </div>
                    {property.transacao && (
                      <div className="bg-copper-600 text-white px-3 py-1 text-xs font-medium rounded-sm shadow-md">
                        {property.transacao}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <Link to={`/imovel/${property.id}`}>
                    <h4 className="text-xl font-serif text-petroleum-900 mb-2 hover:text-copper-600 transition-colors line-clamp-2">
                      {property.titulo}
                    </h4>
                  </Link>
                  {property.cidade && (
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-copper-500" />
                      {property.cidade} {property.bairro && <span className="text-xs ml-1">- {property.bairro}</span>}
                    </p>
                  )}
                  <p className="text-2xl font-medium text-copper-600 mb-4">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                  </p>
                  
                  <div className="flex items-center justify-between text-gray-500 text-sm mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center" title="Quartos">
                      < BedDouble className="w-4 h-4 mr-1 text-copper-400" />
                      <span>{property.quartos}</span>
                    </div>
                    <div className="flex items-center" title="Banheiros">
                      <Bath className="w-4 h-4 mr-1 text-copper-400" />
                      <span>{property.banheiros}</span>
                    </div>
                    <div className="flex items-center" title="Área">
                      <Maximize className="w-4 h-4 mr-1 text-copper-400" />
                      <span>{property.area} m²</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
