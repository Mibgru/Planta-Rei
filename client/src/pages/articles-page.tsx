import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import ArticleCard from "@/components/article/article-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesPage() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-neutral mb-4">
            I Nostri Articoli
          </h1>
          <p className="text-lg text-neutral/80 max-w-2xl mx-auto">
            Approfondimenti, novità e consigli dal mondo dell'agricoltura e dell'agronomia.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
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
    </div>
  );
}
