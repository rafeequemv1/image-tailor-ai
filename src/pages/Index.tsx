import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";

const Index = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [imageQuality, setImageQuality] = useState<string>("auto");
  const [imageSize, setImageSize] = useState<string>("square");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPrompt, setLastPrompt] = useState<string>("");

  const handleGenerate = async (updatePrompt?: string) => {
    const currentPrompt = updatePrompt || prompt;
    
    if (!currentPrompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to guide the image generation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // If this is an update to an existing image, we'll use the new prompt
    // otherwise we'll use the prompt from the input field
    const finalPrompt = updatePrompt 
      ? `${lastPrompt}. Update it by: ${updatePrompt}` 
      : currentPrompt;

    // Save this prompt as the last used prompt for potential future updates
    if (!updatePrompt) {
      setLastPrompt(currentPrompt);
    }

    try {
      const response = await generateImage({
        prompt: finalPrompt,
        makeTransparent,
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

      // Clear the prompt input if this was an initial generation (not an update)
      if (!updatePrompt) {
        setPrompt("");
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

  const handleUpdateImage = (updatePrompt: string) => {
    handleGenerate(updatePrompt);
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

            <Button 
              onClick={() => handleGenerate()}
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
            <ResultDisplay 
              result={result} 
              isLoading={isLoading} 
              onUpdateImage={handleUpdateImage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
