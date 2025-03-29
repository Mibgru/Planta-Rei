import { useState } from "react";
import { Layers, FileSpreadsheet, Leaf, GraduationCap, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  benefits: string[];
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<string>("consulenza");

  const services: Service[] = [
    {
      id: "consulenza",
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Consulenza Tecnica",
      description: "Supporto specializzato per aziende agricole e proprietari terrieri.",
      details: "La nostra consulenza tecnica offre supporto agronomico specializzato per aziende agricole, proprietari terrieri e operatori del settore. Grazie alla nostra esperienza pluriennale, siamo in grado di fornire soluzioni personalizzate per ottimizzare la produzione, ridurre i costi e migliorare la qualità dei prodotti. Il nostro team di agronomi qualificati è a disposizione per sopralluoghi, analisi del terreno, pianificazione colturale e molto altro.",
      benefits: [
        "Ottimizzazione della produzione agricola",
        "Riduzione dei costi operativi",
        "Supporto per certificazioni e normative",
        "Gestione sostenibile delle risorse",
        "Consulenze mirate per specifiche colture"
      ]
    },
    {
      id: "analisi",
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
      title: "Analisi e Perizie",
      description: "Valutazioni professionali e analisi dettagliate per terreni e colture.",
      details: "Il servizio di analisi e perizie comprende valutazioni professionali e approfondite di terreni, colture e aziende agricole. Effettuiamo campionamenti e analisi del suolo, delle acque e dei tessuti vegetali, fornendo report dettagliati e raccomandazioni pratiche. Le nostre perizie sono riconosciute da enti pubblici e assicurazioni, e possono essere utilizzate per scopi legali, assicurativi o per l'accesso a finanziamenti e contributi.",
      benefits: [
        "Analisi complete del terreno e delle acque",
        "Perizie per danni da calamità naturali",
        "Valutazioni per compravendite terreni",
        "Monitoraggio dello stato fitosanitario",
        "Report dettagliati con raccomandazioni pratiche"
      ]
    },
    {
      id: "sostenibile",
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: "Agricoltura Sostenibile",
      description: "Strategie e tecniche per un'agricoltura rispettosa dell'ambiente.",
      details: "Il nostro servizio di agricoltura sostenibile è pensato per chi desidera implementare metodi di produzione rispettosi dell'ambiente e vantaggiosi dal punto di vista economico. Offriamo consulenza su agricoltura biologica, lotta integrata, riduzione di pesticidi e fertilizzanti chimici, gestione efficiente delle risorse idriche e implementazione di pratiche agro-ecologiche. Vi aiutiamo nella transizione verso modelli più sostenibili preservando la redditività della vostra azienda.",
      benefits: [
        "Riduzione dell'impatto ambientale",
        "Ottimizzazione dell'uso delle risorse idriche",
        "Miglioramento della fertilità del suolo",
        "Supporto per certificazioni biologiche",
        "Valorizzazione dei prodotti sul mercato"
      ]
    },
    {
      id: "formazione",
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: "Formazione",
      description: "Corsi e workshop per professionisti e appassionati del settore agricolo.",
      details: "Il nostro servizio di formazione include corsi, workshop e seminari rivolti a professionisti del settore agricolo, studenti e appassionati. Gli argomenti trattati spaziano dalle tecniche agricole innovative alla gestione aziendale, dalla normativa di settore alla sostenibilità ambientale. I nostri docenti sono professionisti con esperienza pratica e accademica, in grado di trasmettere conoscenze teoriche e competenze pratiche attraverso un approccio interattivo e orientato ai risultati.",
      benefits: [
        "Aggiornamento professionale continuo",
        "Formazione pratica su tecniche innovative",
        "Workshop specialistici per diverse colture",
        "Corsi su gestione aziendale agricola",
        "Aggiornamenti su normative e opportunità di finanziamento"
      ]
    },
    {
      id: "progetti",
      icon: <PenSquare className="h-10 w-10 text-primary" />,
      title: "Progetti su Misura",
      description: "Soluzioni personalizzate per le esigenze specifiche della tua azienda.",
      details: "Con il servizio di progetti su misura, sviluppiamo soluzioni personalizzate per le esigenze specifiche della vostra azienda agricola. Che si tratti di riconversione colturale, ottimizzazione dei processi produttivi, progettazione di impianti di irrigazione o sviluppo di nuove linee di prodotto, il nostro team multidisciplinare vi affianca in ogni fase: dall'analisi iniziale alla progettazione, dall'implementazione al monitoraggio dei risultati.",
      benefits: [
        "Soluzioni personalizzate per esigenze specifiche",
        "Team multidisciplinare a disposizione",
        "Supporto completo dall'idea alla realizzazione",
        "Integrazione di tecnologie innovative",
        "Monitoraggio continuo dei risultati"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral mb-4">
          I Nostri Servizi
        </h1>
        <p className="text-lg text-neutral/80 max-w-2xl mx-auto">
          Offriamo una gamma completa di servizi di consulenza agronomica 
          per supportare la tua azienda agricola e migliorare la produttività in modo sostenibile.
        </p>
      </div>

      <div className="mb-16">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {services.map((service) => (
                <TabsTrigger 
                  key={service.id} 
                  value={service.id}
                  className="flex flex-col items-center gap-1 py-3 px-4"
                >
                  {service.icon}
                  <span className="text-sm">{service.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {services.map((service) => (
            <TabsContent key={service.id} value={service.id}>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        {service.icon}
                        <h2 className="font-heading font-bold text-2xl">{service.title}</h2>
                      </div>
                      <p className="text-neutral/80 mb-6">
                        {service.details}
                      </p>
                      <Button className="mb-6">Richiedi Informazioni</Button>
                    </div>
                    
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-4">Vantaggi</h3>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="font-heading font-semibold text-2xl mb-4">Hai bisogno di un servizio specializzato?</h2>
        <p className="text-neutral/80 mb-6 max-w-2xl mx-auto">
          Contattaci per discutere le tue esigenze specifiche. Il nostro team di esperti 
          è pronto ad aiutarti con soluzioni personalizzate.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Contattaci Ora
        </Button>
      </div>
    </div>
  );
}