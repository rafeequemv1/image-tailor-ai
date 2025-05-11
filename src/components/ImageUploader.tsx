
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DrawingModal from "./DrawingModal";

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  
  // Generate preview urls when files change
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setFilePreviewUrls(urls);
    
    // Cleanup function to revoke object URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Basic validation
      const validFiles = selectedFiles.filter(file => {
        const isValid = file.type.startsWith('image/');
        if (!isValid) {
          toast({
            title: "Invalid file",
            description: `${file.name} is not a valid image file`,
            variant: "destructive",
          });
        }
        return isValid;
      });
      
      if (validFiles.length > 0) {
        setFiles(validFiles);
        onImageUpload(validFiles);
        toast({
          title: "Images added",
          description: `${validFiles.length} image(s) ready for processing`,
        });
      }
    }
  };

  const handleSaveDrawing = (file: File) => {
    setFiles([file]);
    onImageUpload([file]);
    toast({
      title: "Drawing added",
      description: "Your drawing is ready to be used as a reference",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="image-upload"
            className="cursor-pointer block w-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload an image or drag and drop here
            </p>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </label>
        </div>
        
        <div>
          <Button
            variant="outline"
            className="w-full h-full min-h-[118px] border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition"
            onClick={() => setIsDrawingModalOpen(true)}
          >
            <div className="flex flex-col items-center">
              <Pencil className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center px-4 break-words">
                Create a drawing to use as reference
              </p>
            </div>
          </Button>
        </div>
      </div>
      
      {filePreviewUrls.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Selected images:</p>
          <div className="grid grid-cols-2 gap-2">
            {filePreviewUrls.map((url, index) => (
              <div key={index} className="relative overflow-hidden rounded-md border border-muted">
                <img 
                  src={url} 
                  alt={`Selected image ${index + 1}`} 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-xs text-white truncate">{files[index].name}</p>
                  <p className="text-xs text-white/80">{Math.round(files[index].size / 1024)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Drawing Modal */}
      <DrawingModal 
        open={isDrawingModalOpen} 
        onOpenChange={setIsDrawingModalOpen} 
        onSaveDrawing={handleSaveDrawing} 
      />
    </div>
  );
};

export default ImageUploader;
