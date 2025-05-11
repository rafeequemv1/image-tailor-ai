import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Image, Download, Trash2, Edit } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserImage {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  title: string;
  created_at: string;
}

const Library = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<UserImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const imagesPerPage = 12;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUser(session.user);
      fetchUserImages(session.user.id);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (session) {
        setUser(session.user);
        fetchUserImages(session.user.id);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserImages = async (userId: string) => {
    setIsLoading(true);
    try {
      let { data, error, count } = await supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage - 1);

      if (error) {
        throw error;
      }
      
      setImages(data || []);
      setTotalPages(Math.ceil((count || 0) / imagesPerPage));
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error fetching images",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Image download started",
      description: "Your image will be downloaded shortly",
    });
  };

  const handleDelete = async (imageId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        throw error;
      }

      setImages(images.filter(image => image.id !== imageId));
      toast({
        title: "Image deleted",
        description: "The image has been successfully deleted from your library",
      });
      fetchUserImages(user.id);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error deleting image",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (imageUrl: string, prompt: string) => {
    sessionStorage.setItem('editImage', JSON.stringify({ imageUrl, prompt }));
    navigate("/app");
  };

  const generatePagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === 2 && pages[pages.length - 1] !== 2) {
        pages.push("...");
      } else if (i === totalPages - 1 && pages[pages.length - 1] !== totalPages - 1) {
        pages.push("...");
      }
    }
    return pages;
  };

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
            <Image className="h-8 w-8 text-blue-600" />
            Your Image Library
          </h1>
          <p className="text-muted-foreground mt-2">
            View, download, and manage your generated images
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="aspect-square bg-muted animate-pulse" />
              </Card>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-white shadow-sm border-muted-foreground/25">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">
              Generate some images to see them here
            </p>
            <Button onClick={() => navigate("/app")} className="bg-blue-600 hover:bg-blue-700">Generate Images</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="relative aspect-square">
                    <img 
                      src={image.image_url} 
                      alt={image.title || "Generated image"} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40" 
                        onClick={() => handleDownload(image.image_url, image.title)}
                      >
                        <Download className="h-4 w-4 text-white" />
                        <span className="sr-only">Download</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40" 
                        onClick={() => handleEdit(image.image_url, image.prompt)}
                      >
                        <Edit className="h-4 w-4 text-white" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40 hover:border-red-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this image from your library.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDelete(image.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardFooter className="p-3 bg-white">
                    <p className="text-sm truncate w-full" title={image.title || image.prompt}>
                      {image.title || (image.prompt?.substring(0, 30) + "...") || "Untitled"}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    
                    {generatePagination().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(page as number)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;
