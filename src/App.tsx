import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";
import ResultDisplay from "@/components/ResultDisplay";
import { generateImage } from "@/services/imageService";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const App = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Updated API key with the provided key
  const apiKey = "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";
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [editPrompt, setEditPrompt] = useState<string>("");
  const [makeTransparent, setMakeTransparent] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("none");
  const [quality, setQuality] = useState<string>("standard");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUser(session.user);
    };
    
    checkUser();
    
    // Check if there's an edit request from the library
    const editImageData = sessionStorage.getItem('editImage');
    if (editImageData) {
      try {
        const { imageUrl, prompt } = JSON.parse(editImageData);
        // Fetch the image as a File object
        fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "reference-image.png", { type: blob.type });
            setImages([file]);
            setPrompt(prompt || "");
            // Clear the sessionStorage after processing
            sessionStorage.removeItem('editImage');
            
            toast({
              title: "Ready to edit",
              description: "Your image has been loaded for editing",
            });
          });
      } catch (error) {
        console.error("Error processing edit image data:", error);
      }
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };
  
  const handleEditPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPrompt(e.target.value);
  };

  // Automatically save the generated image to the user's library
  const saveImageToLibrary = async (imageUrl: string, promptText: string) => {
    try {
      // Get the current logged in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save images to your library",
          variant: "destructive",
        });
        return;
      }

      // Generate a title based on the prompt
      const title = promptText.length > 30 
        ? `${promptText.substring(0, 30)}...` 
        : promptText || "Untitled Image";

      // Save the image data to Supabase
      const { data, error } = await supabase
        .from('user_images')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          prompt: promptText,
          title: title,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Image saved to library",
        description: "Your image has been automatically saved to your personal library",
      });
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "An unknown error occurred while saving",
        variant: "destructive",
      });
    }
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
      
      // Auto-save the edited image
      await saveImageToLibrary(imageUrl, editPromptText);
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
        throw new Error("No image data received");
      }
      
      // Auto-save the generated image
      await saveImageToLibrary(imageUrl, prompt);
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

  if (!user) return null;

  return (
    <div className="flex flex-col">
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
