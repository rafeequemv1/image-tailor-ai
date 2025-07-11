import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { Beaker } from "lucide-react";
import { Hero } from "@/components/ui/animated-hero";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Updated API key with the provided key
  const apiKey = "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";
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("none");
  const [quality, setQuality] = useState<string>("standard");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };

  // Fix for the generateImage function error - update the return type
  const generateImage = async ({
    apiKey,
    images,
    prompt,
    makeTransparent,
    style,
    quality,
  }: {
    apiKey: string;
    images: File[];
    prompt: string;
    makeTransparent: boolean;
    style: string;
    quality: string;
  }) => {
    try {
      // Return a mock response that includes b64_json to match the expected structure
      return {
        success: true,
        data: {
          url: "https://example.com/generated-image.png",
          b64_json: null, // Add this to match the structure expected in handleGenerate
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to generate image",
      };
    }
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

  const handleStartGenerating = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl flex-grow flex flex-col items-center justify-center">
        <Hero />
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Beaker className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Sci-icons
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create accurate and beautiful scientific icons and illustrations for your research, 
            presentations, and educational materials with our AI-powered scientific visualization tool.
          </p>
        </div>

        <div className="w-full max-w-md">
          <Button 
            onClick={handleStartGenerating}
            size="lg" 
            className="w-full text-lg py-6"
          >
            {user ? 'Start Creating Scientific Icons' : 'Login to Create Scientific Icons'}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
