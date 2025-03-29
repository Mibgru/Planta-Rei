import { Sprout, MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl">AgriStudio</span>
            </div>
            <p className="text-black/80 mb-4">
              Consulenza agronomica professionale e soluzioni innovative per l'agricoltura sostenibile.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-black/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-black/70 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-black/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Link Utili</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-black/80 hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Servizi
                </a>
              </li>
              <li>
                <a href="/articles" className="text-black/80 hover:text-primary transition-colors">
                  Articoli
                </a>
              </li>
              <li>
                <a href="/contact" className="text-black/80 hover:text-primary transition-colors">
                  Contatti
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Servizi</h4>
            <ul className="space-y-2">
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Consulenza Tecnica
                </a>
              </li>
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Analisi e Perizie
                </a>
              </li>
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Agricoltura Sostenibile
                </a>
              </li>
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Formazione
                </a>
              </li>
              <li>
                <a href="/services" className="text-black/80 hover:text-primary transition-colors">
                  Progetti su Misura
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-2" />
                <span className="text-black/80">Via Agricoltura 123, 00123 Roma, Italia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-black/80">+39 06 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-black/80">info@agristudio.it</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="text-black/80">Lun-Ven: 9:00-18:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-black/10 mt-8 pt-8 text-center text-black/60 text-sm">
          <p>&copy; {new Date().getFullYear()} AgriStudio. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}