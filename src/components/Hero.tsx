import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20 pb-12 md:pb-0 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="Imóvel de alto padrão"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-petroleum-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-petroleum-900 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 lg:w-3/4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-copper-400 font-medium tracking-widest uppercase text-sm md:text-base mb-4">
              Engenharia & Negócios Imobiliários
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
              Soluções completas com <br className="hidden md:block" />
              <span className="text-copper-400 italic font-normal">segurança, agilidade e respaldo técnico.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
              Da regularização e aprovação de projetos à compra, venda e locação de imóveis, você conta com atendimento exclusivo, experiência técnica e condução segura em cada etapa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#imoveis"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-petroleum-900 bg-copper-400 hover:bg-copper-500 transition-colors rounded-sm group"
              >
                Ver Imóveis
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/30 hover:bg-white/10 transition-colors rounded-sm group"
              >
                Conhecer serviços
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Professional Info Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hidden md:block md:w-1/3 lg:w-1/4 mt-12 md:mt-0 pl-8"
        >
          <div className="bg-petroleum-800/60 backdrop-blur-md border border-white/10 p-8 rounded-sm shadow-2xl">
            <h3 className="text-white font-serif text-2xl mb-2">Bruno Evangelista</h3>
            <div className="w-12 h-px bg-copper-400 mb-6"></div>
            
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <p className="font-medium text-white">Engenheiro Civil, Ambiental e de Segurança do Trabalho</p>
                <p className="text-copper-400/80 font-mono mt-1">CREA-SP: 5063935334</p>
              </div>
              
              <div className="h-px bg-white/10 w-full"></div>
              
              <div>
                <p className="font-medium text-white">Corretor de Imóveis</p>
                <p className="text-copper-400/80 font-mono mt-1">CRECI-SP: 318910-F</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
