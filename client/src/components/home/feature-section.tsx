import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeatureSection() {
  return (
    <section className="py-16 md:py-20 bg-[#FEFEE3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral mb-6">
              Esperienza e innovazione al servizio dell'agricoltura
            </h2>
            <p className="text-lg text-neutral/80 mb-6">
              Il nostro team di agronomi esperti combina conoscenze tradizionali con tecnologie innovative per offrire soluzioni su misura per le tue esigenze.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <span>Team di agronomi con esperienza pluriennale</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <span>Approccio personalizzato per ogni cliente</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <span>Utilizzo di tecnologie avanzate e sistemi di monitoraggio</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mt-0.5 mr-3" />
                <span>Soluzioni sostenibili a basso impatto ambientale</span>
              </li>
            </ul>
            <Button asChild className="h-12 px-6">
              <a href="/contact">
                Contattaci per una consulenza
              </a>
            </Button>
          </div>
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                alt="Agronomo al lavoro" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral">100+ Clienti</p>
                  <p className="text-sm text-neutral/70">Soddisfatti ogni anno</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
