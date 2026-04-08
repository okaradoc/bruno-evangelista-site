import { useState, FormEvent, ChangeEvent } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface PropertyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyRegistrationModal({ isOpen, onClose }: PropertyRegistrationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    transactionType: '',
    city: '',
    location: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase Leads table
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            propertyType: formData.propertyType,
            transactionType: formData.transactionType,
            city: formData.city,
            location: formData.location,
            price: formData.price,
            description: formData.description
          }
        ]);

      if (supabaseError) throw supabaseError;

      // 2. Send Email via SMTP
      // Use absolute URL in production (when running from the single HTML file)
      const apiUrl = '/api/contact';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nome: formData.name,
          Email: formData.email,
          Telefone: formData.phone,
          Servico: 'Registro de Imóvel Próprio',
          Assunto: `Novo Imóvel para Cadastro: ${formData.propertyType} em ${formData.city}`,
          Mensagem: `
            Solicitação de cadastro de imóvel próprio:
            - Tipo: ${formData.propertyType}
            - Transação: ${formData.transactionType}
            - Cidade: ${formData.city}
            - Bairro: ${formData.location}
            - Preço Estimado: R$ ${formData.price}
            
            Descrição:
            ${formData.description}
          `
        }),
      });

      if (!response.ok) {
        console.warn('Email notification failed, but lead was saved to database.');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyType: '',
          transactionType: '',
          city: '',
          location: '',
          price: '',
          description: ''
        });
      }, 3000);
    } catch (err: any) {
      alert('Erro ao enviar solicitação: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-petroleum-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-petroleum-900 text-white">
              <h3 className="text-xl font-serif">Cadastrar meu Imóvel</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-serif text-petroleum-900 mb-2">Solicitação Enviada!</h4>
                  <p className="text-gray-500">
                    Recebemos suas informações. Nossa equipe entrará em contato em breve para dar continuidade ao cadastro.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-gray-500 text-sm mb-6">
                    Preencha os dados abaixo para que possamos avaliar e anunciar seu imóvel com o respaldo técnico necessário.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone / WhatsApp</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo do Imóvel</label>
                      <select
                        required
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Terreno">Terreno</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Rural">Rural</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transação</label>
                      <select
                        required
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none bg-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Venda">Venda</option>
                        <option value="Aluguel">Aluguel</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="Ex: Santa Isabel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro / Endereço</label>
                      <input
                        required
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="Ex: Jardim Monte Serrat"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Estimado (R$)</label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none"
                        placeholder="Ex: 500.000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição Breve</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none resize-none"
                      placeholder="Conte um pouco sobre o imóvel (quartos, diferenciais, etc)"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-copper-500 text-white font-medium rounded-sm hover:bg-copper-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar Informações
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
