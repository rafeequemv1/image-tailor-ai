
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Save, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  const { toast } = useToast();
  const [progress, setProgress] = React.useState(0);

  // Simulate progress when loading
  React.useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 90% to simulate waiting for API
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 90 ? 1 : 0;
          const newValue = Math.min(prev + increment, 90);
          return newValue;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        // When loading completes, jump to 100%
        if (!isLoading) {
          setProgress(100);
          // Reset after animation completes
          const timeout = setTimeout(() => setProgress(0), 1000);
          return () => clearTimeout(timeout);
        }
      };
    } else if (result) {
      // When result comes in, complete the progress
      setProgress(100);
      // Reset after animation completes
      const timeout = setTimeout(() => setProgress(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, result]);

  const handleDownload = () => {
    if (!result) return;
    
    // Create a temporary link element
    const a = document.createElement("a");
    a.href = result;
    a.download = `ai-generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
  };

  const handleSave = () => {
    // This would typically save to a database or localStorage
    toast({
      title: "Image saved to library",
      description: "Your image has been saved to your library",
    });
  };

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: "My AI Generated Image",
        text: "Check out this image I created with AI!",
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Generating image...</h3>
        <div className="w-full aspect-square relative">
          <Skeleton className="w-full h-full absolute inset-0 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-6 p-6">
            <div className="text-center space-y-2">
              <div className="text-xl font-semibold animate-fade-in">Creating your masterpiece</div>
              <p className="text-muted-foreground">AI is processing your request</p>
            </div>
            <Progress value={progress} className="w-full max-w-xs animate-fade-in" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg bg-muted/30 border-muted-foreground/25">
        <div className="text-center">
          <p className="text-muted-foreground">
            Your generated image will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Result</h3>
      <div className="w-full relative rounded-lg overflow-hidden">
        <img
          src={result}
          alt="Generated result"
          className="w-full object-contain"
        />
      </div>
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
    </div>
  );
};

export default ResultDisplay;
