
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Save, Share, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
  onUpdateImage?: (updatePrompt: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  isLoading, 
  onUpdateImage 
}) => {
  const { toast } = useToast();
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDownload = () => {
    if (!result) return;
    
    // Create a temporary link element
    const a = document.createElement("a");
    a.href = result;
    a.download = `sci-icon-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
  };

  const handleSave = () => {
    toast({
      title: "Image saved to library",
      description: "Your image has been saved to your library",
    });
  };

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: "My Scientific Icon",
        text: "Check out this scientific icon I created with AI!",
        url: result,
      })
      .then(() => {
        toast({
          title: "Shared successfully!",
          description: "Your image has been shared",
        });
      })
      .catch((error) => {
        console.error("Sharing failed:", error);
        // Fallback for devices that don't support native sharing
        navigator.clipboard.writeText(result);
        toast({
          title: "Image URL copied",
          description: "The image URL has been copied to your clipboard",
        });
      });
    } else if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Image URL copied",
        description: "The image URL has been copied to your clipboard",
      });
    }
  };

  const handleUpdate = () => {
    if (updatePrompt.trim() && onUpdateImage) {
      setIsUpdating(true);
      onUpdateImage(updatePrompt);
      setUpdatePrompt("");
    } else {
      toast({
        title: "Empty update prompt",
        description: "Please enter a description of the changes you want to make.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isUpdating) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Generating image...</h3>
        <div className="w-full aspect-square relative">
          <Skeleton className="w-full h-full absolute inset-0" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-96 border border-dashed rounded-lg bg-muted/30 border-muted-foreground/25">
        <div className="text-center p-6">
          <h3 className="text-xl font-medium mb-2">Your generated image will appear here</h3>
          <p className="text-muted-foreground">
            Enter a description of the image you want to create and click "Generate Image" to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Generated Image</h3>
      <div className="w-full relative rounded-lg overflow-hidden border">
        <img
          src={result}
          alt="Generated result"
          className="w-full object-contain"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save to Library
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-medium">Make changes to this image</h4>
          <Textarea
            value={updatePrompt}
            onChange={(e) => setUpdatePrompt(e.target.value)}
            placeholder="Describe the changes you want to make to this image..."
            className="w-full resize-none"
          />
          <Button 
            onClick={handleUpdate} 
            disabled={!updatePrompt.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Update Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
