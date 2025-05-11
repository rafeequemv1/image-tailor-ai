
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import APIKeyInput from "@/components/APIKeyInput";
import { generateImage } from "@/services/imageService";

const Index = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [mode, setMode] = useState<"generate" | "edit">("generate");
  const [enableMasking, setEnableMasking] = useState<boolean>(false);
  const [maskImage, setMaskImage] = useState<File | null>(null);

  // Load API key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleImageUpload = (files: File[]) => {
    setImages(files);
    // If user uploads an image, automatically switch to edit mode
    if (files.length > 0 && mode === "generate") {
      setMode("edit");
    }
  };
  
  const handleMaskChange = (mask: File | null) => {
    setMaskImage(mask);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your OpenAI API key in the settings tab.",
        variant: "destructive",
      });
      setActiveTab("settings");
      return;
    }

    if (!prompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to guide the image generation.",
        variant: "destructive",
      });
      return;
    }

    // For edit mode, make sure there's an image
    if (mode === "edit" && images.length === 0) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image to edit.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateImage({
        apiKey,
        images: mode === "edit" ? images : [],
        prompt,
        makeTransparent,
        maskImage: enableMasking ? maskImage : null,
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
      
      // Clear uploaded images and masks after successful generation
      setImages([]);
      setMaskImage(null);
      
      // Reset to generate mode after successful operation
      setMode("generate");
      setEnableMasking(false);
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
                <CardTitle>{mode === "edit" ? "Edit Image" : "Generate Image"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={mode === "generate" ? "default" : "outline"}
                    onClick={() => {
                      setMode("generate");
                      setEnableMasking(false);
                    }}
                    className="flex-1"
                  >
                    Generate
                  </Button>
                  <Button
                    variant={mode === "edit" ? "default" : "outline"}
                    onClick={() => setMode("edit")}
                    className="flex-1"
                  >
                    Edit Image
                  </Button>
                </div>
                
                <PromptInput 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  makeTransparent={makeTransparent}
                  setMakeTransparent={setMakeTransparent}
                  mode={mode}
                />
                
                {mode === "edit" && (
                  <div className="flex items-center space-x-2 pt-2 pb-2">
                    <Switch
                      id="masking-mode"
                      checked={enableMasking}
                      onCheckedChange={(checked) => {
                        setEnableMasking(checked);
                        if (!checked) setMaskImage(null);
                      }}
                    />
                    <Label htmlFor="masking-mode">Enable selective editing (masking)</Label>
                    
                    {enableMasking && (
                      <div className="ml-auto">
                        <p className="text-xs text-muted-foreground">
                          Use the brush to highlight areas to edit
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {mode === "edit" && (
                  <div className="pt-2 pb-2">
                    <p className="text-sm text-muted-foreground">
                      {images.length === 0 ? 
                        "Upload an image to edit. The prompt will guide how the image is modified." :
                        enableMasking ? 
                          "Highlight the areas you want to edit. Only highlighted areas will be modified." :
                          "Your uploaded image will be edited based on the prompt."
                      }
                    </p>
                  </div>
                )}
                
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  onMaskChange={handleMaskChange}
                  currentImages={images} 
                  mode={mode}
                  enableMasking={enableMasking}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !prompt || (mode === "edit" && images.length === 0)} 
                  className="w-full"
                >
                  {isLoading ? "Processing..." : mode === "edit" ? "Edit Image" : "Generate Image"}
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
