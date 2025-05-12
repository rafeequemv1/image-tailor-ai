import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Beaker, FlaskConical } from "lucide-react";

const App = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Static API key for demo purposes
  const apiKey = "demo-key";
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [editPrompt, setEditPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("none");
  const [quality, setQuality] = useState<string>("standard");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };
  
  const handleEditPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPrompt(e.target.value);
  };

  // New function to handle applying edits to the current image
  const handleApplyEdit = async (editPromptText: string, currentImageUrl: string) => {
    if (!editPromptText) {
      toast({
        title: "No Edit Prompt",
        description: "Please enter a prompt to guide the image editing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, fetch the current image as a File object
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const imageFile = new File([blob], "reference-image.png", { type: blob.type });
      
      // Create a new array with just the reference image
      const imageFiles = [imageFile];
      
      // Call the image service with the edit prompt and the current image as reference
      const generationResponse = await generateImage({
        apiKey,
        images: imageFiles,
        prompt: editPromptText,
        makeTransparent,
        style,
        quality,
      });

      if (!generationResponse.success) {
        throw new Error(generationResponse.error || "Failed to edit image");
      }

      // Update the result with the edited image
      let imageUrl;
      if (generationResponse.data?.b64_json) {
        imageUrl = `data:image/png;base64,${generationResponse.data.b64_json}`;
        setResult(imageUrl);
      } 
      else if (generationResponse.data?.url) {
        imageUrl = generationResponse.data.url;
        setResult(imageUrl);
      } else {
        throw new Error("No image data received");
      }
      
      // Update the prompt to reflect the edit prompt
      setPrompt(editPromptText);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Edit Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to guide the scientific icon generation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateImage({
        apiKey,
        images,
        prompt,
        makeTransparent,
        style,
        quality,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate icon");
      }

      // If we have a base64 string, use it directly
      let imageUrl;
      if (response.data?.b64_json) {
        imageUrl = `data:image/png;base64,${response.data.b64_json}`;
        setResult(imageUrl);
      } 
      // Otherwise use the URL
      else if (response.data?.url) {
        imageUrl = response.data.url;
        setResult(imageUrl);
      } else {
        throw new Error("No icon data received");
      }
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Sci-icons Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create stunning scientific icons and illustrations with our AI-powered generator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                makeTransparent={makeTransparent}
                setMakeTransparent={setMakeTransparent}
                style={style}
                setStyle={setStyle}
                quality={quality}
                setQuality={setQuality}
              />
              <ImageUploader onImageUpload={handleImageUpload} />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt} 
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Scientific Icon"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResultDisplay 
                result={result} 
                isLoading={isLoading} 
                prompt={prompt}
                onApplyEdit={handleApplyEdit}
                hideLibraryButton={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
