
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  makeTransparent: boolean;
  setMakeTransparent: (make: boolean) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt,
  makeTransparent,
  setMakeTransparent
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
            You can generate images with just a prompt, transform uploaded images, or use inpainting with a mask
          </p>
        </div>
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
