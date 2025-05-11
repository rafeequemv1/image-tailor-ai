
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import APIKeyInput from "@/components/APIKeyInput";
import { generateImage } from "@/services/imageService";

const Index = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [mask, setMask] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("generate");

  // Load API key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };
  
  const handleMaskUpload = (file: File | null) => {
    setMask(file);
  };

  const handleGenerate = async () => {
    // API key is hardcoded in the service as requested
    
    if (!prompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to guide the image generation.",
        variant: "destructive",
      });
      return;
    }

    // Check if both image and mask are provided for inpainting
    if (mask && images.length === 0) {
      toast({
        title: "Missing Image",
        description: "You've uploaded a mask but no image. Please upload an image to apply the mask to.",
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
        mask,
        prompt,
        makeTransparent,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate image");
      }

      // If we have a base64 string, use it directly
      if (response.data?.b64_json) {
        setResult(`data:image/png;base64,${response.data.b64_json}`);
      } 
      // Otherwise use the URL
      else if (response.data?.url) {
        setResult(response.data.url);
      } else {
        throw new Error("No image data received");
      }
      
      // Clear uploaded images after successful generation to prevent caching issues
      setImages([]);
      setMask(null);
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Transform your images or generate new ones with OpenAI's powerful models
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mask && (
                  <Alert className="bg-blue-50 border-blue-200 mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Inpainting Mode Active</AlertTitle>
                    <AlertDescription>
                      You've uploaded a mask. The transparent areas of the mask will be edited according to your prompt, 
                      while the opaque areas will remain unchanged.
                    </AlertDescription>
                  </Alert>
                )}
                <PromptInput 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  makeTransparent={makeTransparent}
                  setMakeTransparent={setMakeTransparent}
                />
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  onMaskUpload={handleMaskUpload} 
                />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !prompt} 
                  className="w-full"
                >
                  {isLoading ? "Generating..." : "Generate Image"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultDisplay result={result} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <APIKeyInput apiKey={apiKey} setApiKey={setApiKey} />
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">About Inpainting</h3>
                <p className="text-sm text-muted-foreground">
                  Inpainting allows you to selectively edit parts of an image using a mask. The transparent areas of 
                  the mask indicate where your image will be edited according to your prompt, while the opaque areas 
                  will remain unchanged.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  For best results, use a PNG mask with an alpha channel where transparent areas mark what should be 
                  modified.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Powered by OpenAI's GPT-Image-1 and DALL-E 3 models</p>
      </footer>
    </div>
  );
};

export default Index;
