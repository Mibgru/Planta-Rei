import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulazione di invio del modulo
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Messaggio inviato",
        description: "Grazie per averci contattato. Ti risponderemo al più presto.",
      });
      
      // Reset del form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral mb-4">
          Contattaci
        </h1>
        <p className="text-lg text-neutral/80 max-w-2xl mx-auto">
          Siamo qui per rispondere a qualsiasi domanda riguardante i nostri servizi 
          e come possiamo aiutarti a migliorare la tua attività agricola.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold text-2xl mb-6">Inviaci un messaggio</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome e Cognome</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Inserisci il tuo nome completo" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="La tua email" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Numero di telefono" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Oggetto del messaggio" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Messaggio</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Scrivi qui il tuo messaggio" 
                  className="h-40" 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Invio in corso...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Invia Messaggio
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading font-semibold text-2xl mb-6">Informazioni di contatto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Indirizzo</h3>
                  <p className="text-neutral/80">Via Agricoltura 123, 00123 Roma, Italia</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Telefono</h3>
                  <p className="text-neutral/80">+39 06 1234567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-neutral/80">info@agristudio.it</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Orari di apertura</h3>
                  <p className="text-neutral/80">Lunedì - Venerdì: 9:00 - 18:00</p>
                  <p className="text-neutral/80">Sabato: 9:00 - 12:00</p>
                  <p className="text-neutral/80">Domenica: Chiuso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden mb-12">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190028.25709491457!2d12.395912522790248!3d41.91024157355238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f9928ebb%3A0xb90f770693656e38!2sRoma%20RM!5e0!3m2!1sit!2sit!4v1648544416506!5m2!1sit!2sit" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="font-heading font-semibold text-2xl mb-4">Consulenza iniziale gratuita</h2>
        <p className="text-neutral/80 mb-6 max-w-2xl mx-auto">
          Prenota una consulenza iniziale gratuita di 30 minuti per discutere le tue 
          esigenze e scoprire come possiamo aiutarti a migliorare la tua attività agricola.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Prenota Consulenza
        </Button>
      </div>
    </div>
  );
}