import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Link } from "wouter";
import ArticleCard from "@/components/article/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function ArticlesSection() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/latest"],
  });

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral mb-4">Ultimi Articoli</h2>
            <p className="text-lg text-neutral/80 max-w-2xl">
              Approfondimenti, novità e consigli dal mondo dell'agricoltura e dell'agronomia.
            </p>
          </div>
          <a href="/articles" className="mt-4 md:mt-0 text-primary font-medium inline-flex items-center hover:underline">
            Vedi tutti gli articoli
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-5 space-y-4">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral/70">Nessun articolo disponibile al momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
