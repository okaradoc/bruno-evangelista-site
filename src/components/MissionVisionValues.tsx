import { motion } from 'motion/react';
import { Target, Eye, HeartHandshake } from 'lucide-react';

export function MissionVisionValues() {
  const items = [
    {
      icon: <Target className="w-10 h-10 text-copper-500 mb-6" />,
      title: "Missão",
      description: "Oferecer soluções inovadoras e seguras em engenharia e corretagem de imóveis, conectando pessoas às melhores oportunidades de investimento e moradia, com excelência técnica e atendimento personalizado."
    },
    {
      icon: <Eye className="w-10 h-10 text-copper-500 mb-6" />,
      title: "Visão",
      description: "Ser referência nacional em engenharia e corretagem imobiliária, reconhecida pela credibilidade, inovação e impacto positivo no desenvolvimento urbano e na qualidade de vida das pessoas."
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-copper-500 mb-6" />,
      title: "Valores",
      description: (
        <ul className="list-disc list-inside space-y-2 text-left inline-block">
          <li>Ética e transparência</li>
          <li>Excelência técnica</li>
          <li>Inovação</li>
          <li>Compromisso com o cliente</li>
          <li>Sustentabilidade</li>
          <li>Colaboração</li>
        </ul>
      )
    }
  ];

  return (
    <section className="py-24 bg-petroleum-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-petroleum-900/5 mix-blend-multiply"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-10 rounded-sm shadow-xl border-t-4 border-copper-500 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h4 className="text-2xl font-serif text-petroleum-900 mb-4">{item.title}</h4>
              <div className="text-gray-600 font-light leading-relaxed text-sm">
                {item.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
