import { useState } from 'react';
import { Instagram, Facebook, Globe, MapPin, Phone, Mail, Lock, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordModal } from './PasswordModal';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleAdminAccess = (e: any) => {
    e.preventDefault();
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = (password: string) => {
    if (password === 'Bruno.eng2026') {
      setIsPasswordModalOpen(false);
      setPasswordError('');
      navigate('/admin');
    } else {
      setPasswordError('Senha incorreta! Tente novamente.');
    }
  };

  return (
    <footer className="bg-petroleum-900 text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Credentials */}
          <div className="lg:col-span-1">
            <Link to="/#inicio" className="text-white font-serif text-2xl tracking-wider block mb-6">
              BRUNO<span className="text-copper-400">EVANGELISTA</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Soluções completas em engenharia e negócios imobiliários com segurança, agilidade e respaldo técnico.
            </p>
            <div className="space-y-2 text-xs text-gray-500 font-mono">
              <p>CREA-SP: 5063935334</p>
              <p>CRECI-SP: 318910-F</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Navegação</h4>
            <ul className="space-y-3">
              {['Início', 'Imóveis', 'Serviços', 'Contato'].map((item) => {
                const href = item === 'Imóveis' ? '/#imoveis' : `/#${item.toLowerCase().replace('í', 'i')}`;
                return (
                  <li key={item}>
                    <a href={href} className="text-gray-400 hover:text-copper-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                );
              })}
              <li>
                <button 
                  onClick={handleAdminAccess}
                  className="text-gray-400 hover:text-copper-400 transition-colors text-sm flex items-center gap-1"
                >
                  <Lock size={12} /> Área do Corretor
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Contato</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-copper-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm leading-relaxed">
                    Rua Prudente de Moraes, 46, Sala 05<br />
                    Centro, Santa Isabel/SP<br />
                    CEP 07500-000
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-copper-400 mr-3 flex-shrink-0" />
                  <a href="https://wa.me/5511968667275" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-copper-400 transition-colors text-sm">
                    (11) 96866-7275
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-copper-400 mr-3 flex-shrink-0" />
                  <a href="mailto:engenhariaeimoveis@hotmail.com" className="text-gray-400 hover:text-copper-400 transition-colors text-sm">
                    engenhariaeimoveis@hotmail.com
                  </a>
                </li>
              </ul>
              
              <div>
                <h5 className="text-gray-300 font-medium text-sm mb-3">Horário de Atendimento</h5>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Segunda a sexta: 9h às 12h / 14h às 17h<br />
                  Sábado: 9h às 12h
                </p>
                
                <div className="flex space-x-4">
                  <a href="http://instagram.com/brunoevangelista017" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-petroleum-800 flex items-center justify-center text-gray-400 hover:bg-copper-500 hover:text-white transition-all">
                    <Instagram size={18} />
                  </a>
                  <a href="https://facebook.com/bruno.evangelista.520" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-petroleum-800 flex items-center justify-center text-gray-400 hover:bg-copper-500 hover:text-white transition-all">
                    <Facebook size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/bruno-evangelista-9917a656/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-petroleum-800 flex items-center justify-center text-gray-400 hover:bg-copper-500 hover:text-white transition-all">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Bruno Evangelista. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs max-w-md">
            Engenharia Civil, Ambiental e de Segurança do Trabalho | Corretagem de Imóveis
          </p>
        </div>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordConfirm}
        error={passwordError}
      />
    </footer>
  );
}
