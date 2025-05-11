
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Save, Share } from "lucide-react";

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
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
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Save className="mr-2 h-4 w-4" />
          Save to Library
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ResultDisplay;
