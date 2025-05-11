
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Gallery, Download, Trash2, Edit } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Library = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 12;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      fetchImages(currentPage);
    };
    
    checkUser();
  }, [navigate, currentPage]);

  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      // Count total images first to calculate pagination
      const { count, error: countError } = await supabase
        .from('user_images')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Calculate total pages
      const totalPages = Math.ceil((count || 0) / imagesPerPage);
      setTotalPages(totalPages || 1);
      
      // Then fetch the current page of images
      const from = (page - 1) * imagesPerPage;
      const to = from + imagesPerPage - 1;
      
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Failed to load images",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, title: string) => {
    // Create a temporary link element
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${title || `ai-image-${Date.now()}`}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the image from state
      setImages(images.filter(img => img.id !== id));
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from your library",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEditImage = (imageUrl: string, prompt: string) => {
    // Store the edit information in session storage
    sessionStorage.setItem('editImage', JSON.stringify({
      imageUrl,
      prompt
    }));
    // Navigate to the image editor
    navigate('/app');
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pagination numbers around the current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  isActive={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-2">
            <Gallery className="h-8 w-8 text-blue-600" />
            Your Image Library
          </h1>
          <p className="text-muted-foreground mt-2">
            All your AI-generated images in one place
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardFooter className="p-4 flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg bg-muted/30 border-muted-foreground/25">
            <Gallery className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">
              Generate some images to see them here
            </p>
            <Button onClick={() => navigate("/app")}>
              Create New Image
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group">
                  <div className="aspect-square relative">
                    <img 
                      src={image.image_url} 
                      alt={image.title || "Generated image"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleDownload(image.image_url, image.title)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleEditImage(image.image_url, image.prompt || "")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardFooter className="p-3 flex flex-col items-start gap-1">
                    <h3 className="font-medium text-sm truncate w-full">
                      {image.title || "Untitled Image"}
                    </h3>
                    {image.prompt && (
                      <p className="text-xs text-muted-foreground truncate w-full">
                        {image.prompt.length > 50 ? `${image.prompt.slice(0, 50)}...` : image.prompt}
                      </p>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 mb-4">
              {renderPagination()}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Library;
