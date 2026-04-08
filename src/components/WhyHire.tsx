import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export function WhyHire() {
  const reasons = [
    "Atuação técnica e comercial integrada",
    "Mais agilidade no processo",
    "Menos burocracia para o cliente",
    "Respaldo técnico e legal",
    "Atendimento confiável e personalizado",
    "Visão completa do imóvel, da documentação e da negociação"
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-copper-600 font-medium tracking-widest uppercase text-sm mb-3">
              Por que contratar
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-petroleum-900 mb-6 leading-tight">
              A segurança de ter um engenheiro conduzindo seu negócio imobiliário.
            </h3>
            
            <div className="w-16 h-px bg-copper-500 mb-8"></div>
            
            <p className="text-gray-600 font-light leading-relaxed mb-8">
              Ao escolher nossos serviços, você não contrata apenas um corretor ou apenas um engenheiro. Você garante uma assessoria completa que entende a estrutura física, a viabilidade técnica e o valor de mercado do seu imóvel.
            </p>

            <ul className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="mt-1 mr-4 bg-petroleum-900/5 p-1 rounded-full">
                    <Check className="w-4 h-4 text-copper-600" />
                  </div>
                  <span className="text-petroleum-900 font-medium">{reason}</span>
                </motion.li>
              ))}
            </ul>
            
            <div className="mt-10">
              <a
                href="https://wa.me/5511968667275"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-petroleum-900 hover:bg-petroleum-800 transition-colors rounded-sm shadow-lg"
              >
                Solicitar análise do meu caso
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-sm overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Ambiente corporativo sofisticado"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-petroleum-900/20 mix-blend-multiply"></div>
            
            {/* Overlay Box */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-8 rounded-sm shadow-xl border-l-4 border-copper-500">
              <p className="text-petroleum-900 font-serif text-xl italic leading-relaxed">
                "A tranquilidade de saber que cada detalhe técnico e burocrático está sendo cuidado por um especialista."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
