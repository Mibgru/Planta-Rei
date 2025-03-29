import { useAuth } from "@/hooks/use-auth";
import ArticleList from "@/components/admin/article-list";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { PlusCircle, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Forza il refresh della pagina e reindirizza alla pagina di login
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
      }
    });
  };

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral mb-2">
              Dashboard Admin
            </h1>
            <p className="text-neutral/70">
              Benvenuto, {user?.username}. Gestisci gli articoli del sito.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center"
            >
              {logoutMutation.isPending ? (
                <span className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Logout
            </Button>
            <Button 
              onClick={() => setLocation("/admin/articles/new")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuovo Articolo
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-heading text-xl font-semibold mb-6">Gestione Articoli</h2>
          <ArticleList />
        </div>
      </div>
    </div>
  );
}
