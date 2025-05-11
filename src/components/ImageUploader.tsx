
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
  currentImages?: File[];
  mode?: "generate" | "edit";
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  currentImages = [], 
  mode = "generate" 
}) => {
  const [files, setFiles] = useState<File[]>(currentImages);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Reset previews when currentImages changes
    setFiles(currentImages);
    setPreviews([]);
    
    // Create and store image previews for currentImages
    if (currentImages.length > 0) {
      currentImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [currentImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // In edit mode, we replace the current image(s)
      if (mode === "edit") {
        setFiles(newFiles);
        setPreviews([]);
        
        // Create previews for new files
        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPreviews((prev) => [...prev, e.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
        
        // Pass only the new files to the parent
        onImageUpload(newFiles);
      } else {
        // In generate mode, we add to the current image(s)
        setFiles((prev) => [...prev, ...newFiles]);
        
        // Create previews for new files
        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPreviews((prev) => [...prev, e.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
        
        // Pass all files to the parent
        onImageUpload([...files, ...newFiles]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onImageUpload(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">
          {mode === "edit" ? "Upload Image to Edit" : "Upload Images (Optional)"}
        </h3>
        {mode === "edit" ? (
          <p className="text-xs text-muted-foreground">Required for editing</p>
        ) : (
          <p className="text-xs text-muted-foreground">Optional for generation</p>
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 border-muted-foreground/25 hover:bg-muted/50 transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG (MAX. 5MB)
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple={mode !== "edit"}
            onChange={handleFileChange}
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            {mode === "edit" ? "Image to Edit" : "Uploaded Images"}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={preview}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
