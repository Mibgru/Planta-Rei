import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, PenSquare, Trash2, Loader2 } from "lucide-react";

export default function ArticleList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Articolo eliminato",
        description: "L'articolo è stato eliminato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Impossibile eliminare l'articolo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditArticle = (id: number) => {
    setLocation(`/admin/articles/edit/${id}`);
  };

  const handleDeleteArticle = (article: Article) => {
    setArticleToDelete(article);
  };

  const confirmDeleteArticle = () => {
    if (articleToDelete) {
      deleteArticleMutation.mutate(articleToDelete.id);
      setArticleToDelete(null);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            type="search" 
            className="pl-10"
            placeholder="Cerca articoli..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-sm mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles && filteredArticles.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Data</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 mr-3">
                        <img 
                          src={article.imageUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-sm object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/40x40?text=No+Image";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{article.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">
                      {format(new Date(article.createdAt), "dd/MM/yyyy", { locale: it })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditArticle(article.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteArticle(article)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-neutral/70">
          {searchTerm ? "Nessun articolo corrisponde alla ricerca" : "Nessun articolo presente"}
        </div>
      )}

      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo articolo?</AlertDialogTitle>
            <AlertDialogDescription>
              Stai per eliminare l'articolo "{articleToDelete?.title}". Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteArticle}
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={deleteArticleMutation.isPending}
            >
              {deleteArticleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
