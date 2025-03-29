import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">Articolo non trovato</h1>
        <p className="mb-6">L'articolo che stai cercando non esiste o è stato rimosso.</p>
        <Button onClick={() => setLocation("/articles")}>Torna agli articoli</Button>
      </div>
    );
  }

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full rounded-lg mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        ) : article ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-neutral/70 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(article.createdAt), "d MMMM yyyy", { locale: it })}
                  </span>
                </div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral mb-3">
                  {article.title}
                </h1>
                <h2 className="font-heading text-xl text-neutral/80 mb-8">
                  {article.subtitle}
                </h2>
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="font-medium text-lg">{article.description}</p>
                </div>
                
                {article.content && (
                  <div 
                    className="prose prose-lg max-w-none my-6"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                )}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setLocation("/articles")}>
                    ← Torna agli articoli
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
