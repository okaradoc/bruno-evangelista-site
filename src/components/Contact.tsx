import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Linkedin, Facebook } from 'lucide-react';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Use absolute URL in production (when running from the single HTML file)
      const apiUrl = '/api/contact';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contato" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-copper-600 font-medium tracking-widest uppercase text-sm mb-3">
              Atendimento
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-petroleum-900 mb-6 leading-tight">
              Pronto para iniciar seu projeto ou negociação?
            </h3>
            
            <div className="w-16 h-px bg-copper-500 mb-10"></div>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-petroleum-50 p-3 rounded-sm mr-4">
                  <Phone className="w-6 h-6 text-copper-600" />
                </div>
                <div>
                  <h4 className="text-petroleum-900 font-medium text-lg mb-1">WhatsApp / Telefone</h4>
                  <a href="https://wa.me/5511968667275" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-copper-600 transition-colors">
                    (11) 96866-7275
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-petroleum-50 p-3 rounded-sm mr-4">
                  <Mail className="w-6 h-6 text-copper-600" />
                </div>
                <div>
                  <h4 className="text-petroleum-900 font-medium text-lg mb-1">E-mail</h4>
                  <a href="mailto:engenhariaeimoveis@hotmail.com" className="text-gray-600 hover:text-copper-600 transition-colors">
                    engenhariaeimoveis@hotmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-petroleum-50 p-3 rounded-sm mr-4">
                  <MapPin className="w-6 h-6 text-copper-600" />
                </div>
                <div>
                  <h4 className="text-petroleum-900 font-medium text-lg mb-1">Endereço</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Rua Prudente de Moraes, 46, Sala 05<br />
                    Centro, Santa Isabel/SP<br />
                    CEP 07500-000
                  </p>
                  <p className="text-sm text-copper-600 mt-2 font-medium">Atendimento presencial disponível</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-petroleum-50 p-3 rounded-sm mr-4">
                  <Clock className="w-6 h-6 text-copper-600" />
                </div>
                <div>
                  <h4 className="text-petroleum-900 font-medium text-lg mb-1">Horário de Atendimento</h4>
                  <p className="text-gray-600">
                    Segunda a sexta: 9h às 12h / 14h às 17h<br />
                    Sábado: 9h às 12h
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 flex-wrap">
              <a
                href="https://wa.me/5511968667275"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-petroleum-900 hover:bg-petroleum-800 transition-colors rounded-sm"
              >
                Falar no WhatsApp
              </a>
              <a
                href="mailto:engenhariaeimoveis@hotmail.com"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-petroleum-900 border border-petroleum-900 hover:bg-petroleum-50 transition-colors rounded-sm"
              >
                Enviar e-mail
              </a>
              <a
                href="http://instagram.com/brunoevangelista017"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 transition-opacity rounded-sm gap-2"
              >
                <Instagram size={18} />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/bruno-evangelista-9917a656/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#0077b5] hover:bg-[#006396] transition-colors rounded-sm gap-2"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
              <a
                href="https://facebook.com/bruno.evangelista.520"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] transition-colors rounded-sm gap-2"
              >
                <Facebook size={18} />
                Facebook
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-petroleum-50 p-8 md:p-10 rounded-sm shadow-xl border border-gray-100"
          >
            <h4 className="text-2xl font-serif text-petroleum-900 mb-6">Envie sua mensagem</h4>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                  <input type="text" id="nome" name="Nome" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
                  <input type="tel" id="telefone" name="Telefone" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input type="email" id="email" name="Email" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors" />
              </div>

              <div>
                <label htmlFor="servico" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Serviço</label>
                <select id="servico" name="Servico" className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors bg-white">
                  <option value="">Selecione uma opção...</option>
                  <option value="Engenharia e Regularização">Engenharia e Regularização</option>
                  <option value="Corretagem Imobiliária">Corretagem Imobiliária</option>
                  <option value="Consultoria">Consultoria</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                <input type="text" id="assunto" name="Assunto" required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors" />
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea id="mensagem" name="Mensagem" rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-copper-500 focus:border-copper-500 outline-none transition-colors resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-medium text-petroleum-900 bg-copper-400 hover:bg-copper-500 transition-colors rounded-sm group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-petroleum-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                )}
                {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>

              {status === 'success' && (
                <p className="text-green-600 text-sm font-medium text-center">Mensagem enviada com sucesso!</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-sm font-medium text-center">Ocorreu um erro ao enviar a mensagem. Tente novamente.</p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
