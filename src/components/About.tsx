import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function About() {
  return (
    <section id="sobre" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeefa?q=80&w=1973&auto=format&fit=crop"
                alt="Bruno Evangelista - Engenheiro e Corretor"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-petroleum-900/10 mix-blend-multiply"></div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-copper-400/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-petroleum-900/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white p-6 shadow-xl rounded-sm z-20 hidden md:block border border-gray-100">
              <p className="text-petroleum-900 font-serif text-4xl font-bold mb-1">14+</p>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Anos de<br/>Experiência</p>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-copper-600 font-medium tracking-widest uppercase text-sm mb-3">
              Sobre o Profissional
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-petroleum-900 mb-6 leading-tight">
              Visão integrada entre processos técnicos, legais e imobiliários.
            </h3>
            
            <div className="w-16 h-px bg-copper-500 mb-8"></div>
            
            <div className="space-y-6 text-gray-600 font-light leading-relaxed">
              <p>
                Com atuação sólida desde 2012 na área de engenharia, Bruno Evangelista construiu sua trajetória fundamentada na excelência técnica e na resolução de problemas complexos.
              </p>
              <p>
                Sua experiência prática em engenharia civil, ambiental e segurança do trabalho, somada à vivência no funcionalismo público, revelou uma carência no mercado: a falta de profissionais preparados para lidar com a burocracia técnica de forma ágil e segura.
              </p>
              <p>
                Para preencher essa lacuna e oferecer um serviço ainda mais completo, em 2026 expandiu sua atuação como Corretor de Imóveis. O objetivo é claro: entregar agilidade nas análises, qualidade no atendimento, respaldo técnico e total conformidade com a legislação vigente, do projeto à negociação.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Engenharia Civil e Ambiental",
                "Segurança do Trabalho",
                "Corretagem Imobiliária",
                "Regularização e Aprovações"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-copper-500 flex-shrink-0" />
                  <span className="text-petroleum-900 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <p className="text-xl font-serif text-petroleum-900 italic border-l-4 border-copper-500 pl-6 py-2">
                "Pensando em vender, comprar, construir, reformar ou regularizar seu imóvel, estou à disposição."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
