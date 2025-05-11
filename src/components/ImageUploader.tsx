
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Brush } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
  onMaskUpload?: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onMaskUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [mask, setMask] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [maskPreview, setMaskPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("images");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      // Create and store image previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });

      // Pass the files to the parent component
      onImageUpload([...files, ...newFiles]);
    }
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const maskFile = e.target.files[0];
      setMask(maskFile);

      // Create mask preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMaskPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(maskFile);

      // Pass the mask to the parent component
      if (onMaskUpload) {
        onMaskUpload(maskFile);
      }
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onImageUpload(files.filter((_, i) => i !== index));
  };

  const removeMask = () => {
    setMask(null);
    setMaskPreview(null);
    if (onMaskUpload) {
      onMaskUpload(null);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="mask">Mask (Inpainting)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Upload Images</h3>
            <p className="text-xs text-muted-foreground">You can upload multiple images</p>
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
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>

          {previews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
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
        </TabsContent>
        
        <TabsContent value="mask">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Upload Mask</h3>
              <p className="text-xs text-muted-foreground">For inpainting (transparent areas will be edited)</p>
            </div>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="mask-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 border-muted-foreground/25 hover:bg-muted/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Brush className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Upload a mask</span> for inpainting
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG with alpha channel (transparent areas will be edited)
                  </p>
                </div>
                <input
                  id="mask-upload"
                  type="file"
                  className="hidden"
                  accept="image/png"
                  onChange={handleMaskChange}
                />
              </label>
            </div>

            {maskPreview && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Uploaded Mask</h3>
                <div className="relative group border rounded-lg overflow-hidden aspect-square">
                  <img
                    src={maskPreview}
                    alt="Mask"
                    className="w-full h-full object-cover"
                    style={{ backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50%/20px 20px" }}
                  />
                  <button
                    onClick={removeMask}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUploader;
