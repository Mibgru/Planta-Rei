import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const articleSchema = z.object({
  title: z.string().min(5, "Il titolo deve contenere almeno 5 caratteri"),
  subtitle: z.string().min(5, "Il sottotitolo deve contenere almeno 5 caratteri"),
  description: z.string().min(20, "La descrizione deve contenere almeno 20 caratteri"),
  content: z.string().optional(),
  imageUrl: z.string().url("Inserisci un URL valido per l'immagine"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // Fetch article data if editing
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
    enabled: isEditing,
  });

  // Form initialization
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      content: "",
      imageUrl: "",
    },
  });

  // Update form when article data is loaded
  useEffect(() => {
    if (article && isEditing) {
      form.reset({
        title: article.title,
        subtitle: article.subtitle,
        description: article.description,
        content: article.content || "",
        imageUrl: article.imageUrl,
      });
    }
  }, [article, form, isEditing]);

  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormValues) => {
      const res = await apiRequest("POST", "/api/articles", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Articolo creato con successo, reindirizzamento alla dashboard..."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      
      // Forza il refresh dopo un breve ritardo
      setTimeout(() => {
        window.location.href = "/admin";
      }, 800);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Impossibile creare l'articolo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update article mutation
  const updateArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormValues) => {
      const res = await apiRequest("PUT", `/api/articles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Articolo aggiornato con successo, reindirizzamento alla dashboard..."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${id}`] });
      
      // Forza il refresh dopo un breve ritardo
      setTimeout(() => {
        window.location.href = "/admin";
      }, 800);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: `Impossibile aggiornare l'articolo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormValues) => {
    if (isEditing) {
      updateArticleMutation.mutate(data);
    } else {
      createArticleMutation.mutate(data);
    }
  };

  const isSubmitting = createArticleMutation.isPending || updateArticleMutation.isPending;

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">
              {isEditing ? "Modifica Articolo" : "Nuovo Articolo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing && isLoadingArticle ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titolo</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci il titolo dell'articolo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sottotitolo</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci il sottotitolo dell'articolo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Immagine</FormLabel>
                        <FormControl>
                          <Input placeholder="https://esempio.com/immagine.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrizione breve</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Inserisci una breve descrizione dell'articolo" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Questa descrizione apparirà nell'anteprima dell'articolo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenuto dell'articolo</FormLabel>
                        <FormControl>
                          <Tabs defaultValue="edit" className="w-full">
                            <TabsList className="mb-2">
                              <TabsTrigger value="edit">Modifica</TabsTrigger>
                              <TabsTrigger value="preview">Anteprima</TabsTrigger>
                            </TabsList>
                            <TabsContent value="edit">
                              <RichTextEditor 
                                content={field.value || ""} 
                                onChange={field.onChange}
                              />
                            </TabsContent>
                            <TabsContent value="preview">
                              <div className="border rounded-md p-4">
                                {field.value ? (
                                  <div 
                                    className="prose prose-slate dark:prose-invert max-w-none" 
                                    dangerouslySetInnerHTML={{ __html: field.value }}
                                  />
                                ) : (
                                  <div className="text-muted-foreground text-center py-8">
                                    Nessun contenuto da visualizzare in anteprima
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormDescription>
                          Utilizza l'editor per formattare il testo, aggiungere link e immagini.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("imageUrl") && (
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Anteprima Immagine:</h3>
                      <img 
                        src={form.watch("imageUrl")} 
                        alt="Anteprima" 
                        className="max-h-48 rounded-md object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x200?text=Immagine+non+disponibile";
                        }}
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setLocation("/admin")}
                      className="mr-2"
                      disabled={isSubmitting}
                    >
                      Annulla
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Aggiorna Articolo" : "Crea Articolo"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
