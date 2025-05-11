import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";
import IconGallery from "@/components/IconGallery";

const Index = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [imageQuality, setImageQuality] = useState<string>("auto");
  const [imageSize, setImageSize] = useState<string>("square");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [mode, setMode] = useState<"generate" | "edit">("generate");
  const [enableMasking, setEnableMasking] = useState<boolean>(false);
  const [maskImage, setMaskImage] = useState<File | null>(null);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);

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
        quality: imageQuality,
        size: imageSize,
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

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setReferenceImages(newFiles);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2">
          <img src="/lovable-uploads/9a3cd3bf-f8a7-4414-b9c5-3e4b3017882d.png" alt="Sci-Icons Logo" className="h-8 w-8" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Sci-Icons
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Generate scientific icons with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Image Description
              </label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate. Be specific about style, colors, subjects, and composition."
                className="w-full h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="image-quality" className="block text-sm font-medium mb-2">
                  Image Quality
                </label>
                <Select value={imageQuality} onValueChange={setImageQuality}>
                  <SelectTrigger id="image-quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Default)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="image-size" className="block text-sm font-medium mb-2">
                  Image Size
                </label>
                <Select value={imageSize} onValueChange={setImageSize}>
                  <SelectTrigger id="image-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square (1024×1024)</SelectItem>
                    <SelectItem value="portrait">Portrait (1024×1792)</SelectItem>
                    <SelectItem value="landscape">Landscape (1792×1024)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="transparency-mode"
                checked={makeTransparent}
                onCheckedChange={setMakeTransparent}
              />
              <Label htmlFor="transparency-mode">Transparent Background</Label>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                For best results, be detailed in your description including style, mood, lighting, and composition.
                <br />
                Examples: "A serene mountain landscape at sunset with pink and purple hues", "A futuristic
                cyberpunk city with neon lights"
              </p>
              <p className="text-xs text-amber-500">
                Note: The system will automatically retry if rate limits are encountered. If errors persist, please wait
                a minute before trying again.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="reference-images" className="block text-sm font-medium">
                Reference Images (Optional)
              </label>
              <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                   onClick={() => document.getElementById("reference-upload")?.click()}>
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm">Upload Reference</p>
                </div>
                <input 
                  id="reference-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleReferenceUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload reference images to guide the scientific icon generation (optional).
              </p>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !prompt} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Image"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Note: If generation fails due to rate limits, the system will automatically retry up to 3 times.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <ResultDisplay result={result} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Icon Gallery</h2>
        <IconGallery />
      </div>
    </div>
  );
};

export default Index;
