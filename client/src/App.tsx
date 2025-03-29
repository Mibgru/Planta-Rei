import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ArticlesPage from "@/pages/articles-page";
import ArticleDetailPage from "@/pages/article-detail-page";
import ServicesPage from "@/pages/services-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin/dashboard";
import ArticleForm from "@/pages/admin/article-form";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { AuthProvider } from "./hooks/use-auth";

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/articles" component={ArticlesPage} />
          <Route path="/articles/:id" component={ArticleDetailPage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/admin" component={AdminDashboard} />
          <ProtectedRoute path="/admin/articles/new" component={ArticleForm} />
          <ProtectedRoute path="/admin/articles/edit/:id" component={ArticleForm} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
