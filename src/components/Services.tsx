import { motion } from 'motion/react';
import { FileText, Home, Building2, Map, FileCheck, ShieldAlert, FileSignature, Trees, Building, FileSearch, Key, Handshake, ShieldCheck } from 'lucide-react';

export function Services() {
  const engineeringServices = [
    { icon: <FileText size={24} />, title: "Aprovação de Projetos", desc: "Gestão completa para aprovação de projetos arquitetônicos e complementares nos órgãos competentes." },
    { icon: <Building2 size={24} />, title: "Construção Nova", desc: "Acompanhamento técnico e legal para obras residenciais e comerciais desde a concepção." },
    { icon: <FileCheck size={24} />, title: "Regularização de Imóveis", desc: "Adequação documental e técnica de imóveis já construídos para fins de venda ou financiamento." },
    { icon: <Map size={24} />, title: "Loteamentos", desc: "Estudos de viabilidade, projetos e aprovações para parcelamento do solo urbano." },
    { icon: <FileSignature size={24} />, title: "Alvarás de Reforma", desc: "Emissão de licenças necessárias para reformas estruturais e ampliações com segurança legal." },
    { icon: <ShieldAlert size={24} />, title: "AVCB / CLCB", desc: "Projetos e laudos para obtenção do Auto de Vistoria do Corpo de Bombeiros." },
    { icon: <FileSearch size={24} />, title: "Alvará Sanitário e LTA", desc: "Laudo Técnico de Avaliação e adequações para vigilância sanitária." },
    { icon: <Map size={24} />, title: "Regularização Fundiária", desc: "Processos de REURB para titulação e legalização de áreas urbanas informais." },
    { icon: <Trees size={24} />, title: "Estudos e Licenciamento Ambiental", desc: "Supressão de vegetação e licenciamentos para atividades potencialmente poluidoras." },
    { icon: <Building size={24} />, title: "Atestado de Estabilidade", desc: "Laudos técnicos que atestam a segurança estrutural e salubridade das edificações." },
    { icon: <Key size={24} />, title: "Obtenção de Habite-se", desc: "Processo legal para emissão do certificado de conclusão de obra e autorização de ocupação." },
    { icon: <FileText size={24} />, title: "CND e Averbações", desc: "Certidão Negativa de Débito (Receita Federal) e averbação de construções no Cartório de Imóveis." },
  ];

  const realEstateServices = [
    { icon: <Handshake size={24} />, title: "Compra e Venda", desc: "Intermediação segura de imóveis de alto padrão, com análise documental rigorosa." },
    { icon: <Key size={24} />, title: "Locação de Imóveis", desc: "Intermediação em processos de aluguel com gestão de contratos e vistorias (consultar disponibilidade)." },
    { icon: <ShieldCheck size={24} />, title: "Consultoria Imobiliária", desc: "Atendimento consultivo focado em segurança jurídica e técnica para investidores e compradores." },
  ];

  return (
    <section id="servicos" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-copper-600 font-medium tracking-widest uppercase text-sm mb-3"
          >
            Nossos Serviços
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif text-petroleum-900 leading-tight"
          >
            Soluções completas para o seu patrimônio
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-px bg-copper-500 mx-auto mt-6"
          ></motion.div>
        </div>

        {/* Engineering Section */}
        <div className="mb-20">
          <div className="flex items-center mb-10">
            <h4 className="text-2xl font-serif text-petroleum-900">Engenharia e Regularização</h4>
            <div className="h-px bg-gray-300 flex-grow ml-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineeringServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="text-copper-500 mb-4 group-hover:scale-110 transition-transform origin-left">
                  {service.icon}
                </div>
                <h5 className="text-lg font-medium text-petroleum-900 mb-2">{service.title}</h5>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real Estate Section */}
        <div>
          <div className="flex items-center mb-10">
            <h4 className="text-2xl font-serif text-petroleum-900">Corretagem Imobiliária</h4>
            <div className="h-px bg-gray-300 flex-grow ml-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realEstateServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-petroleum-900 p-8 rounded-sm shadow-lg border border-petroleum-800 hover:bg-petroleum-800 transition-colors group"
              >
                <div className="text-copper-400 mb-5 group-hover:scale-110 transition-transform origin-left">
                  {service.icon}
                </div>
                <h5 className="text-xl font-serif text-white mb-3">{service.title}</h5>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
