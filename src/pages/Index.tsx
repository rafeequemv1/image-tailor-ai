
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const { toast } = useToast();
  // Updated API key with the provided key
  const apiKey = "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";
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("none");
  const [quality, setQuality] = useState<string>("standard");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to guide the image generation.",
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
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Image Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Transform your images or generate new ones with OpenAI's powerful models
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
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
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground py-4">
        <p>Powered by OpenAI's GPT-Image-1 model</p>
      </footer>
    </div>
  );
};

export default Index;
