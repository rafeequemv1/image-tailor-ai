
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  makeTransparent: boolean;
  setMakeTransparent: (make: boolean) => void;
  mode?: "generate" | "edit";
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt,
  makeTransparent,
  setMakeTransparent,
  mode = "generate"
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
