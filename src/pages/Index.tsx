import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";

const Index = () => {
  const { toast } = useToast();
  // Hardcoded API key - replace with a valid OpenAI API key
  const apiKey = "sk-your-openai-api-key-here";
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("none");
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Powered by OpenAI's GPT-Image-1 model</p>
      </footer>
    </div>
  );
};

export default Index;
