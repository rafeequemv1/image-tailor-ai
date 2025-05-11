
import React, { useState } from "react";
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
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  
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
            className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition"
            onClick={() => setIsDrawingModalOpen(true)}
          >
            <div className="flex flex-col items-center">
              <Pencil className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Create a drawing to use as reference
              </p>
            </div>
          </Button>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
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
