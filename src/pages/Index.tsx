
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import IconGallery from "@/components/IconGallery";
import Navbar from "@/components/Navbar";
import { generateImage } from "@/services/imageService";
import { useNavigate } from "react-router-dom";

interface Icon {
  id: string;
  url: string;
  prompt: string;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(true);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    // If not authenticated, redirect to landing page
    if (!authStatus) {
      navigate("/landing");
      return;
    }
    
    // Load API key from local storage
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
    
    // Load any previously generated icons
    const savedIcons = localStorage.getItem("sci_icons");
    if (savedIcons) {
      try {
        setIcons(JSON.parse(savedIcons));
      } catch (e) {
        console.error("Failed to parse saved icons");
      }
    }
  }, [navigate]);

  // Save API key when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("openai_api_key", apiKey);
    }
  }, [apiKey]);

  // Save icons when they change
  useEffect(() => {
    if (icons.length > 0) {
      localStorage.setItem("sci_icons", JSON.stringify(icons));
    }
  }, [icons]);

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt to generate an icon.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const scientificPrompt = `Scientific icon of ${prompt}, simple, professional, high quality`;
      
      const response = await generateImage({
        apiKey,
        images: [],
        prompt: scientificPrompt,
        makeTransparent,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate icon");
      }

      const iconUrl = response.data?.url;
      
      if (!iconUrl) {
        throw new Error("No image data received");
      }
      
      const newIcon = {
        id: Date.now().toString(),
        url: iconUrl,
        prompt: scientificPrompt,
      };

      setIcons((prev) => [newIcon, ...prev]);
      
      toast({
        title: "Icon generated",
        description: "Your scientific icon was generated successfully!",
      });
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

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generate Scientific Icons</h1>
          
          {/* API Key Input */}
          <div className="mb-6">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>
          
          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Describe your scientific icon</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., DNA double helix, quantum physics model, chemical structure..."
                className="mb-2"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="transparency-mode"
                checked={makeTransparent}
                onCheckedChange={setMakeTransparent}
              />
              <Label htmlFor="transparency-mode">Transparent background</Label>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !prompt || !apiKey} 
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Icon"}
            </Button>
          </div>
        </div>
        
        {/* Icon Gallery */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Icons</h2>
          <IconGallery icons={icons} isLoading={isLoading} />
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sci-Icons. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
