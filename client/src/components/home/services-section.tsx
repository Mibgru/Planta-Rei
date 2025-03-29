import { Sprout, FileSpreadsheet, Leaf } from "lucide-react";
import { Link } from "wouter";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: <Leaf className="h-6 w-6 text-primary" />,
    title: "Consulenza Tecnica",
    description: "Assistenza e pianificazione per la gestione sostenibile delle colture e delle risorse idriche."
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
    title: "Analisi e Perizie",
    description: "Valutazioni tecniche del terreno, delle colture e degli impatti ambientali per progetti agricoli."
  },
  {
    icon: <Sprout className="h-6 w-6 text-primary" />,
    title: "Agricoltura Sostenibile",
    description: "Strategie e pratiche per migliorare la sostenibilità e la produttività delle aziende agricole."
  }
];

export default function ServicesSection() {
  return (
    <section id="servizi" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral mb-4">I Nostri Servizi</h2>
          <p className="text-lg text-neutral/80 max-w-2xl mx-auto">
            Offriamo un'ampia gamma di servizi di consulenza agronomica per soddisfare le esigenze del settore agricolo moderno.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-neutral">{service.title}</h3>
              <p className="text-neutral/80 mb-4">
                {service.description}
              </p>
              <a href="/services" className="text-primary font-medium inline-flex items-center hover:underline">
                Maggiori informazioni
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
