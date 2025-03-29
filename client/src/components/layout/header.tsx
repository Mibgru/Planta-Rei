import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, Sprout } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 bg-background bg-opacity-95 backdrop-blur-sm z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <a href="/" className="font-heading font-bold text-xl sm:text-2xl text-primary">
              AgriStudio
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className={`font-medium ${isActive('/') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
            >
              Home
            </a>
            <a 
              href="/services" 
              className={`font-medium ${isActive('/services') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
            >
              Servizi
            </a>
            <a 
              href="/articles" 
              className={`font-medium ${isActive('/articles') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
            >
              Articoli
            </a>
            <a 
              href="/contact" 
              className={`font-medium ${isActive('/contact') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
            >
              Contatti
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            {user && (
              <Button 
                variant="ghost" 
                className="hidden md:inline-flex"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            )}
            <button 
              className="md:hidden text-neutral hover:text-primary" 
              aria-label="Menu" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-4 py-4">
            <a 
              href="/" 
              className={`font-medium ${isActive('/') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
              onClick={closeMobileMenu}
            >
              Home
            </a>
            <a 
              href="/services" 
              className={`font-medium ${isActive('/services') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
              onClick={closeMobileMenu}
            >
              Servizi
            </a>
            <a 
              href="/articles" 
              className={`font-medium ${isActive('/articles') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
              onClick={closeMobileMenu}
            >
              Articoli
            </a>
            <a 
              href="/contact" 
              className={`font-medium ${isActive('/contact') ? 'text-primary' : 'text-neutral hover:text-primary'} transition-colors`}
              onClick={closeMobileMenu}
            >
              Contatti
            </a>
            {user && (
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => {
                  logoutMutation.mutate();
                  closeMobileMenu();
                }}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
