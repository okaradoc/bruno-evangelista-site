import { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleAdminAccess = (e: any) => {
    e.preventDefault();
    navigate('/acesso-restrito-be');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/#inicio' },
    { name: 'Imóveis', href: '/#imoveis' },
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Contato', href: '/#contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (isScrolled || !isHomePage) ? 'bg-petroleum-900/95 backdrop-blur-sm shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/#inicio" className="text-white font-serif text-2xl tracking-wider">
              BRUNO<span className="text-copper-400">EVANGELISTA</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-copper-400 transition-colors text-sm uppercase tracking-widest font-medium"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleAdminAccess}
              className="flex items-center gap-2 px-4 py-2 bg-copper-600/20 text-copper-400 border border-copper-600/30 rounded-sm hover:bg-copper-600 hover:text-white transition-all text-xs uppercase tracking-widest font-bold"
            >
              <Lock size={14} />
              Área do Corretor
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-copper-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-petroleum-800 absolute top-full left-0 right-0 shadow-lg border-t border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-copper-400 hover:bg-white/5 rounded-md uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleAdminAccess(e);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-4 bg-copper-600/10 text-copper-400 border border-copper-600/20 rounded-md uppercase tracking-widest font-bold text-sm mt-4"
            >
              <Lock size={16} />
              Área do Corretor
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
