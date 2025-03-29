import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Controlla se l'utente è autenticato e ha i permessi di amministratore
  if (!user) {
    console.log("ProtectedRoute: Utente non autenticato, reindirizzamento a /auth");
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
  
  if (!user.isAdmin) {
    console.log("ProtectedRoute: Utente non è admin, reindirizzamento a /auth");
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
