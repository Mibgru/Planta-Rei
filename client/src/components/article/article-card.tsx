import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
      <a href={`/articles/${article.id}`} className="block">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/800x400?text=Immagine+non+disponibile";
          }}
        />
      </a>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-neutral/70 mb-3">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(article.createdAt), "d MMMM yyyy", { locale: it })}</span>
        </div>
        <a href={`/articles/${article.id}`} className="block">
          <h3 className="font-heading font-semibold text-xl mb-2 text-neutral hover:text-primary transition-colors">
            {article.title}
          </h3>
        </a>
        <p className="text-neutral/80 line-clamp-3 mb-4 flex-grow">
          {article.subtitle}
        </p>
        <a 
          href={`/articles/${article.id}`} 
          className="text-primary font-medium inline-flex items-center hover:underline mt-auto"
        >
          Leggi l'articolo
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
