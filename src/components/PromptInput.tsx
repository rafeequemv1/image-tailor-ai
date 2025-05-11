
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Image, Box, Square } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  makeTransparent: boolean;
  setMakeTransparent: (make: boolean) => void;
  style?: string;
  setStyle?: (style: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt,
  makeTransparent,
  setMakeTransparent,
  style,
  setStyle
}) => {
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
            placeholder="Describe what you want to generate or how to transform uploaded images..."
            className="w-full"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            You can generate images with just a prompt, or transform uploaded images
          </p>
        </div>
      </div>
      
      {setStyle && (
        <div className="space-y-2">
          <label
            htmlFor="style"
            className="block text-sm font-medium text-foreground"
          >
            Style Preset
          </label>
          <Select
            value={style}
            onValueChange={setStyle}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2d-biorender" className="flex items-center">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  <span>2D: Biorender Style</span>
                </div>
              </SelectItem>
              <SelectItem value="3d-biorender" className="flex items-center">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  <span>3D: Biorender Style</span>
                </div>
              </SelectItem>
              <SelectItem value="none" className="flex items-center">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span>Default: OpenAI Standard</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
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
