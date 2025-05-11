
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  makeTransparent: boolean;
  setMakeTransparent: (make: boolean) => void;
  preset: string;
  setPreset: (preset: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt,
  makeTransparent,
  setMakeTransparent,
  preset,
  setPreset
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
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="transparency-mode"
              checked={makeTransparent}
              onCheckedChange={setMakeTransparent}
            />
            <Label htmlFor="transparency-mode">Make background transparent</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="preset-style" className="block text-sm font-medium text-foreground">
            Preset Style
          </label>
          <Select value={preset} onValueChange={setPreset}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a preset style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No preset</SelectItem>
              <SelectItem value="2D biorender">2D Biorender</SelectItem>
              <SelectItem value="3D biorender">3D Biorender</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a style preset to enhance your image generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
