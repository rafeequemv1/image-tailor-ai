
import React from "react";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-foreground"
      >
        Prompt
      </label>
      <div>
        <Input
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how to transform the image(s)..."
          className="w-full"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Be specific about the changes you want to see
        </p>
      </div>
    </div>
  );
};

export default PromptInput;
