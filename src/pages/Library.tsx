
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  image_url: string;
  prompt: string;
  title: string;
  created_at: string;
}

const Library = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<UserImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const imagesPerPage = 12;
  
  // Sample/demo images
  const demoImages: UserImage[] = [
    {
      id: "1",
      image_url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=400&h=400",
      prompt: "A colorful abstract scientific illustration",
      title: "Molecular Visualization",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      image_url: "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=400&h=400",
      prompt: "Scientific icon showing DNA structure",
      title: "DNA Model",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&h=400",
      prompt: "Microscope icon for science app",
      title: "Modern Microscope",
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      image_url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&h=400",
      prompt: "Science lab equipment illustration",
      title: "Laboratory Setup",
      created_at: new Date().toISOString()
    }
  ];

  // Load demo images on component mount
  React.useEffect(() => {
    setImages(demoImages);
    setTotalPages(1);
    setIsLoading(false);
  }, []);

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
    // Simulate delete process
    setTimeout(() => {
      setImages(images.filter(image => image.id !== imageId));
      toast({
        title: "Image deleted",
        description: "The image has been successfully deleted from your library",
      });
      setIsLoading(false);
    }, 500);
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

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-2">
            <Image className="h-8 w-8 text-blue-600" />
            Your Image Library
          </h1>
          <p className="text-muted-foreground mt-2">
            View, download, and manage your generated images
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
              </Card>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg bg-muted/30 border-muted-foreground/25">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">
              Generate some images to see them here
            </p>
            <Button onClick={() => navigate("/app")}>Generate Images</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group">
                  <div className="relative aspect-square">
                    <img 
                      src={image.image_url} 
                      alt={image.title || "Generated image"} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40" 
                        onClick={() => handleDownload(image.image_url, image.title)}
                      >
                        <Download className="h-3 w-3 text-white" />
                        <span className="sr-only">Download</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40" 
                        onClick={() => handleEdit(image.image_url, image.prompt)}
                      >
                        <Edit className="h-3 w-3 text-white" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/40 hover:border-red-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3 text-white" />
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
                  <CardFooter className="p-2">
                    <p className="text-xs truncate w-full" title={image.title || image.prompt}>
                      {image.title || (image.prompt?.substring(0, 20) + "...") || "Untitled"}
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
