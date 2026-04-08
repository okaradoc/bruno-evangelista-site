import { useEffect, useState, FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Home, ArrowUpDown, Edit2, GripVertical, X, CheckCircle2, Image as ImageIcon, Play } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Property, PropertyWithImages } from '../types/property';
import { PropertyForm } from '../components/PropertyUpload/PropertyForm';
import { propertyService } from '../services/propertyService';
import { storageService } from '../services/storageService';

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  transactionType: string;
  price: string;
  city: string;
  location: string;
  description: string;
}

export function AdminDashboard() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'leads' | 'settings'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [smtpSettings, setSmtpSettings] = useState({
    host: 'smtp-relay.brevo.com',
    port: '587',
    user: 'a6298a001@smtp-brevo.com',
    sender: 'brunoevangelistasi@proton.me',
    pass: '',
    contactEmail: 'engenhariaeimoveis@hotmail.com'
  });

  const displayedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      const indexA = a.order_index ?? 0;
      const indexB = b.order_index ?? 0;
      return sortAscending ? indexA - indexB : indexB - indexA;
    });
  }, [properties, sortAscending]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/acesso-restrito-be');
        return;
      }
      await Promise.all([fetchProperties(), fetchLeads()]);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const { data: props, error: propsError } = await supabase
        .from('imoveis')
        .select('*')
        .order('created_at', { ascending: false });

      if (propsError) throw propsError;

      const propsWithImages = await Promise.all(
        (props || []).map(async (p) => {
          const { data: images } = await supabase
            .from('imovel_imagens')
            .select('*')
            .eq('imovel_id', p.id)
            .order('ordem', { ascending: true });

          return {
            ...p,
            imagens: images || [],
          };
        })
      );

      setProperties(propsWithImages);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEdit = (prop: PropertyWithImages) => {
    setEditingId(prop.id);
    // Switch to form tab on mobile
    setActiveTab('form');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (!sortAscending) {
      alert('Para reordenar, a lista deve estar na ordem natural (Mais antigos primeiro).');
      return;
    }

    const items = Array.from(properties);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedItems = items.map((item: Property, index: number) => ({
      ...item,
      order_index: index
    }));

    // Optimistic update
    const previousProperties = [...properties];
    setProperties(reorderedItems);

    // Update order_index in Supabase
    try {
      // Use a single update if possible, but Supabase doesn't support bulk update with different values easily
      // We'll update only the ones that changed to be more efficient
      const updates = reorderedItems.filter((item, index) => item.order_index !== properties[index]?.order_index);
      
      const updatePromises = reorderedItems.map((item: Property, index: number) => 
        supabase
          .from('imoveis')
          .update({ order_index: index })
          .eq('id', item.id)
      );

      const results = await Promise.all(updatePromises);
      const firstError = results.find(r => r.error);

      if (firstError) {
        console.error('Error updating order:', firstError.error);
        alert('Erro ao salvar a nova ordem. Verifique se a coluna "order_index" existe no seu banco de dados.');
        setProperties(previousProperties);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setProperties(previousProperties);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await propertyService.deleteProperty(id);
      await fetchProperties();
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error('Error deleting property:', err);
      alert('Erro ao remover imóvel: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (!error) {
        setLeads(leads.filter(l => l.id !== id));
        setDeleteLeadId(null);
      } else {
        alert('Erro ao remover lead: ' + error.message);
      }
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      alert('Erro: ' + (err.message || 'Erro desconhecido'));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-copper-500"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-serif text-petroleum-900 flex items-center">
            <Home className="w-8 h-8 mr-3 text-copper-600" />
            Painel do Corretor
          </h1>
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setActiveTab(activeTab === 'leads' ? 'list' : 'leads')}
                className="px-4 py-2 bg-copper-100 text-copper-700 rounded-sm hover:bg-copper-200 transition-colors font-medium text-sm"
              >
                {activeTab === 'leads' ? 'Ver Imóveis' : `Ver Leads (${leads.length})`}
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm md:text-base"
            >
              <LogOut className="w-5 h-5 mr-2" /> Sair
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'list' ? 'border-copper-600 text-copper-600' : 'border-transparent text-gray-500'}`}
          >
            Imóveis
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'form' ? 'border-copper-600 text-copper-600' : 'border-transparent text-gray-500'}`}
          >
            {editingId ? 'Editar' : 'Novo Imóvel'}
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'leads' ? 'border-copper-600 text-copper-600' : 'border-transparent text-gray-500'}`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'settings' ? 'border-copper-600 text-copper-600' : 'border-transparent text-gray-500'}`}
          >
            Configurações
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="lg:col-span-3 bg-white p-4 md:p-8 rounded-sm shadow-md border border-gray-100">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-serif text-petroleum-900 mb-2">Configurações de E-mail (SMTP)</h2>
                <p className="text-gray-500 mb-8">
                  Preencha os campos abaixo com os dados do seu servidor de e-mail. 
                  <span className="block mt-2 font-medium text-copper-600">Importante: Para que estas configurações funcionem permanentemente, você deve salvá-las no menu "Settings" do AI Studio.</span>
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server (SMTP_HOST)</label>
                      <input 
                        type="text" 
                        value={smtpSettings.host} 
                        onChange={e => setSmtpSettings({...smtpSettings, host: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Port (SMTP_PORT)</label>
                      <input 
                        type="text" 
                        value={smtpSettings.port} 
                        onChange={e => setSmtpSettings({...smtpSettings, port: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Login / SMTP_USER</label>
                    <input 
                      type="text" 
                      value={smtpSettings.user} 
                      onChange={e => setSmtpSettings({...smtpSettings, user: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sender / SMTP_SENDER</label>
                    <input 
                      type="text" 
                      value={smtpSettings.sender} 
                      onChange={e => setSmtpSettings({...smtpSettings, sender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP KEY (Senha / SMTP_PASS)</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        value={smtpSettings.pass} 
                        onChange={e => setSmtpSettings({...smtpSettings, pass: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Destino (CONTACT_EMAIL)</label>
                    <input 
                      type="text" 
                      value={smtpSettings.contactEmail} 
                      onChange={e => setSmtpSettings({...smtpSettings, contactEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500" 
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button
                      onClick={() => alert('Configurações salvas localmente. Lembre-se de atualizar as variáveis de ambiente no AI Studio para persistir estas mudanças no servidor.')}
                      className="px-6 py-3 bg-petroleum-900 text-white font-medium rounded-sm hover:bg-petroleum-800 transition-colors shadow-md"
                    >
                      Salvar Configurações
                    </button>
                    <div className="mt-6 bg-copper-50 border border-copper-100 p-4 rounded-sm">
                      <h4 className="text-copper-800 font-medium mb-2 flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Pronto para uso!
                      </h4>
                      <p className="text-copper-700 text-sm">
                        O código do site já foi atualizado para reconhecer estes campos. 
                        Certifique-se de que as variáveis de ambiente correspondentes foram criadas no painel de controle do projeto no AI Studio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leads View (Full Width on Desktop) */}
          {(activeTab === 'leads') && (
            <div className="lg:col-span-3 bg-white p-4 md:p-6 rounded-sm shadow-md border border-gray-100">
              <h2 className="text-xl font-serif text-petroleum-900 mb-6">Leads de Registro de Imóveis</h2>
              {leads.length === 0 ? (
                <p className="text-gray-500">Nenhum lead recebido ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-serif text-petroleum-900">Data</th>
                        <th className="py-3 px-4 font-serif text-petroleum-900">Cliente</th>
                        <th className="py-3 px-4 font-serif text-petroleum-900">Contato</th>
                        <th className="py-3 px-4 font-serif text-petroleum-900">Imóvel</th>
                        <th className="py-3 px-4 font-serif text-petroleum-900">Localização</th>
                        <th className="py-3 px-4 font-serif text-petroleum-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead: Lead) => (
                        <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-petroleum-900">{lead.name}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xs italic">
                              "{lead.description || 'Sem descrição'}"
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            <div>{lead.email}</div>
                            <div>{lead.phone}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            <div className="font-medium">{lead.propertyType}</div>
                            <div>{lead.transactionType}</div>
                            <div className="text-copper-600">{lead.price}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            <div>{lead.city}</div>
                            <div className="text-xs">{lead.location}</div>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => setDeleteLeadId(lead.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Remover Lead"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Property Management View */}
          {(activeTab !== 'leads' && activeTab !== 'settings') && (
            <div className="lg:col-span-3">
              {activeTab === 'form' ? (
                <div className="bg-white rounded-sm shadow-md border border-gray-100">
                  <PropertyForm
                    propertyId={editingId || undefined}
                    onSuccess={() => {
                      setActiveTab('list');
                      fetchProperties();
                    }}
                    onCancel={() => setActiveTab('list')}
                  />
                </div>
              ) : (
                <div className="bg-white p-4 md:p-6 rounded-sm shadow-md border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif text-petroleum-900">Imóveis Cadastrados</h2>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setActiveTab('form');
                        }}
                        className="flex items-center gap-2 bg-copper-600 text-white px-4 py-2 rounded-sm font-medium hover:bg-copper-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Novo Imóvel
                      </button>
                    </div>
                  </div>
                  
                  {properties.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum imóvel cadastrado no novo sistema.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((prop) => {
                        const capa = prop.imagens.find(img => img.tipo === 'capa') || prop.imagens[0];
                        const capaUrl = capa ? storageService.getPublicUrl(capa.storage_path) : '';

                        return (
                          <div 
                            key={prop.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-sm hover:shadow-sm transition-all group gap-4"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                {capaUrl ? (
                                  <div className="w-full h-full relative">
                                    {capa?.tipo === 'video' ? (
                                      <>
                                        <video src={capaUrl} className="w-full h-full object-cover" muted playsInline />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                          <Play size={16} className="text-white fill-current" />
                                        </div>
                                      </>
                                    ) : (
                                      <img src={capaUrl} alt={prop.titulo} className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-petroleum-900 truncate">{prop.titulo}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-copper-600 font-semibold text-sm">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.preco)}
                                  </p>
                                  <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">
                                    {prop.tipo}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    • {prop.imagens.length} fotos
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                              <button 
                                onClick={() => {
                                  setEditingId(prop.id);
                                  setActiveTab('form');
                                }}
                                className="p-2 text-petroleum-400 hover:bg-petroleum-50 rounded-full transition-colors"
                                title="Editar Imóvel"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirmId(prop.id)}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                                title="Remover Imóvel"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Property Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-sm p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-serif text-petroleum-900 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover este imóvel e todas as suas imagens? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir Permanentemente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Lead Confirmation Modal */}
      <AnimatePresence>
        {deleteLeadId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-sm p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-serif text-petroleum-900 mb-4">Confirmar Exclusão de Lead</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover este lead?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setDeleteLeadId(null)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDeleteLead(deleteLeadId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
