import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-primary text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
          alt="Campo agricolo" 
          className="object-cover w-full h-full opacity-20"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-6">
            Soluzioni agronomiche professionali per il futuro dell'agricoltura
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Consulenza specializzata e servizi innovativi per aziende agricole, enti pubblici e privati.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              className="bg-[#D68C45] hover:bg-[#D68C45]/90 text-white h-12 px-6 w-full sm:w-auto"
            >
              <a href="#servizi">
                Scopri i nostri servizi
              </a>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white bg-transparent text-white hover:bg-white hover:text-primary h-12 px-6 w-full sm:w-auto"
            >
              <a href="/articles">
                Leggi i nostri articoli
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
