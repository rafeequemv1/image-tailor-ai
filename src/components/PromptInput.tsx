
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Beaker, Cube } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  makeTransparent: boolean;
  setMakeTransparent: (make: boolean) => void;
  mode?: "generate" | "edit";
  style?: string;
  setStyle?: (style: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt,
  makeTransparent,
  setMakeTransparent,
  mode = "generate",
  style = "",
  setStyle = () => {}
}) => {
  const handleStyleSelect = (selectedStyle: string) => {
    setStyle(selectedStyle === style ? "" : selectedStyle);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-foreground"
        >
          Prompt (Required)
        </label>
        <div>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === "edit" 
                ? "Describe how to edit the uploaded image..." 
                : "Describe what you want to generate..."
            }
            className="w-full"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "edit" 
              ? "The prompt will guide how your image is transformed" 
              : "Describe the image you want to generate in detail"
            }
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Style Presets (BioRender)
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={style === "2D biorender" ? "default" : "outline"}
            onClick={() => handleStyleSelect("2D biorender")}
            className="flex items-center gap-2"
          >
            <Beaker className="h-4 w-4" />
            2D BioRender
          </Button>
          <Button
            type="button" 
            size="sm"
            variant={style === "3D biorender" ? "default" : "outline"}
            onClick={() => handleStyleSelect("3D biorender")}
            className="flex items-center gap-2"
          >
            <Cube className="h-4 w-4" />
            3D BioRender
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Select a style preset to apply to your generated image
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="transparency-mode"
          checked={makeTransparent}
          onCheckedChange={setMakeTransparent}
        />
        <Label htmlFor="transparency-mode">Make background transparent</Label>
      </div>
    </div>
  );
};

export default PromptInput;
